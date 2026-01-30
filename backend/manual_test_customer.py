
import asyncio
import sys
import os

# Add backend directory to path so we can import app
sys.path.append("/home/nayan/Freelance Projects/beachhack-template/backend")

from fastapi.testclient import TestClient
from app.main import app

def test_customer_crud():
    client = TestClient(app)
    
    # 1. Create Customer
    customer_data = {
        "primary_email": "test@example.com",
        "primary_phone": "1234567890",
        "name": "Test User",
        "consent_flags": {"email": True}
    }
    
    print("Creating customer...")
    response = client.post("/manage-customer/", json=customer_data)
    if response.status_code != 200:
        print(f"Failed to create customer: {response.status_code} {response.text}")
        return
    
    customer = response.json()
    customer_id = customer["id"]
    print(f"Customer created with ID: {customer_id}")
    assert customer["primary_email"] == "test@example.com"

    # 2. Get Customer
    print("Getting customer...")
    response = client.get(f"/manage-customer/{customer_id}")
    assert response.status_code == 200
    assert response.json()["id"] == customer_id

    # 3. Update Customer
    print("Updating customer...")
    update_data = {"name": "Updated Name"}
    response = client.patch(f"/manage-customer/{customer_id}", json=update_data)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"

    # 4. List Customers
    print("Listing customers...")
    response = client.get("/manage-customer/")
    assert response.status_code == 200
    customers = response.json()
    found = False
    for c in customers:
        if c["id"] == customer_id:
            found = True
            break
    assert found

    # 5. Delete Customer
    print("Deleting customer...")
    response = client.delete(f"/manage-customer/{customer_id}")
    assert response.status_code == 200

    # 6. Verify Deletion
    print("Verifying deletion...")
    response = client.get(f"/manage-customer/{customer_id}")
    assert response.status_code == 404
    
    print("All tests passed!")

if __name__ == "__main__":
    try:
        test_customer_crud()
    except Exception as e:
        print(f"An error occurred: {e}")
