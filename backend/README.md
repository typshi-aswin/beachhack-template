## 🚦 Getting Started

### 1️⃣ Local Setup
```bash
# Clone the repository
git clone <repo-url>
cd CustomerX && cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your local database and Redis credentials
```

### 2️⃣ Database Migrations

```bash
alembic revision --autogenerate -m "<description>"
```

```bash
alembic upgrade head
```

### 3️⃣ Running the Server
```bash
# Start the FastAPI server
python run.py
```
The API will be available at `http://localhost:8000`.

### 🐳 Running with Docker
If you prefer Docker, you can start the entire stack (API, PostgreSQL, Redis) using:
```bash
docker-compose up --build
```

