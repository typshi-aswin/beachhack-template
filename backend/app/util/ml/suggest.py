import uuid


def _new_action(action_type, score, reason, segments=None):
    return {
        "suggestion_id": f"a_{uuid.uuid4().hex[:8]}",
        "action_type": action_type,
        "score": round(score, 2),
        "reason": reason,
        "evidence_segments": segments or []
    }


def suggest_actions(intent: dict, friction: dict, facts: list):
    actions = []

    intent_name = intent.get("intent")
    intent_conf = intent.get("confidence", 0.0)

    friction_score = friction.get("score", 0.0)
    friction_level = friction.get("level", "low")

    fact_keys = {f["key"] for f in facts}

    # ------------------------------------------------------------------
    # PURCHASE INTENT
    # ------------------------------------------------------------------
    if intent_name == "purchase_intent" and intent_conf >= 0.7:
        actions.append(
            _new_action(
                action_type="handoff_to_sales",
                score=0.9,
                reason="Customer shows strong purchase intent"
            )
        )

        if "product" in fact_keys:
            actions.append(
                _new_action(
                    action_type="recommend_similar_products",
                    score=0.75,
                    reason="Product identified, upsell opportunity"
                )
            )

    # ------------------------------------------------------------------
    # REFUND REQUEST
    # ------------------------------------------------------------------
    if intent_name == "refund_request":
        actions.append(
            _new_action(
                action_type="create_ticket",
                score=0.92,
                reason="Refund requested with high confidence"
            )
        )

        if "order_id" not in fact_keys:
            actions.append(
                _new_action(
                    action_type="request_missing_information",
                    score=0.7,
                    reason="Refund requested but order ID not found"
                )
            )

    # ------------------------------------------------------------------
    # COMPLAINT
    # ------------------------------------------------------------------
    if intent_name == "complaint":
        actions.append(
            _new_action(
                action_type="apologize_and_acknowledge",
                score=0.85,
                reason="Customer expressed dissatisfaction"
            )
        )

        actions.append(
            _new_action(
                action_type="create_ticket",
                score=0.88,
                reason="Complaint requires formal tracking"
            )
        )

    # ------------------------------------------------------------------
    # GENERAL INQUIRY
    # ------------------------------------------------------------------
    if intent_name == "general_inquiry":
        actions.append(
            _new_action(
                action_type="provide_information",
                score=0.65,
                reason="Customer seeking general assistance"
            )
        )

    # ------------------------------------------------------------------
    # HIGH FRICTION OVERRIDES
    # ------------------------------------------------------------------
    if friction_score >= 0.75:
        actions.append(
            _new_action(
                action_type="escalate",
                score=friction_score,
                reason="High customer friction detected"
            )
        )

        actions.append(
            _new_action(
                action_type="priority_callback",
                score=0.85,
                reason="Customer frustration requires immediate follow-up"
            )
        )

    # ------------------------------------------------------------------
    # CONTACT FOLLOW-UP
    # ------------------------------------------------------------------
    if "phone_number" in fact_keys:
        actions.append(
            _new_action(
                action_type="verify_contact_details",
                score=0.6,
                reason="Phone number detected, confirm for follow-up"
            )
        )

    return actions
