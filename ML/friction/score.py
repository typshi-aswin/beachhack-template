
def compute_friction(
    sentiment_score: float,
    past_interactions: int = 0,
    unresolved_issues: int = 0
):
    score = (
        0.5 * sentiment_score +
        0.3 * min(past_interactions / 5, 1.0) +
        0.2 * min(unresolved_issues / 3, 1.0)
    )

    score = round(min(score, 1.0), 2)

    if score >= 0.7:
        level = "high"
        reasons = ["negative sentiment", "repeated contact"]
    elif score >= 0.4:
        level = "medium"
        reasons = ["mild frustration"]
    else:
        level = "low"
        reasons = []

    return {
        "score": score,
        "level": level,
        "reasons": reasons
    }
