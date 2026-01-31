def analyze_sentiment(segments):
    """
    segments: List[dict]
    """

    text = " ".join(
        s["text"].lower()
        for s in segments
        if "text" in s
    )

    negative_keywords = [
        "angry", "upset", "frustrated", "bad", "terrible",
        "refund", "complaint", "not happy", "poor service"
    ]

    positive_keywords = [
        "thanks", "thank you", "great", "good", "happy", "satisfied"
    ]

    score = 0.0

    for k in negative_keywords:
        if k in text:
            score -= 0.2

    for k in positive_keywords:
        if k in text:
            score += 0.2

    # Clamp score
    score = max(-1.0, min(1.0, score))

    return {
        "score": round(score, 2),
        "label": (
            "negative" if score < -0.2
            else "positive" if score > 0.2
            else "neutral"
        )
    }