from typing import List
from fastapi import APIRouter
from sqlalchemy.future import select

from app.db.models import Customer
from app.api.deps import SessionDep, CurrentUserDep
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.core.exception_handler import ExceptionLoggingRoute
from app.util.response import CustomResponse

router = APIRouter(route_class=ExceptionLoggingRoute)


@router.post("/create/")
async def create_customer(data: CustomerCreate, db: SessionDep, current_user: CurrentUserDep):
    if not data.primary_email:
             return CustomResponse(message={'field': "primary_email field is required"}).get_failure_response()

    if data.primary_email:
        result = await db.execute(
            select(Customer).filter(
                Customer.primary_email == data.primary_email
            )
        )
        if result.scalars().first():
            return CustomResponse(
                general_message="Customer with this email already exists."
            ).get_failure_response()

    if data.primary_phone:
        result = await db.execute(
            select(Customer).filter(
                Customer.primary_phone == data.primary_phone
            )
        )
        if result.scalars().first():
            return CustomResponse(
                general_message="Customer with this phone number already exists."
            ).get_failure_response()

    customer = Customer(
        primary_email=data.primary_email,
        primary_phone=data.primary_phone,
        name=data.name,
        last_interaction_at=None,  # Not in Create Schema usually, or extract if there
        consent_flags=data.consent_flags
    )
    db.add(customer)
    await db.commit()

    return CustomResponse(general_message="Customer created successfully").get_success_response()


@router.get("/list/")
async def list_customers(db: SessionDep, current_user: CurrentUserDep):
    query = select(Customer)
    result = await db.execute(query)
    customers = result.scalars().all()
    return CustomResponse(response=[{
        "id": customer.id,
        "primary_email": customer.primary_email,
        "primary_phone": customer.primary_phone,
        "name": customer.name,
        "last_interaction_at": str(customer.last_interaction_at),
        "consent_flags": customer.consent_flags
    } for customer in customers]).get_success_response()


@router.get("/{customer_id}/view/")
async def view_customer(customer_id: str, db: SessionDep, current_user: CurrentUserDep):
    if not (customer := (await db.scalar(select(Customer).filter(Customer.id == customer_id)))):
        return CustomResponse(general_message="Customer not found").get_failure_response()

    return CustomResponse(response=[{
        "primary_email": customer.primary_email,
        "primary_phone": customer.primary_phone,
        "name": customer.name,
        "last_interaction_at": str(customer.last_interaction_at),
        "consent_flags": customer.consent_flags
    }]).get_success_response()


@router.patch("/{customer_id}/update/")
async def update_customer(customer_id: str, customer_in: CustomerUpdate, db: SessionDep, current_user: CurrentUserDep):
    if not (customer := await db.scalar(select(Customer).filter(Customer.id == customer_id))):
        return CustomResponse(general_message="Customer not found").get_failure_response()

    update_data = customer_in.model_dump(exclude_unset=True)
    
    # Validation for uniqueness if email/phone is being updated
    if "primary_email" in update_data and update_data["primary_email"] is not None:
         if update_data["primary_email"] != customer.primary_email:
            query = select(Customer).where(Customer.primary_email == update_data["primary_email"])
            result = await db.execute(query)
            if result.scalars().first():
                return CustomResponse(general_message="Email already in use.").get_failure_response()

    if "primary_phone" in update_data and update_data["primary_phone"] is not None:
        if update_data["primary_phone"] != customer.primary_phone:
            query = select(Customer).where(Customer.primary_phone == update_data["primary_phone"])
            result = await db.execute(query)
            if result.scalars().first():
                return CustomResponse(general_message="Phone number already in use.").get_failure_response()


    for field, value in update_data.items():
        setattr(customer, field, value)

    db.add(customer)
    await db.commit()
    return CustomResponse(general_message="Customer updated successfully").get_success_response()


@router.delete("/{customer_id}/delete/")
async def delete_customer(customer_id: str, db: SessionDep, current_user: CurrentUserDep):
    if not (customer := (await db.scalar(select(Customer).filter(Customer.id == customer_id)))):
        return CustomResponse(general_message="Customer not found").get_failure_response()

    await db.delete(customer)
    await db.commit()
    return CustomResponse(general_message="Customer deleted successfully").get_success_response()
