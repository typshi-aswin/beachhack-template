from typing import List, Dict


def generate_summary(
    segments: List[dict],
    intent: dict,
    friction: dict
) -> dict:
    """
    Rule-based summary generator.
    Deterministic, safe, and debuggable.
    """

    # ---- collect customer utterances only
    customer_text = [
        s["text"] for s in segments
        if s.get("speaker") == "customer"
    ]

    joined_text = " ".join(customer_text)

    intent_label = intent.get("intent", "general_inquiry")
    friction_level = friction.get("level", "low")

    # ---- short summary
    summary_short = _short_summary(intent_label, joined_text)

    # ---- long summary
    summary_long = _long_summary(
        intent_label,
        joined_text,
        friction_level
    )

    # ---- confidence heuristic
    confidence = _summary_confidence(segments, intent)

    return {
        "summary_short": summary_short,
        "summary_long": summary_long,
        "confidence": confidence
    }


# =========================
# Helpers
# =========================

def _short_summary(intent: str, text: str) -> str:
    if intent == "refund_request":
        return "Customer requested a refund."
    if intent == "complaint":
        return "Customer raised a service complaint."
    if intent == "purchase_intent":
        return "Customer expressed intent to make a purchase."
    return "Customer contacted support for assistance."


def _long_summary(intent: str, text: str, friction_level: str) -> str:
    base = ""

    if intent == "refund_request":
        base = "Customer contacted support requesting a refund."
    elif intent == "complaint":
        base = "Customer contacted support to report dissatisfaction with the service."
    elif intent == "purchase_intent":
        base = "Customer contacted support expressing interest in purchasing a product."
    else:
        base = "Customer contacted support with a general inquiry."

    if friction_level in ("medium", "high"):
        base += " Frustration level appears elevated."

    return base


def _summary_confidence(segments: List[dict], intent: dict) -> float:
    if not segments:
        return 0.4

    avg_conf = sum(
        s.get("confidence", 0.6) for s in segments
    ) / len(segments)

    intent_conf = intent.get("confidence", 0.6)

    return round((avg_conf + intent_conf) / 2, 2)
