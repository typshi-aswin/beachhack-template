import time
from typing import List, Dict

from app.util.ml.context_diff import build_customer_snapshot, context_diff
from app.util.ml.normalize import normalize_facts
from app.util.ml.score import compute_friction
from app.util.ml.sentiment import analyze_sentiment
from app.util.ml.suggest import suggest_actions
from app.util.ml.summary import generate_summary
from app.util.ml.classifier import classify_intent
from app.util.ml.facts import extract_facts

CONVERSATIONS: List[Dict] = []
LATEST_ANALYTICS_SNAPSHOT: Dict = {}
ANALYTICS_LAST_UPDATED: float | None = None
CUSTOMER_SNAPSHOTS: Dict[str, Dict] = {}

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