import whisper
import uuid
import librosa
import numpy as np
from typing import Dict, List


WHISPER_MODEL = "base"

AGENT_KEYWORDS = [
    "how can i help", "sir", "assist", "support",
    "would you like", "can i", "may i", "please"
]

CUSTOMER_KEYWORDS = [
    "i want", "i need", "buy", "purchase",
    "order", "looking for", "need to"
]

PAUSE_SWITCH_THRESHOLD = 1.2
PITCH_SPLIT_HZ = 165
LONG_SENTENCE_WORDS = 9

model = whisper.load_model(WHISPER_MODEL)


def _segment_id(idx: int) -> str:
    return f"seg_{idx}_{uuid.uuid4().hex[:6]}"


def _confidence_from_logprob(avg_logprob):
    if avg_logprob is None:
        return 0.5
    return round(max(0.0, min(1.0, 1.0 + avg_logprob)), 2)


def extract_audio_features(audio_path: str) -> Dict:
    y, sr = librosa.load(audio_path, sr=16000)

    rms = librosa.feature.rms(y=y)[0]
    pitches, _ = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[pitches > 0]

    return {
        "avg_rms": float(np.mean(rms)),
        "avg_pitch": float(np.mean(pitch_values)) if len(pitch_values) else 0.0
    }


def infer_speaker(
    text: str,
    start: float,
    prev_speaker: str | None,
    prev_end: float | None,
    audio_features: Dict
) -> str:
    text_l = text.lower()
    word_count = len(text.split())

    if any(k in text_l for k in AGENT_KEYWORDS):
        return "agent"

    if any(k in text_l for k in CUSTOMER_KEYWORDS):
        return "customer"

    if word_count >= LONG_SENTENCE_WORDS:
        return "agent"

    if audio_features["avg_pitch"] > 0:
        return "customer" if audio_features["avg_pitch"] > PITCH_SPLIT_HZ else "agent"

    if prev_end is not None:
        pause = start - prev_end
        if pause >= PAUSE_SWITCH_THRESHOLD:
            return "customer" if prev_speaker == "agent" else "agent"

    return prev_speaker or "agent"


def transcribe_audio(audio_path: str) -> Dict:
    audio_features = extract_audio_features(audio_path)

    result = model.transcribe(
        audio_path,
        language="en",
        fp16=False
    )

    segments: List[Dict] = []
    confidences = []

    prev_speaker = None
    prev_end = None

    for idx, seg in enumerate(result["segments"]):
        confidence = _confidence_from_logprob(seg.get("avg_logprob"))
        confidences.append(confidence)

        speaker = infer_speaker(
            text=seg["text"],
            start=seg["start"],
            prev_speaker=prev_speaker,
            prev_end=prev_end,
            audio_features=audio_features
        )

        segments.append({
            "segment_id": _segment_id(idx),
            "speaker": speaker,
            "start": round(seg["start"], 2),
            "end": round(seg["end"], 2),
            "text": seg["text"].strip(),
            "confidence": confidence
        })

        prev_speaker = speaker
        prev_end = seg["end"]

    overall_confidence = (
        round(sum(confidences) / len(confidences), 2)
        if confidences else 0.0
    )

    return {
        "language": result.get("language", "en"),
        "overall_confidence": overall_confidence,
        "diarization_available": True,
        "diarization_method": "heuristic (pitch + pauses + text)",
        "segments": segments
    }
