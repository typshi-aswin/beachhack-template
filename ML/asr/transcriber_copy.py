import uuid
import torch
from typing import Dict, List
import whisperx

asr_model = whisperx.load_model(
    WHISPER_MODEL,
    device=DEVICE,
    compute_type="float32",
    vad_model=None
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
WHISPER_MODEL = "base"



def _segment_id(idx: int) -> str:
    return f"seg_{idx}_{uuid.uuid4().hex[:6]}"


def _confidence_from_words(words: List[dict]) -> float:
    """
    Compute confidence from word-level probabilities (WhisperX aligned output)
    """
    if not words:
        return 0.5

    probs = [w.get("score", 0.5) for w in words if "score" in w]
    if not probs:
        return 0.5

    return round(sum(probs) / len(probs), 2)


def _map_speaker(label: str) -> str:
    """
    Normalize speaker labels
    """
    if label is None:
        return "unknown"
    if label.endswith("0") or label.endswith("1"):
        return "agent"
    return "customer"



print("🔹 Loading WhisperX ASR model...")
asr_model = whisperx.load_model(
    WHISPER_MODEL,
    device=DEVICE,
    compute_type="float32"
)

print("🔹 Loading alignment model...")
align_model, align_metadata = whisperx.load_align_model(
    language_code="en",
    device=DEVICE
)

diarization_pipeline = None
try:
    print("🔹 Loading WhisperX diarization pipeline...")
    diarization_pipeline = whisperx.DiarizationPipeline(
        use_auth_token=True,
        device=DEVICE
    )
except Exception as e:
    print("⚠️ WhisperX diarization unavailable:", e)



def transcribe_audio(audio_path: str) -> Dict:
    """
    Audio → aligned transcript → diarized speakers (optional)
    """

    # ---- Load audio ----
    audio = whisperx.load_audio(audio_path)

    # ---- Transcription (force English) ----
    result = asr_model.transcribe(
        audio,
        language="en",
        task="transcribe"
    )

    # ---- Alignment ----
    result = whisperx.align(
        result["segments"],
        align_model,
        align_metadata,
        audio,
        DEVICE,
        return_char_alignments=False
    )

    # ---- Diarization (optional) ----
    diarization_available = False
    if diarization_pipeline is not None:
        try:
            diarization = diarization_pipeline(audio)
            result = whisperx.assign_word_speakers(diarization, result)
            diarization_available = True
        except Exception as e:
            print("⚠️ Diarization failed:", e)

    # ---- Build final segments ----
    segments = []
    confidences = []

    for idx, seg in enumerate(result["segments"]):
        confidence = _confidence_from_words(seg.get("words", []))
        confidences.append(confidence)

        segments.append({
            "segment_id": _segment_id(idx),
            "speaker": _map_speaker(seg.get("speaker")),
            "start": round(seg["start"], 2),
            "end": round(seg["end"], 2),
            "text": seg["text"].strip(),
            "confidence": confidence
        })

    overall_confidence = (
        round(sum(confidences) / len(confidences), 2)
        if confidences else 0.0
    )

    return {
        "language": "en",
        "diarization_available": diarization_available,
        "speaker_inference_method": (
            "whisperx" if diarization_available else "none"
        ),
        "overall_confidence": overall_confidence,
        "segments": segments
    }
