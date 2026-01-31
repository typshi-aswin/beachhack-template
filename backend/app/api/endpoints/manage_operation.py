import json

from fastapi import APIRouter
from sqlalchemy.future import select
from sqlalchemy import or_, desc
from datetime import datetime

from app.db.models import Customer, Interaction
from app.api.deps import SessionDep, CurrentUserDep
from app.core.exception_handler import ExceptionLoggingRoute
from app.util.response import CustomResponse
from app.util.ml_util import run_pipeline

router = APIRouter(route_class=ExceptionLoggingRoute)


@router.post("/create/")
async def create_interaction(data: dict, db: SessionDep, current_user: CurrentUserDep):
    required_fields = ["primary_email", "channel", "chat_data"]
    for field in required_fields:
        if field not in data:
            return CustomResponse(
                message={"field": f"{field} field is required"}
            ).get_failure_response()

    primary_email: str = data["primary_email"]
    channel: str = data["channel"]
    chat_data = data["chat_data"]
    nlp_result = None

    result = await db.scalars(
        select(Customer).where(Customer.primary_email == primary_email)
    )
    customer = result.first()

    if not customer:
        customer = Customer(
            primary_email=primary_email,
            name=primary_email.split("@")[0],
            consent_flags=None,
        )
        db.add(customer)
        await db.flush()  # ensures customer.id exists

    result = await db.scalars(
        select(Interaction)
        .where(
            Interaction.customer_id == customer.id,
            Interaction.channel == channel
        )
        .order_by(Interaction.created_at.desc())
    )
    interaction = result.first()

    if interaction:
        interaction.raw_text = json.dumps(chat_data)
    else:
        segments = [{
            "segment_id": f"seg_{i}",
            "speaker": m.get("role"),
            "text": m["text"],
            "confidence": m.get("confidence", 0.85)
        } for i, m in enumerate(chat_data)]

        interaction = Interaction(
            customer_id=customer.id,
            channel=channel,
            raw_text=json.dumps(chat_data),
            status="Pending",
        )
        nlp_result = run_pipeline(interaction.id, customer.id, segments)
        interaction.nlp_output = nlp_result
        db.add(interaction)

    customer.last_interaction_at = datetime.utcnow()

    await db.commit()
    return CustomResponse(
        general_message="Customer interaction processed successfully",
        response=nlp_result
    ).get_success_response()


@router.get("/{customer_id}/view-score/")
async def score_indicator(customer_id: str, db: SessionDep, current_user: CurrentUserDep, search: str | None = None):
    customer_exists = await db.scalar(select(Customer.id).where(Customer.id == customer_id))
    if not customer_exists:
        return CustomResponse(general_message="Customer not found").get_failure_response()

    query = select(Interaction).where(Interaction.customer_id == customer_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Interaction.nlp_output["summary"]["summary_long"]
                .astext.ilike(search_pattern),

                Interaction.nlp_output["summary"]["summary_short"]
                .astext.ilike(search_pattern),
            )
        ).order_by(desc(Interaction.created_at))

    interactions = (await db.scalars(query)).all()

    return CustomResponse(
        response=[
            {
                "id": i.id,
                "channel": i.channel,
                "facts": i.nlp_output.get("facts"),
                "friction": i.nlp_output.get("friction"),
                "summary": i.nlp_output.get("summary"),
                "intent": i.nlp_output.get("intent"),
                "suggested_actions": i.nlp_output.get("suggested_actions"),
                "created_at": str(i.created_at)
            }
            for i in interactions
        ]
    ).get_success_response()


@router.get("/all-customer-score/")
async def score_indicator(db: SessionDep, current_user: CurrentUserDep, search: str | None = None):
    query = select(Interaction)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Interaction.nlp_output["summary"]["summary_long"]
                .astext.ilike(search_pattern),

                Interaction.nlp_output["summary"]["summary_short"]
                .astext.ilike(search_pattern),
            )
        ).order_by(desc(Interaction.created_at))

    interactions = (await db.scalars(query)).all()

    return CustomResponse(
        response=[
            {
                "id": i.id,
                "customer_id": i.customer_id,
                "channel": i.channel,
                "facts": i.nlp_output.get("facts"),
                "friction": i.nlp_output.get("friction"),
                "summary": i.nlp_output.get("summary"),
                "intent": i.nlp_output.get("intent"),
                "suggested_actions": i.nlp_output.get("suggested_actions"),
                "created_at": str(i.created_at)
            }
            for i in interactions
        ]
    ).get_success_response()