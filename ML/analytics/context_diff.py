# context/context_diff.py
from typing import Dict, Any


def build_customer_snapshot(facts, intent, friction) -> Dict[str, Any]:
    return {
        "facts": {f["key"]: f["value"] for f in facts},
        "intent": intent.get("intent"),
        "friction_level": friction.get("level"),
    }


def context_diff(previous: Dict[str, Any], current: Dict[str, Any]) -> Dict[str, Any]:
    added, modified, deleted = {}, {}, {}

    for k, v in current.items():
        if k not in previous:
            added[k] = v
        elif previous[k] != v:
            modified[k] = {"from": previous[k], "to": v}

    for k in previous:
        if k not in current:
            deleted[k] = previous[k]

    return {
        "added": added,
        "modified": modified,
        "deleted": deleted
    }
