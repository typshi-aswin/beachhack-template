import json

from fastapi import APIRouter
from sqlalchemy.future import select
from datetime import datetime, timezone

from app.db.models import Customer, Interaction
from app.api.deps import SessionDep, CurrentUserDep
from app.core.exception_handler import ExceptionLoggingRoute
from app.util.response import CustomResponse

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
        interaction = Interaction(
            customer_id=customer.id,
            channel=channel,
            raw_text=json.dumps(chat_data),
            status="Pending",
        )
        db.add(interaction)

    customer.last_interaction_at = datetime.utcnow()

    await db.commit()
    return CustomResponse(general_message="Customer interaction processed successfully").get_success_response()


@router.get("/{customer_id}/view-score/")
async def score_indicator(customer_id: str, db: SessionDep, current_user: CurrentUserDep):
    if not (await db.scalar(select(Customer).filter(Customer.id == customer_id))):
        return CustomResponse(general_message="Customer not found").get_failure_response()
    
    interactions = await db.scalars(select(Interaction).filter(Interaction.customer_id == customer_id))

    return CustomResponse(response=[{
        "id": interaction.id,
        "channel": interaction.channel,
        "facts": interaction.nlp_output["facts"],
        "friction": interaction.nlp_output["friction"],
        "summary": interaction.nlp_output["summary"],
        "intent": interaction.nlp_output["intent"],
        "suggested_actions": interaction.nlp_output["suggested_actions"]
    }for interaction in interactions]).get_success_response()