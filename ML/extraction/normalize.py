import re

WHITESPACE_RE = re.compile(r"\s+")
PHONE_RE = re.compile(r"\D")

def normalize_text(text: str) -> str:
    
    text = text.strip()
    text = WHITESPACE_RE.sub(" ", text)
    return text


def normalize_phone(phone: str) -> str:
    
    digits = PHONE_RE.sub("", phone)
    return digits[-10:] if len(digits) >= 10 else digits


def normalize_order_id(order_id: str) -> str:
    
    return order_id.strip()


def normalize_segments(segments: list) -> list:
   
    normalized = []

    for seg in segments:
        normalized.append({
            "segment_id": seg["segment_id"],
            "start": round(float(seg["start"]), 2),
            "end": round(float(seg["end"]), 2),
            "text": normalize_text(seg["text"]),
            "confidence": round(float(seg.get("confidence", 0.75)), 2)
        })

    return normalized


def normalize_facts(facts: list) -> list:
    """
    Normalize extracted facts
    """
    normalized = []

    for fact in facts:
        value = fact["value"]

        if fact["key"] == "phone_number":
            value = normalize_phone(value)

        elif fact["key"] == "order_id":
            value = normalize_order_id(value)

        normalized.append({
            **fact,
            "value": value
        })

    return normalized