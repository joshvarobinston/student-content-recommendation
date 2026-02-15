# Student Content Recommendation - Backend

A personalized educational content recommendation system built with Django and REST Framework.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.8+
- PostgreSQL

### 2. Installation
Clone the repository and set up a virtual environment:
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configuration
Copy the example environment file and update it with your credentials:
```bash
cp .env.example .env
```
Edit `.env` and provide your:
- Database name, user, and password.
- YouTube API Key.
- News API Key.

### 4. Database Setup
Ensure your PostgreSQL database is running, then run the migrations:
```bash
python manage.py migrate
```

### 5. Initialize Data
Populate the initial categories and interests:
```bash
python populate_interests.py
```

### 6. Run the Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`.

## 🛠 Features
- **Email-based Auth**: Secure login and signup with JWT.
- **Personalized Feed**: Content based on user interests.
- **Global Search**: Regional YouTube and News fetching.
- **Engagement**: Like and Save functionality.
- **Library**: Manage your saved and liked content.
