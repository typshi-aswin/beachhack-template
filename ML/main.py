# main.py
from fastapi import FastAPI, UploadFile, File
from typing import List, Dict
import time, tempfile, shutil, asyncio

from asr.transcriber import transcribe_audio
from extraction.facts import extract_facts
from extraction.normalize import normalize_facts
from intent.classifier import classify_intent
from sentiment.sentiment import analyze_sentiment
from friction.score import compute_friction
from actions.suggest import suggest_actions
from summary.summary import generate_summary
from analytics.analytics_snapshot import build_analytics_snapshot
from analytics.context_diff import build_customer_snapshot, context_diff

app = FastAPI(title="ML Conversation Intelligence Service")

# ---------------- GLOBAL STORES ----------------
CONVERSATIONS: List[Dict] = []
LATEST_ANALYTICS_SNAPSHOT: Dict = {}
ANALYTICS_LAST_UPDATED: float | None = None
CUSTOMER_SNAPSHOTS: Dict[str, Dict] = {}

# ---------------- PIPELINE ----------------
def run_pipeline(
    conv_id: str,
    customer_id: str,
    segments: List[Dict],
    transcript_meta: Dict | None = None,
    past_interactions: int = 0,
    unresolved_issues: int = 0,
):
    start = time.time()

    facts = normalize_facts(extract_facts(segments))
    intent = classify_intent(segments)
    sentiment = analyze_sentiment(segments)

    friction = compute_friction(
        sentiment["score"],
        past_interactions,
        unresolved_issues
    )

    actions = suggest_actions(intent, friction, facts)
    summary = generate_summary(segments, intent, friction)

    transcript_quality = transcript_meta or {
        "overall_confidence": round(
            sum(s.get("confidence", 0.7) for s in segments) / max(len(segments), 1),
            2
        ),
        "notes": "Text-based input"
    }

    # -------- CONTEXT DIFF --------
    current_snapshot = build_customer_snapshot(facts, intent, friction)
    previous_snapshot = CUSTOMER_SNAPSHOTS.get(customer_id)

    diff = (
        context_diff(previous_snapshot, current_snapshot)
        if previous_snapshot else None
    )

    CUSTOMER_SNAPSHOTS[customer_id] = current_snapshot

    result = {
        "conv_id": conv_id,
        "customer_id": customer_id,
        "transcript_quality": transcript_quality,
        "facts": facts,
        "intent": intent,
        "friction": friction,
        "summary": summary,
        "suggested_actions": actions,
        "context_diff": diff,
        "ml_metadata": {
            "model_version": "ml_v1.0",
            "analysis_time_ms": int((time.time() - start) * 1000),
            "confidence_policy": "asr × extraction × reinforcement"
        }
    }

    CONVERSATIONS.append(result)
    return result

# ---------------- ANALYTICS LOOP ----------------
async def analytics_loop():
    global LATEST_ANALYTICS_SNAPSHOT, ANALYTICS_LAST_UPDATED
    while True:
        await asyncio.sleep(300)
        LATEST_ANALYTICS_SNAPSHOT = build_analytics_snapshot(CONVERSATIONS)
        ANALYTICS_LAST_UPDATED = int(time.time())

@app.on_event("startup")
async def startup():
    asyncio.create_task(analytics_loop())

# ---------------- ENDPOINTS ----------------
@app.post("/analyze-text")
def analyze_text(payload: Dict):
    segments = [
        {
            "segment_id": f"seg_{i}",
            "speaker": m.get("speaker", "customer"),
            "text": m["text"],
            "confidence": m.get("confidence", 0.85)
        }
        for i, m in enumerate(payload["messages"])
    ]
    return run_pipeline(payload["conv_id"], payload["customer_id"], segments)

@app.post("/analyze-email")
def analyze_email(payload: Dict):
    segments = [{
        "segment_id": "seg_email",
        "speaker": "customer",
        "text": f"{payload.get('subject', '')}. {payload['body']}",
        "confidence": 0.9
    }]
    return run_pipeline(payload["conv_id"], payload["customer_id"], segments)

@app.post("/analyze-audio")
def analyze_audio(
    conv_id: str,
    customer_id: str,
    file: UploadFile = File(...)
):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        shutil.copyfileobj(file.file, tmp)
        path = tmp.name

    transcript = transcribe_audio(path)

    return run_pipeline(
        conv_id,
        customer_id,
        transcript["segments"],
        {
            "overall_confidence": transcript["overall_confidence"],
            "notes": "Generated from ASR + diarization"
        }
    )

@app.get("/analytics")
def get_analytics():
    return {
        "analytics_snapshot": LATEST_ANALYTICS_SNAPSHOT,
        "last_updated": ANALYTICS_LAST_UPDATED
    }
