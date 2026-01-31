import re
import uuid

FACT_PATTERNS = {
    "order_id": re.compile(r"\b(order\s*#?\s*\d+|\b\d{4,})\b", re.I),
    "phone_number": re.compile(r"\b\d{10}\b"),
    "email": re.compile(r"\b[\w\.-]+@[\w\.-]+\.\w+\b"),
    "product": re.compile(r"\b(bmw|iphone|laptop|subscription)\b", re.I),
}

def extract_facts(segments):
    facts = []

    for seg in segments:
        text = seg.get("text", "")
        for key, pattern in FACT_PATTERNS.items():
            for match in pattern.findall(text):
                facts.append({
                    "fact_id": f"f_{uuid.uuid4().hex[:8]}",
                    "key": key,
                    "value": match if isinstance(match, str) else match[0],
                    "confidence": seg.get("confidence", 0.7),
                    "segment_id": seg.get("segment_id"),
                    "evidence": text,
                    "is_pii": key in ["phone_number", "email"]
                })

    return facts
