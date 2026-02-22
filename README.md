# Student Desire Content Recommendation — Backend

A personalized content recommendation system for students. The backend fetches content from YouTube, NewsAPI, and Google Books, then ranks it using a real ML algorithm (TF-IDF + Cosine Similarity) combined with Popularity and Recency scoring.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django + Django REST Framework |
| Auth | JWT (SimpleJWT) |
| Database | PostgreSQL |
| ML | scikit-learn (TF-IDF, Cosine Similarity) |
| Content Sources | YouTube Data API, NewsAPI, Google Books API |

---

## Project Structure

```
student_reco/
│
├── backend/              # Project settings, URLs, WSGI/ASGI config
├── authentication/       # Signup, Login, Forgot/Reset Password
├── accounts/             # User Profile, Password, Saved & Liked items
├── interests/            # Interest domains + user interest selection
├── content/              # Core app — recommendations, search, ML pipeline
│   └── services/
│       ├── recommendation.py
│       ├── tfidf.py
│       ├── similarity.py
│       ├── popularity.py
│       ├── recency.py
│       ├── text_processing.py
│       ├── user_profile.py
│       ├── domain_classifier.py
│       └── external/
│           ├── youtube_fetch.py
│           ├── news_fetch.py
│           ├── google_books_fetch.py
│           ├── ingestion.py
│           └── safe_request.py
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

### 2. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create `.env` file

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

### 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser (for admin panel)

```bash
python manage.py createsuperuser
```

### 7. Run the server

```bash
python manage.py runserver
```

---

## API Endpoints

### 🔐 Authentication — `/api/auth/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup/` | Register a new user |
| POST | `/api/auth/login/` | Login and get JWT tokens |
| POST | `/api/auth/forgot-password/` | Generate password reset token |
| POST | `/api/auth/reset-password/` | Reset password using token |

---

### 👤 Accounts — `/api/account/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/account/profile/` | Get logged-in user profile |
| PUT | `/api/account/update-profile/` | Update first/last name |
| POST | `/api/account/change-password/` | Change password |
| DELETE | `/api/account/delete-account/` | Delete account |
| GET | `/api/account/saved-items/` | Get all saved content |
| GET | `/api/account/liked-items/` | Get all liked content |

---

### 🎯 Interests — `/api/interests/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interests/domains/` | List all interest domains |
| POST | `/api/interests/save/` | Save/update user interests |

---

### 📦 Content — `/api/content/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/list/` | List all content items |
| GET | `/api/content/recommendations/` | Interest-based recommendations |
| GET | `/api/content/personalized-recommendations/` | ML-ranked personalized feed |
| POST | `/api/content/search/` | Search and get ranked results |

#### Query Parameters for `/personalized-recommendations/`

| Param | Values | Description |
|-------|--------|-------------|
| `type` | `video`, `article`, `book`, `news` | Filter by content type |
| `sort` | `relevant`, `newest`, `popular` | Sort order |
| `date` | `24h`, `week`, `month` | Filter by date range |

---

### 📊 Engagement — `/api/engagement/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/engagement/views/create/` | Record a content view |
| POST | `/api/engagement/like/toggle/` | Like / Unlike content |
| POST | `/api/engagement/saves/toggle/` | Save / Unsave content |
| POST | `/api/engagement/searches/create/` | Record a search query |
| GET | `/api/engagement/saved/list/` | List saved content |
| GET | `/api/engagement/liked/list/` | List liked content |

---

### 📚 Library — `/api/library/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/library/folders/create/` | Create a study folder |
| GET | `/api/library/folders/` | List all user folders |
| DELETE | `/api/library/folders/<id>/delete/` | Delete a folder |
| POST | `/api/library/folders/<id>/add-item/` | Add content to folder |
| GET | `/api/library/folders/<id>/items/` | View items in a folder |
| DELETE | `/api/library/items/<id>/delete/` | Remove item from folder |

---

### ⚙️ Settings — `/api/settings/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/user-settings/` | Get user settings |
| PUT | `/api/settings/user-settings/` | Update user settings |

---

## ML Recommendation Pipeline

The recommendation engine runs the following steps on every request:

1. **Fetch all content** from the database
2. **Build TF-IDF matrix** from content titles, descriptions, and interest domains
3. **Build user profile text** from interests, search history, and saved items
4. **Compute Cosine Similarity** between user profile and all content
5. **Score each item** using a weighted formula:

```
Final Score = (ML Similarity × 0.4) + (Popularity × 0.3) + (Recency × 0.3)
```

6. **Popularity Score** = Views×1 + Likes×3 + Saves×5
7. **Recency Score** = e^(−age_in_days / 30) (exponential decay)
8. **Cold-start handling** — new users with no data receive popularity + recency ranked content

---

## Authentication

All protected endpoints require a JWT Bearer token in the request header:

```
Authorization: Bearer <access_token>
```

Tokens are obtained from the `/api/auth/login/` endpoint.

| Token | Lifetime |
|-------|----------|
| Access Token | 60 minutes |
| Refresh Token | 1 day |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `NEWS_API_KEY` | NewsAPI key |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key |

---

## Admin Panel

Access the Django admin panel at:

```
http://localhost:8000/admin/
```

All models are registered and manageable from the admin panel.

---

## Notes for Production

- Set `DEBUG = False` in `settings.py`
- Fill `ALLOWED_HOSTS` with your domain
- Update `CORS_ALLOWED_ORIGINS` with your frontend URL
- Use a strong `SECRET_KEY` in `.env`
- Set up email backend for password reset emails
