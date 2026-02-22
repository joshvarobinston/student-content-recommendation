# Student Desire Content Recommendation — Frontend Plan

Complete frontend planning document covering all 18 pages, components, API connections, and flow.

---

## Tech Stack (Recommended)

| Layer | Technology |
|-------|-----------|
| Framework | React.js |
| Routing | React Router DOM |
| State Management | Redux Toolkit or Context API |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Icons | React Icons |
| Notifications | React Toastify |
| Auth Storage | localStorage (JWT tokens) |

---

## Folder Structure

```
src/
│
├── api/                        # All API call functions
│   ├── authApi.js
│   ├── accountApi.js
│   ├── interestsApi.js
│   ├── contentApi.js
│   ├── engagementApi.js
│   ├── libraryApi.js
│   └── settingsApi.js
│
├── components/                 # Reusable components
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ContentCard/
│   │   ├── VideoCard.jsx
│   │   ├── NewsCard.jsx
│   │   ├── ArticleCard.jsx
│   │   └── BookCard.jsx
│   ├── Pagination.jsx
│   ├── FilterBar.jsx
│   ├── FolderCard.jsx
│   ├── Modal.jsx
│   └── Loader.jsx
│
├── pages/                      # All 18 pages
│   ├── LandingPage.jsx
│   ├── SignupPage.jsx
│   ├── LoginPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── InterestSelectionPage.jsx
│   ├── FeedPage.jsx
│   ├── SearchResultsPage.jsx
│   ├── ProfilePage.jsx
│   ├── EditProfilePage.jsx
│   ├── ChangePasswordPage.jsx
│   ├── UpdateInterestsPage.jsx
│   ├── DeleteAccountPage.jsx
│   ├── SettingsPage.jsx
│   ├── LibraryPage.jsx
│   ├── FolderDetailPage.jsx
│   ├── SavedItemsPage.jsx
│   └── LikedItemsPage.jsx
│
├── context/                    # Global state
│   └── AuthContext.jsx
│
├── utils/                      # Helper functions
│   ├── token.js                # Save/get/remove JWT tokens
│   └── formatDate.js
│
├── App.jsx                     # Routes definition
└── main.jsx                    # Entry point
```

---

## API Configuration

```
Base URL: http://localhost:8000
All protected routes need: Authorization: Bearer <access_token>
```

---

## Page 1 — Landing Page

### Layout
- Full screen hero section
- Website name + tagline center
- Two buttons: **Sign Up** and **Login**

### Components
- Hero section with background
- Website title (e.g. *"StudentReco — Discover Content Made For You"*)
- Tagline (e.g. *"Personalized YouTube, News & Books — all in one place"*)
- **Sign Up** button → redirect to `/signup`
- **Login** button → redirect to `/login`

### API Calls
- None

### Flow
- If user is already logged in → redirect to `/feed`

---

## Page 2 — Signup Page

### Layout
- Centered form card
- Logo at top

### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| First Name | text | Required |
| Last Name | text | Required |
| Email | email | Required, valid email format |
| Password | password | Required, min 8 characters |
| Confirm Password | password | Must match password |

### Buttons
- **Sign Up** → `POST /api/auth/signup/`
- *Already have an account?* → `/login`

### API Call
```
POST /api/auth/signup/
Body: { email, password }
```

### Success Response
```json
{ "message": "User created successfully" }
```

### Flow
1. Validate form fields
2. Call signup API
3. On success → redirect to `/interests` (onboarding)
4. On error → show error message

---

## Page 3 — Login Page

### Layout
- Centered form card
- Logo at top

### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| Email | email | Required |
| Password | password | Required |

### Buttons
- **Login** → `POST /api/auth/login/`
- *Forgot Password?* → `/forgot-password`
- *Don't have an account?* → `/signup`

### API Call
```
POST /api/auth/login/
Body: { email, password }
```

### Success Response
```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

### Token Storage
```javascript
localStorage.setItem('access_token', response.access)
localStorage.setItem('refresh_token', response.refresh)
```

### Flow
1. Call login API
2. Store access + refresh tokens
3. Check if user has interests → `GET /api/account/profile/`
4. If interests empty → redirect to `/interests`
5. If interests exist → redirect to `/feed`

---

## Page 4 — Forgot Password Page

### Layout
- Centered form card
- Logo at top

### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| Email | email | Required |

### Buttons
- **Send Reset Token** → `POST /api/auth/forgot-password/`
- *Remember your password?* → `/login`

### API Call
```
POST /api/auth/forgot-password/
Body: { email }
```

### Success Response
```json
{
  "message": "Password reset token generated",
  "reset_token": "abc123..."
}
```

### Flow
1. Call forgot password API
2. On success → store token temporarily
3. Redirect to `/reset-password` with email + token passed via state

---

## Page 5 — Reset Password Page

### Layout
- Centered form card
- Logo at top

### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| Email | email | Required |
| Reset Token | text | Required |
| New Password | password | Required, min 8 characters |
| Confirm New Password | password | Must match new password |

### Buttons
- **Reset Password** → `POST /api/auth/reset-password/`
- *Back to Login* → `/login`

### API Call
```
POST /api/auth/reset-password/
Body: { email, token, new_password }
```

### Flow
1. Validate all fields
2. Call reset password API
3. On success → show success message → redirect to `/login`
4. On error → show error (invalid/expired token)

---

## Page 6 — Interest Selection Page

### Layout
- Centered page
- Logo at top
- Checkbox list

### Content
- Title: *"What are you interested in?"*
- Subtitle: *"Select topics to personalize your feed"*
- Checkboxes fetched from `GET /api/interests/domains/`

```
☐ Computer Science
☐ Medical
☐ Business
☐ Engineering
☐ Law
☐ Agriculture
☐ Science
☐ Technology
☐ Arts
☐ Others
```

### Buttons
- **Continue** (disabled until at least 1 checked) → `POST /api/interests/save/`

### API Calls
```
GET /api/interests/domains/         → load all interest options
POST /api/interests/save/           → save selected interests
Body: { interest_ids: [1, 3, 5] }
```

### Flow
1. Load all interest domains
2. User checks interests
3. Click Continue → save interests
4. On success → redirect to `/feed`

---

## Page 7 — Home / Feed Page

### Layout
- Top Navbar
- Left Sidebar
- Main content area

### Top Navbar
- Website logo (left)
- Search bar (center/left) with real-time suggestions
- Profile icon (right) → dropdown:
  - Profile → `/profile`
  - Settings → `/settings`
  - Logout → clear tokens → `/login`

### Left Sidebar
| Item | Filter |
|------|--------|
| 🏠 Home | No filter |
| 🎥 Videos | `?type=video` |
| 📚 Books | `?type=book` |
| 📰 News | `?type=news` |
| 📝 Articles | `?type=article` |
| 📁 Library | `/library` |

### Sort / Date Bar (top of content area)
- Sort: Relevant / Newest / Popular
- Date: Anytime / 24h / Week / Month

### Content Display

**🎥 Videos (YouTube Style)**
- Grid layout (3-4 columns)
- Each card shows:
  - Video thumbnail
  - Video title
  - Channel / source name
  - View count
  - Video duration
  - Publication date
  - ❤️ Like button
  - 🔖 Save button
  - Hover effect → play icon overlay

**📰 News & Articles (Medium Style)**
- List / card layout (1-2 columns)
- Each card shows:
  - Thumbnail (left side)
  - Headline / title
  - Source name
  - Publication date
  - Short excerpt (100-150 words)
  - ❤️ Like button
  - 🔖 Save button
  - **Read More** link → opens source URL

**📚 Books & Research Papers**
- Card grid (3-4 columns)
- Each card shows:
  - Book cover thumbnail
  - Title
  - Authors
  - Publication year
  - Brief description
  - ❤️ Like button
  - 🔖 Save button
  - **View Full** link → opens source URL

### Pagination
```
← Previous   1  2  3 ... n   Next →
```
- 10 items per page (from backend pagination)
- Each sidebar section has independent pagination

### API Calls
```
GET /api/content/personalized-recommendations/
GET /api/content/personalized-recommendations/?type=video&page=1
GET /api/content/personalized-recommendations/?type=video&sort=newest&date=week&page=1
POST /api/engagement/like/toggle/       Body: { content_item_id }
POST /api/engagement/saves/toggle/      Body: { content_item_id }
POST /api/engagement/views/create/      Body: { content_item_id, view_duration }
```

### Empty State
- *"No content found for your interests yet"*

---

## Page 8 — Search Results Page

### Layout
- Top Navbar (search bar pre-filled with query)
- Left Sidebar
- Main content area

### Search Results Area

**Top Section**
- *Showing results for "machine learning"*
- Total results count

**Filter Bar**
- Content Type: All / Video / Article / Book / News
- Sort: Relevant / Newest / Popular

**Results Grid**
- Same display formats as Feed page:
  - Videos → YouTube style
  - News/Articles → Medium style
  - Books → Book card style

### Empty State
- *"No results found for your search"*
- Button → Back to Home

### API Calls
```
POST /api/content/search/
Body: { "query": "machine learning" }

POST /api/engagement/like/toggle/
POST /api/engagement/saves/toggle/
POST /api/engagement/views/create/
```

### Flow
1. User types in search bar → submits
2. Call search API
3. Show ranked results
4. User can filter by content type on frontend

---

## Page 9 — Profile Page

### Layout
- Top Navbar
- Left Sidebar
- Main content area

### Profile Section

**User Info Card**
- Avatar (initials if no photo)
- First Name + Last Name
- Email address
- Account type badge (Student / Educator / Researcher)
- Joined date

**Interests Section**
- Interest tags/badges (e.g. `Computer Science` `Medical`)
- **Edit Interests** button → `/update-interests`

**Action Buttons**
- ✏️ Edit Profile → `/edit-profile`
- 🔒 Change Password → `/change-password`
- 📚 Saved Items → `/saved-items`
- ❤️ Liked Items → `/liked-items`
- 🗑️ Delete Account → `/delete-account`

### API Calls
```
GET /api/account/profile/
```

### Response
```json
{
  "email": "user@email.com",
  "first_name": "John",
  "last_name": "Doe",
  "joined_at": "2024-01-01",
  "interests": ["Computer Science", "Medical"]
}
```

---

## Page 10 — Edit Profile Page

### Layout
- Top Navbar + Left Sidebar

### Form Fields
| Field | Type | Pre-filled |
|-------|------|-----------|
| First Name | text | ✅ Current value |
| Last Name | text | ✅ Current value |

### Buttons
- ✅ **Save Changes** → `PUT /api/account/update-profile/`
- ❌ **Cancel** → `/profile`

### API Calls
```
GET /api/account/profile/           → prefill form
PUT /api/account/update-profile/
Body: { first_name, last_name }
```

### Flow
1. Prefill form with current values
2. User edits
3. Save → show success → redirect to `/profile`

---

## Page 11 — Change Password Page

### Layout
- Top Navbar + Left Sidebar

### Form Fields
| Field | Type | Validation |
|-------|------|-----------|
| Old Password | password | Required |
| New Password | password | Required, min 8 chars |
| Confirm New Password | password | Must match new password |

### Buttons
- ✅ **Save Changes** → `POST /api/account/change-password/`
- ❌ **Cancel** → `/profile`

### API Calls
```
POST /api/account/change-password/
Body: { old_password, new_password }
```

### Flow
1. Validate confirm matches new password (frontend)
2. Call API
3. On success → show success → redirect to `/profile`
4. On error → show *"Old password is incorrect"*

---

## Page 12 — Update Interests Page

### Layout
- Top Navbar + Left Sidebar

### Content
- Title: *"Update Your Interests"*
- All interests as checkboxes
- Currently selected interests **pre-checked**

```
✅ Computer Science
☐ Medical
✅ Business
☐ Engineering
...
```

### Buttons
- ✅ **Save Changes** (disabled if none checked) → `POST /api/interests/save/`
- ❌ **Cancel** → `/profile`

### API Calls
```
GET /api/interests/domains/         → load all interests
GET /api/account/profile/           → get current user interests
POST /api/interests/save/
Body: { interest_ids: [1, 3] }
```

### Flow
1. Load all interests + current user interests
2. Pre-check current selections
3. Save → show success → redirect to `/profile`

---

## Page 13 — Delete Account Page

### Layout
- Top Navbar + Left Sidebar

### Content
- Title: *"Delete Account"*
- Subtitle: *"This action is permanent and cannot be undone"*

**⚠️ Red Warning Box**
- Deleting will permanently remove:
  - Profile data
  - Saved items
  - Liked items
  - Library folders
  - Search history

**Confirmation Checkbox**
- ☐ *"I understand this action is permanent"*

### Buttons
- 🗑️ **Delete Account** (red, disabled until checkbox checked) → `DELETE /api/account/delete-account/`
- ❌ **Cancel** → `/profile`

### API Calls
```
DELETE /api/account/delete-account/
Body: { confirm: true }
```

### Flow
1. User checks confirmation checkbox
2. Delete button activates
3. Show confirmation popup *"Are you sure?"*
4. On confirm → call API
5. On success → clear tokens → redirect to `/`

---

## Page 14 — Settings Page

### Layout
- Top Navbar + Left Sidebar

### Settings Sections

**🎨 UI Preferences**
| Setting | Input Type | Options |
|---------|-----------|---------|
| Theme | Radio / Select | Light / Dark / Auto |
| Items Per Page | Select | 10 / 20 / 50 |
| Show Thumbnails | Toggle | On / Off |

**🌐 Content Preferences**
| Setting | Input Type | Options |
|---------|-----------|---------|
| Preferred Content Type | Select | All / Videos / Articles / Books / News |
| Language | Select | English / etc. |

**🔒 Privacy Controls**
| Setting | Input Type | Options |
|---------|-----------|---------|
| Track Search History | Toggle | On / Off |
| Track View History | Toggle | On / Off |

### Buttons
- ✅ **Save Settings** → `PUT /api/settings/user-settings/`

### API Calls
```
GET /api/settings/user-settings/    → prefill all settings
PUT /api/settings/user-settings/
Body: {
  theme, items_per_page, show_thumbnails,
  preferred_content_type, language,
  track_search_history, track_view_history
}
```

### Flow
1. Load current settings → prefill all fields
2. User changes any setting
3. Save → show success message

---

## Page 15 — Library Page

### Layout
- Top Navbar + Left Sidebar (Library highlighted)

### Content
- Title: *"My Library"*
- ➕ **Create New Folder** button (top right) → opens modal

**Create Folder Modal**
- Folder Name input (required)
- Description input (optional)
- **Create** button → `POST /api/library/folders/create/`

**Folders Grid**
- Each folder card shows:
  - 📁 Folder icon
  - Folder name
  - Description
  - Created date
  - Number of items
  - 👁️ **View** → `/library/<folder_id>`
  - 🗑️ **Delete** → `DELETE /api/library/folders/<id>/delete/`

### Empty State
- *"You have no folders yet. Create one to start organizing!"*

### API Calls
```
GET /api/library/folders/
POST /api/library/folders/create/
Body: { name, description }
DELETE /api/library/folders/<id>/delete/
```

---

## Page 16 — Folder Detail Page

### Layout
- Top Navbar + Left Sidebar (Library highlighted)

### Content
- ← **Back to Library** link
- Folder name as title
- Folder description
- Created date

**Items Grid**
- Fetched from `GET /api/library/folders/<id>/items/`
- Items displayed by content type:
  - Videos → YouTube style
  - News/Articles → Medium style
  - Books → Book card style
- Each card has:
  - ❤️ Like button
  - 🔖 Save button
  - 🗑️ **Remove** → `DELETE /api/library/items/<id>/delete/`

### Empty State
- *"This folder is empty. Save content from your feed to add it here."*

### API Calls
```
GET /api/library/folders/<id>/items/
DELETE /api/library/items/<id>/delete/
POST /api/engagement/like/toggle/
POST /api/engagement/saves/toggle/
```

---

## Page 17 — Saved Items Page

### Layout
- Top Navbar + Left Sidebar

### Content
- Title: *"Saved Items"*
- Subtitle: *"All content you have bookmarked"*

**Filter Bar**
- Content Type: All / Video / Article / Book / News (frontend filter)

**Content Grid**
- Fetched from `GET /api/account/saved-items/`
- Displayed by content type format
- Each card has:
  - ❤️ Like button
  - 🔖 **Unsave** button → `POST /api/engagement/saves/toggle/`
  - ➕ **Add to Folder** → folder dropdown → `POST /api/library/folders/<id>/add-item/`

### Empty State
- *"You have no saved items yet. Browse your feed and bookmark content."*

### API Calls
```
GET /api/account/saved-items/
POST /api/engagement/saves/toggle/      Body: { content_item_id }
POST /api/engagement/like/toggle/       Body: { content_item_id }
POST /api/library/folders/<id>/add-item/ Body: { content_item_id }
GET /api/library/folders/               → for folder dropdown
```

---

## Page 18 — Liked Items Page

### Layout
- Top Navbar + Left Sidebar

### Content
- Title: *"Liked Items"*
- Subtitle: *"All content you have liked"*

**Filter Bar**
- Content Type: All / Video / Article / Book / News (frontend filter)

**Content Grid**
- Fetched from `GET /api/account/liked-items/`
- Displayed by content type format
- Each card has:
  - ❤️ **Unlike** button → `POST /api/engagement/like/toggle/`
  - 🔖 Save button → `POST /api/engagement/saves/toggle/`
  - ➕ **Add to Folder** → folder dropdown

### Empty State
- *"You have no liked items yet. Browse your feed and like content."*

### API Calls
```
GET /api/account/liked-items/
POST /api/engagement/like/toggle/       Body: { content_item_id }
POST /api/engagement/saves/toggle/      Body: { content_item_id }
POST /api/library/folders/<id>/add-item/ Body: { content_item_id }
GET /api/library/folders/               → for folder dropdown
```

---

## Route Structure

```javascript
// Public routes (no auth required)
/                       → Landing Page
/signup                 → Signup Page
/login                  → Login Page
/forgot-password        → Forgot Password Page
/reset-password         → Reset Password Page

// Onboarding (auth required)
/interests              → Interest Selection Page

// Protected routes (auth required)
/feed                   → Home / Feed Page
/search                 → Search Results Page
/profile                → Profile Page
/edit-profile           → Edit Profile Page
/change-password        → Change Password Page
/update-interests       → Update Interests Page
/delete-account         → Delete Account Page
/settings               → Settings Page
/library                → Library Page
/library/:folderId      → Folder Detail Page
/saved-items            → Saved Items Page
/liked-items            → Liked Items Page
```

---

## Auth Flow Summary

```
Landing Page
    ↓
Signup → Interest Selection → Feed
Login → (has interests?) → Feed or Interest Selection
Forgot Password → Reset Password → Login
```

---

## Token Management

```javascript
// utils/token.js

export const saveTokens = (access, refresh) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export const getAccessToken = () => localStorage.getItem('access_token')

export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
```

---

## All API Endpoints Used by Frontend

| Page | Method | Endpoint |
|------|--------|----------|
| Signup | POST | `/api/auth/signup/` |
| Login | POST | `/api/auth/login/` |
| Forgot Password | POST | `/api/auth/forgot-password/` |
| Reset Password | POST | `/api/auth/reset-password/` |
| Interest Domains | GET | `/api/interests/domains/` |
| Save Interests | POST | `/api/interests/save/` |
| Feed | GET | `/api/content/personalized-recommendations/` |
| Search | POST | `/api/content/search/` |
| Profile | GET | `/api/account/profile/` |
| Update Profile | PUT | `/api/account/update-profile/` |
| Change Password | POST | `/api/account/change-password/` |
| Delete Account | DELETE | `/api/account/delete-account/` |
| Saved Items | GET | `/api/account/saved-items/` |
| Liked Items | GET | `/api/account/liked-items/` |
| Settings | GET/PUT | `/api/settings/user-settings/` |
| Record View | POST | `/api/engagement/views/create/` |
| Like Toggle | POST | `/api/engagement/like/toggle/` |
| Save Toggle | POST | `/api/engagement/saves/toggle/` |
| Record Search | POST | `/api/engagement/searches/create/` |
| List Folders | GET | `/api/library/folders/` |
| Create Folder | POST | `/api/library/folders/create/` |
| Delete Folder | DELETE | `/api/library/folders/<id>/delete/` |
| Folder Items | GET | `/api/library/folders/<id>/items/` |
| Add to Folder | POST | `/api/library/folders/<id>/add-item/` |
| Remove from Folder | DELETE | `/api/library/items/<id>/delete/` |

---

## Install Dependencies

```bash
npm create vite@latest student-reco-frontend -- --template react
cd student-reco-frontend
npm install axios react-router-dom react-toastify
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
