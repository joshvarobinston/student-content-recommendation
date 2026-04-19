# Student Desire Content Recommendation — Full Stack

A comprehensive, full-stack personalized content recommendation system for students. The platform aggregates content from YouTube, NewsAPI, and Google Books, presenting it through a modern React frontend and ranking it with a custom ML algorithm on a Django backend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Django, Django REST Framework |
| **Auth** | JWT (SimpleJWT) |
| **Database** | PostgreSQL / SQLite (Dev) |
| **ML Engine**| scikit-learn (TF-IDF, Cosine Similarity) |
| **APIs**     | YouTube Data API, NewsAPI, Google Books API |

---

## Project Structure

```
student_reco/
│
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── components/   # UI elements (Cards, Modals)
│   │   ├── layouts/      # Navbar, sidebars
│   │   ├── pages/        # FeedPage, ProfilePage, FolderDetailPage, etc.
│   │   └── services/     # API integration logic
│   └── package.json
│
├── backend/              # Project settings, URLs, WSGI/ASGI config
├── authentication/       # Signup, Login, Forgot/Reset Password, Account Deleting
├── accounts/             # User Profile, Password, Saved & Liked items
├── interests/            # Interest domains + user interest selection
├── content/              # Core app — recommendations, search, ML pipeline
│   └── services/
│       ├── recommendation.py, tfidf.py, similarity.py, popularity.py, recency.py
│       └── external/
│           ├── youtube_fetch.py, news_fetch.py, google_books_fetch.py
│           └── ingestion.py, safe_request.py
├── engagement/           # Views, Likes, Saves, Search tracking
├── settings_app/         # User UI & content preferences
└── library/              # Study folders + saved content
```

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourname/student-reco.git
cd student-reco
```

### 2. Backend Setup
**Create a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Create `.env` file:**
Create a `.env` file in the root directory:
```env
SECRET_KEY=your-very-secret-key-here
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
YOUTUBE_API_KEY=your_youtube_api_key
NEWS_API_KEY=your_newsapi_key
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

**Run migrations and start server:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
**Navigate to frontend directory:**
```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Start the development server:**
```bash
npm run dev
```

---

## Key Features
- **Personalized Feed:** ML-ranked content feeds combining TF-IDF + Cosine Similarity with popularity/recency heuristics.
- **Search & Discovery:** Robust search functionality with filtering across video, article, and book sources.
- **Library Management:** Custom study folders allows users to group and organize saved contents dynamically.
- **Full Account Control:** Includes profile updates, password management, and robust account deletion workflows.
- **Real-time Engagement:** Tracks and weights user engagement (likes, views, saves) in real-time to adjust recommendation algorithms.

---

## API Endpoints Overview

- **Auth** (`/api/auth/`): Login, Signup, Password Management
- **Accounts** (`/api/account/`): Profile changes, account deletion, getting loved/saved items.
- **Interests** (`/api/interests/`): Setting & updating user domain preferences.
- **Content** (`/api/content/`): Search queries, personalized recommendations, full content listings.
- **Engagement** (`/api/engagement/`): View tracking, toggling likes/saves.
- **Library** (`/api/library/`): Creating folders, adding and organizing saved content records.

---

## ML Recommendation Pipeline

1. **Fetch content** from DB / external sources.
2. **Build TF-IDF matrix** of textual parameters (descriptions, domains).
3. **Draft User Profile** context based on tracking, saved items, and interests.
4. **Compute Cosine Similarity** linking profile to available contents.
5. Apply Weighting:
   ```
   Final Score = (ML Similarity × 0.4) + (Popularity × 0.3) + (Recency × 0.3)
   ```
   - Popularity = Views×1 + Likes×3 + Saves×5
   - Recency = e^(−age_in_days / 30)
6. New cold-start users are served weighted popularity + recency lists.

---

## Configuration Details

Make sure CORS and domains are correctly whitelisted between your backend and frontend.
In `backend/settings.py` (or the equivalent Django app setting config):
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Usually Vite's default dev endpoint
    # ...
]
```
