# StudentReco Project Report Content

This file is prepared from the Anna University project report format in `C:\Users\Joshva\OneDrive\Downloads\ugthesis.pdf` and tailored for the StudentReco project.

## 1. PDF Format Requirements

The PDF requires the report in this order:

1. Cover Page and Title Page
2. Bonafide Certificate
3. Abstract
4. Table of Contents
5. List of Tables
6. List of Figures
7. List of Symbols, Abbreviations and Nomenclature
8. Chapters
9. Appendices
10. References

Formatting notes from the PDF:

- Paper size: `A4`
- Font: `Times New Roman`
- Main text size: `14`
- Main text spacing: `1.5`
- Abstract and certificate: double spacing

## 2. Suggested Project Title

`STUDENTRECO: A MULTI-PLATFORM PERSONALIZED ACADEMIC CONTENT RECOMMENDATION SYSTEM FOR STUDENTS AND RESEARCHERS`

## 3. Cover Page and Title Page Content

Use this content in the university title-page format:

`STUDENTRECO: A MULTI-PLATFORM PERSONALIZED ACADEMIC CONTENT RECOMMENDATION SYSTEM FOR STUDENTS AND RESEARCHERS`

A PROJECT REPORT

Submitted by

`<YOUR NAME>`

in partial fulfillment for the award of the degree

`BACHELOR OF ENGINEERING` or `BACHELOR OF TECHNOLOGY`

in

`<YOUR BRANCH OF STUDY>`

`<YOUR COLLEGE NAME>`

ANNA UNIVERSITY :: CHENNAI 600 025

`<MONTH & YEAR>`

## 4. Bonafide Certificate Content

Certified that this project report titled `“STUDENTRECO: A MULTI-PLATFORM PERSONALIZED ACADEMIC CONTENT RECOMMENDATION SYSTEM FOR STUDENTS AND RESEARCHERS”` is the bonafide work of `<YOUR NAME>` who carried out the project work under my supervision.

Then place:

- Signature of HOD
- Signature of Supervisor
- Name and designation of HOD
- Name and designation of Supervisor
- Department and college address

## 5. Abstract

StudentReco is a personalized academic content recommendation system designed to help students and researchers discover relevant learning resources from multiple digital platforms in a single unified environment. Students usually depend on separate platforms for videos, news, books, and articles, which leads to fragmented search, irrelevant results, and significant time loss. The proposed system addresses this problem by aggregating educational content from sources such as YouTube, News API, and Google Books, storing the metadata in a unified repository, and generating personalized recommendations based on user interests and behavior.

The system is developed using Django, Django REST Framework, PostgreSQL, and a React-based frontend. It supports secure authentication, OTP-based first-time login verification, OTP-based forgot-password recovery through email, profile and user settings management, domain-based interest selection, content search, user engagement tracking, and library folder organization. The recommendation engine applies TF-IDF vectorization and cosine similarity to match user profiles with content items, and further improves ranking through popularity and recency scoring. User interactions such as likes, saves, views, and searches are used to improve future recommendations.

The proposed system provides a practical, scalable, and intelligent approach for personalized learning support. It reduces information overload, improves relevance of results, and offers a centralized platform for academic content discovery. StudentReco demonstrates how machine learning, recommendation systems, and full-stack web development can be integrated to solve a real-world educational problem effectively.

## 6. Table of Contents Suggestion

1. Introduction
2. Literature Review
3. System Analysis and Requirements
4. System Design
5. Implementation and Results
6. Testing
7. Conclusion and Future Enhancement
8. Appendices
9. References

## 7. List of Tables Suggestion

You can create these tables in the report:

1. Existing System vs Proposed System
2. Functional Requirements
3. Non-Functional Requirements
4. Software and Hardware Requirements
5. API Modules and Endpoints
6. Recommendation Scoring Components
7. Test Cases and Expected Results

## 8. List of Figures Suggestion

You can create these figures in the report:

1. Overall System Architecture
2. Use Case Diagram
3. Data Flow Diagram
4. Recommendation Engine Workflow
5. Database Schema / ER Diagram
6. Authentication with OTP Flow
7. Search and Recommendation Flow
8. Frontend Screenshots

## 9. Symbols, Abbreviations and Nomenclature

- `API` : Application Programming Interface
- `DRF` : Django REST Framework
- `JWT` : JSON Web Token
- `OTP` : One Time Password
- `TF-IDF` : Term Frequency - Inverse Document Frequency
- `UI` : User Interface
- `UX` : User Experience
- `ER` : Entity Relationship
- `DBMS` : Database Management System
- `ML` : Machine Learning
- `NLP` : Natural Language Processing
- `SQL` : Structured Query Language

## 10. Chapter 1: Introduction

### 1.1 General

In the modern academic environment, students and researchers rely on many digital platforms to obtain study material, research updates, and subject knowledge. Videos, news articles, books, and web-based articles are often scattered across unrelated platforms. As a result, learners spend significant time searching, filtering, and validating information before they find useful material.

### 1.2 Problem Statement

The major problem is that academic resources are distributed across multiple platforms without personalization or domain-focused organization. Existing platforms provide isolated search results and do not combine educational resources into one system tailored to the learner’s interests and behavior.

### 1.3 Aim

The aim of this project is to design and implement a smart recommendation platform that aggregates academic resources from multiple sources and recommends relevant content to students and researchers based on their selected interests and interaction history.

### 1.4 Objectives

1. To collect academic content from multiple external sources such as videos, books, and news.
2. To build a unified platform for searching and viewing relevant educational content.
3. To recommend personalized resources based on user interests and engagement data.
4. To provide OTP-based secure authentication and password recovery.
5. To allow users to organize useful content using personal library folders.

### 1.5 Scope of the Project

The project supports students and researchers from different academic domains by recommending content such as videos, books, news, and articles. The system can be extended in future to include research paper databases, semantic search, advanced analytics, and mobile support.

## 11. Chapter 2: Literature Review

### 2.1 Overview

Recommendation systems have been widely used in e-commerce, entertainment, and education to improve personalization and reduce information overload. In educational environments, recommender systems help learners discover relevant resources according to their profiles, preferences, and previous behavior.

### 2.2 Existing Approaches

- Content-based recommendation recommends items similar to a user’s interests or previously consumed items.
- Collaborative filtering recommends items based on similarity between users.
- Hybrid recommendation combines multiple methods to improve relevance and reduce cold-start limitations.

### 2.3 Limitations of Existing Learning Resource Search

Most academic resource platforms focus on only one content type. Video platforms do not provide books in the same interface, book platforms do not reflect current news or articles, and general search engines are not sufficiently personalized for focused academic use. This creates fragmented learning experiences.

### 2.4 Need for the Proposed System

There is a need for a unified educational recommendation platform that integrates multiple content sources and uses personalization techniques to provide useful, domain-specific, and timely resources for learners.

## 12. Chapter 3: System Analysis and Requirements

### 3.1 Existing System

In the existing approach, students manually search across YouTube, online book platforms, blogs, and news websites. The results are scattered, often irrelevant, and difficult to manage.

### 3.2 Drawbacks of Existing System

- Time-consuming search process
- No centralized academic resource access
- Lack of user-specific personalization
- No unified saved-content management
- Difficult to discover updated and relevant material

### 3.3 Proposed System

The proposed StudentReco system aggregates academic content from multiple platforms into a centralized backend and delivers personalized recommendations to each user. It combines interest-based filtering, user interaction tracking, and machine learning similarity scoring to present relevant educational content.

### 3.4 Functional Requirements

- User registration and login
- First-time OTP verification through email
- Forgot-password OTP verification through email
- Interest domain selection
- Personalized and filtered recommendations
- Search within all content or specific content types
- Like, save, and view tracking
- Library folder management
- User settings management
- Admin management through Django admin

### 3.5 Non-Functional Requirements

- Security
- Usability
- Scalability
- Maintainability
- Performance
- Reliability

### 3.6 Software Requirements

- Python
- Django
- Django REST Framework
- React
- PostgreSQL
- scikit-learn
- HTML, CSS, JavaScript
- SMTP email configuration for OTP sending

### 3.7 Hardware Requirements

- Processor: Intel i3 or above
- RAM: 4 GB minimum
- Storage: 20 GB minimum
- Internet connection for external content APIs and email delivery

## 13. Chapter 4: System Design

### 4.1 Overall Architecture

The system follows a full-stack client-server architecture. The React frontend handles user interaction, the Django REST backend processes requests and implements business logic, PostgreSQL stores structured data, and external APIs provide educational content. The recommendation engine ranks items based on user profile similarity, popularity, and recency.

### 4.2 Major Modules

#### 4.2.1 Authentication Module

Handles signup, login, first-time OTP verification, resend OTP, forgot-password OTP verification, and password reset.

#### 4.2.2 Accounts Module

Maintains user profile details, password changes, account deletion, and profile retrieval.

#### 4.2.3 Interests Module

Stores academic domains and the selected interests of each user.

#### 4.2.4 Content Module

Stores content items collected from YouTube, News API, and Google Books. Supports search, personalized recommendations, filtering, content-type selection, and ranking.

#### 4.2.5 Engagement Module

Tracks views, likes, saves, and searches. These interactions are used to improve personalization and popularity scoring while respecting user privacy settings.

#### 4.2.6 Library Module

Allows users to create folders and store useful content for later access.

#### 4.2.7 Settings Module

Stores UI and recommendation-related preferences such as language, page size, and history tracking options.

### 4.3 Recommendation Engine

The recommendation engine works as follows:

1. Collect all available content items.
2. Build a text representation of each item from title, description, domain, and tags.
3. Build a user profile from selected interests, searches, likes, saves, and views.
4. Convert texts into vectors using TF-IDF.
5. Compute cosine similarity between the user profile and content vectors.
6. Combine similarity with popularity and recency scores.
7. Return ranked items to the frontend.

### 4.4 Database Design

Important entities in the database include:

- User
- UserProfile
- UserSettings
- OTPVerification
- InterestDomain
- UserInterest
- ContentItem
- ContentTag
- UserView
- UserLike
- UserSave
- UserSearch
- LibraryFolder
- LibraryItem

## 14. Chapter 5: Implementation and Results

### 5.1 Backend Implementation

The backend is developed using Django and Django REST Framework. It exposes REST APIs for authentication, profile management, interest selection, content retrieval, recommendations, engagement tracking, library operations, and settings updates.

### 5.2 Frontend Implementation

The frontend is built using React and provides screens for signup, login, OTP verification, forgot password, home feed, content-specific search, library management, and settings. The search interface supports section-based filtering so that each segment can search only its corresponding content type when required.

### 5.3 External API Integration

The system integrates with:

- YouTube Data API for educational videos
- News API for recent news articles
- Google Books API for academic books

### 5.4 Security Features

- JWT-based authentication
- OTP verification for first-time login
- OTP-based password reset through email
- Protected endpoints for authenticated users
- Password validation

### 5.5 Results

The implemented system successfully aggregates and recommends multi-platform educational content. Personalized recommendations improve as the user interacts with the platform through searches, likes, saves, and views. The library module improves organization of learning resources, and OTP-based authentication improves account security.

## 15. Chapter 6: Testing

### 6.1 Types of Testing

- Unit Testing
- API Testing
- Integration Testing
- Manual UI Testing

### 6.2 Sample Test Cases

1. Signup with valid details creates user, profile, and settings.
2. First login with valid email and password triggers OTP for unverified users.
3. OTP verification marks the user as verified and returns JWT tokens.
4. Forgot-password request sends OTP to the registered email.
5. Reset password succeeds with correct email, OTP, and strong new password.
6. Saving interests updates the user profile for recommendations.
7. Personalized recommendations return relevant content.
8. Search within content type returns only the selected content segment.
9. Save and like toggles update engagement correctly.
10. Library folder operations create and store saved content properly.

### 6.3 Testing Outcome

The implemented modules were tested for authentication, recommendation quality, engagement behavior, settings validation, interest saving, and library operations. The automated backend tests passed for the core modules, and the frontend build completed successfully after integrating OTP flow and content-segment-aware search.

## 16. Chapter 7: Conclusion and Future Enhancement

### 7.1 Conclusion

StudentReco is a practical full-stack educational recommendation system that solves the problem of fragmented academic resource discovery. By combining multi-platform content aggregation, machine-learning-based recommendation, user engagement analysis, and secure OTP-based authentication, the system provides a relevant, organized, and user-friendly learning experience for students and researchers.

### 7.2 Future Enhancements

- Integration with research paper sources such as arXiv and Semantic Scholar
- Mobile application support
- Advanced NLP-based semantic search
- Collaborative filtering and hybrid recommendation extensions
- Real-time analytics dashboard
- Notes and annotations inside library folders
- Multilingual recommendation support
- Admin dashboard analytics for usage monitoring

## 17. Appendices

### Appendix 1: Major Backend Modules

- `authentication`
- `accounts`
- `interests`
- `content`
- `engagement`
- `library`
- `settings_app`
- `backend`

### Appendix 2: Major Frontend Functions

- Signup page
- Login page
- OTP verification page
- Forgot password page
- Reset password page
- Home feed
- Content-type pages
- Search results page
- Library page
- Settings page

### Appendix 3: Main Technologies Used

- Django
- Django REST Framework
- React
- PostgreSQL
- JWT
- SMTP Email
- scikit-learn
- YouTube Data API
- News API
- Google Books API

## 18. References

Use these as initial references and format them alphabetically in your final report:

1. Aggarwal, C.C. (2016) `Recommender Systems: The Textbook`, Springer.
2. Ricci, F., Rokach, L. and Shapira, B. (2015) `Recommender Systems Handbook`, Springer.
3. Pedregosa, F. et al. (2011) `Scikit-learn: Machine Learning in Python`, Journal of Machine Learning Research.
4. Django Software Foundation. `Django Documentation`. Available at: https://docs.djangoproject.com/
5. Encode OSS. `Django REST Framework Documentation`. Available at: https://www.django-rest-framework.org/
6. Google. `YouTube Data API Documentation`. Available at: https://developers.google.com/youtube/v3
7. Google. `Google Books API Documentation`. Available at: https://developers.google.com/books
8. NewsAPI. `NewsAPI Documentation`. Available at: https://newsapi.org/docs
9. Ramos, J. (2003) `Using TF-IDF to Determine Word Relevance in Document Queries`.
10. Salton, G. and McGill, M.J. (1983) `Introduction to Modern Information Retrieval`, McGraw-Hill.

## 19. Notes for Final Editing

- Replace all placeholder fields such as name, branch, college, month, and year.
- Add real screenshots from your application.
- Add real page numbers after formatting in Word.
- Add your actual table captions and figure captions after inserting them.
- If your department asks for exactly 3 chapters instead of 7, merge chapters into:
  - Introduction
  - Main System Development
  - Conclusion
