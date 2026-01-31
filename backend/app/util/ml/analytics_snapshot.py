# analytics/analytics_snapshot.py
from collections import Counter
from typing import Dict, List


def build_analytics_snapshot(conversations: List[Dict]) -> Dict:
    """
    Build analytics from all processed conversations
    """

    issue_counter = Counter()
    unresolved_counter = Counter()
    action_counter = Counter()

    for c in conversations:
        # intents
        intent = c.get("intent", {}).get("intent")
        if intent:
            issue_counter[intent] += 1

        # unresolved (high friction)
        if c.get("friction", {}).get("level") == "high":
            unresolved_counter[intent] += 1

        # actions
        for a in c.get("suggested_actions", []):
            action_counter[a.get("action_type")] += 1

    return {
        "top_trending_issues": [
            {"issue": k, "count": v}
            for k, v in issue_counter.most_common(5)
        ],
        "most_unresolved_issues": [
            {"issue": k, "count": v}
            for k, v in unresolved_counter.most_common(5)
        ],
        "most_suggested_actions": [
            {"action": k, "count": v}
            for k, v in action_counter.most_common(5)
        ],
    }
