from typing import List, Dict


INTENT_PATTERNS = {
    "refund_request": [
        "refund", "money back", "return", "cancel order"
    ],
    "complaint": [
        "complaint", "bad service", "not happy", "worst", "frustrated"
    ],
    "purchase_intent": [
        "buy", "purchase", "book", "order", "looking to buy"
    ],
    "order_status": [
        "where is my order", "order status", "track", "delivery status"
    ],
    "support_request": [
        "help", "support", "assist", "issue", "problem"
    ]
}


INTENT_CONFIDENCE = {
    "refund_request": 0.91,
    "complaint": 0.85,
    "purchase_intent": 0.87,
    "order_status": 0.82,
    "support_request": 0.75,
    "general_inquiry": 0.60
}


def classify_intent(segments: List[Dict]) -> Dict:
    """
    Input: list of ASR segments (dicts)
    Output: intent object with evidence segments
    """

    if not segments:
        return {
            "intent": "general_inquiry",
            "confidence": INTENT_CONFIDENCE["general_inquiry"],
            "evidence_segments": []
        }

    # Build searchable text
    full_text = " ".join(
        s["text"].lower() for s in segments if "text" in s
    )

    for intent, keywords in INTENT_PATTERNS.items():
        matched_segments = []

        for seg in segments:
            text = seg.get("text", "").lower()
            if any(k in text for k in keywords):
                matched_segments.append(seg["segment_id"])

        if matched_segments:
            return {
                "intent": intent,
                "confidence": INTENT_CONFIDENCE[intent],
                "evidence_segments": matched_segments
            }

    # Fallback
    return {
        "intent": "general_inquiry",
        "confidence": INTENT_CONFIDENCE["general_inquiry"],
        "evidence_segments": []
    }