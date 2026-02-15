# Student Content Recommendation System - API Report

This document provides a detailed overview of the Student Content Recommendation System's API. It outlines the available endpoints, their function, and how they interact to provide a personalized user experience.

## 1. Project Overview

The **Student Content Recommendation System** is a platform designed to suggest educational content (videos, articles, books) to students based on their selected interests and engagement history. It uses a combination of interest-based filtering and machine learning (planned) to rank content.

### Key Features
*   **User Authentication**: Secure signup and login with JWT tokens.
*   **Interest Management**: Users select academic domains (e.g., CS, Math).
*   **Content Discovery**: Browsing content filtered by interest and searching external sources.
*   **Engagement Tracking**: detailed tracking of views, likes, saves, and search history to improve recommendations.
*   **Personal Library**: Users can organize content into custom folders.

---

## 2. API Endpoints

The API is built using **Django REST Framework**. All protected endpoints require a `Bearer <access_token>` in the Authorization header.

### A. Authentication (`/api/auth/`)
Handles user registration and session management.

| Endpoint | Method | Description | Payload |
| :--- | :--- | :--- | :--- |
| `/signup/` | `POST` | Register a new user. | `username`, `email`, `password`, `confirm_password` |
| `/login/` | `POST` | Authenticate user & get JWT tokens. | `username`, `email`, `password` |
| `/forgot-password/` | `POST` | Initiate password reset. | `email` |
| `/reset-password/` | `POST` | Complete password reset. | `token`, `new_password` |

### B. Interests (`/api/interests/`)
Manages the user's declared academic interests.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/domains/` | `GET` | List all available interest domains (e.g., Physics, CS). |
| `/save/` | `POST` | Save user's selected interests (Overwrites existing). Payload: `{"interest_ids": [1, 2]}` |
| `/update/` | `PUT` | Update user's selected interests. |

### C. Content (`/api/content/`)
The core module for delivering educational material.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/list/` | `GET` | List content items. Query param `interest_domain=<id>` filters by domain. |
| `/search/` | `POST` | Search for content (Internal & External). Payload: `{"query": "python"}`. Records search history. |
| `/recommendations/`| `GET` | **(Key Feature)** Get personalized recommendations based on user profile. |

### D. Engagement (`/api/engagement/`)
Tracks user interactions to feed the recommendation engine.

| Endpoint | Method | Description | Payload |
| :--- | :--- | :--- | :--- |
| `/views/create/` | `POST` | Record that a user viewed a content item. | `{"content_item_id": 1, "view_duration": 120}` |
| `/like/toggle/` | `POST` | Like or unlike a content item. | `{"content_item_id": 1}` |
| `/saves/toggle/` | `POST` | Save or unsave a content item (Bookmark). | `{"content_item_id": 1}` |
| `/liked/list/` | `GET` | Get list of all content liked by the user. | - |
| `/saved/list/` | `GET` | Get list of all content saved by the user. | - |

### E. Library (`/api/library/`)
Allows users to organize saved content into custom collections.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/folders/create/` | `POST` | Create a new folder. Payload: `{"name": "My AI Papers"}` |
| `/folders/` | `GET` | List all user folders. |
| `/folders/<id>/add-item/` | `POST` | Add a content item to a folder. Payload: `{"content_item_id": 1}` |
| `/folders/<id>/items/` | `GET` | List items inside a specific folder. |

### F. User Account (`/api/account/`, `/api/settings/`)
Manages user profile and application preferences.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/account/profile/` | `GET` | Fetch user profile details (User info + Interests). |
| `/api/settings/user-settings/` | `GET` | Fetch user preferences (Theme, Notification settings, etc). |

---

## 3. How It Works (User Journey)

1.  **Onboarding**:
    *   The user registers via `/api/auth/signup/`.
    *   They fetch available domains via `/api/interests/domains/`.
    *   They select their interests (e.g., "Computer Science") which are saved via `/api/interests/save/`.

2.  **Discovery**:
    *   The system now knows the user likes "Computer Science".
    *   When the user calls `/api/content/recommendations/` or `/api/content/list/?interest_domain=1`, the system prioritizes python/ML content.
    *   The user can also search explicitly using `/api/content/search/`. This search query is recorded to further refine future recommendations.

3.  **Engagement & Refinement**:
    *   The user clicks a video -> `/api/engagement/views/create/` is called.
    *   The user likes it -> `/api/engagement/like/toggle/` is called.
    *   These signals increase the "score" of similar content in the recommendation algorithm.

4.  **Organization**:
    *   The user wants to keep a video for later. They create a folder "Thesis Resources" via `/api/library/folders/create/` and add the video to it.

---

## 4. Technical Implementation Details

*   **Database**: PostgreSQL is used to store relational data (Users, Content, Interactions).
*   **Authentication**: `simplejwt` handles stateless authentication.
*   **Documentation**: Swagger (`drf-spectacular`) provides an interactive UI at `/api/schema/swagger-ui/`.
