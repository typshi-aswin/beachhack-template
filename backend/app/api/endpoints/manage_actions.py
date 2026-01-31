import json

from fastapi import APIRouter
from sqlalchemy.future import select

from app.db.models import Customer, Action
from app.api.deps import SessionDep, CurrentUserDep
from app.core.exception_handler import ExceptionLoggingRoute
from app.util.response import CustomResponse

router = APIRouter(route_class=ExceptionLoggingRoute)


@router.get("/{customer_id}/view/")
async def view_changes(customer_id: str, db: SessionDep, current_user: CurrentUserDep):
    if not (await db.scalar(select(Customer).filter(Customer.id == customer_id))):
        return CustomResponse(general_message="Customer not found").get_failure_response()

    actions = await db.scalars(select(Action).filter(Action.customer_id == customer_id))

    return CustomResponse(response=[{
        "id": action.id,
        "interaction_id": action.interaction_id,
        "action_type": action.action_type,
        "params": action.params,
        "status": action.status,
        "executed_at": str(action.executed_at),
        "created_at": str(action.created_at)
    } for action in actions ]).get_success_response()


