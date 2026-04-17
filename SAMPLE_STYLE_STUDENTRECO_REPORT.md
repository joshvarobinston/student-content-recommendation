# StudentReco Report Content Based on Sample Report

This report draft is written by following the structure and writing style of the sample file:

`C:\Users\Joshva\OneDrive\Downloads\Final project - Copy (1) (2) (3).pdf`

You can copy this into Word and format it in `Times New Roman`, font size `14`, with `1.5` line spacing.

## TITLE PAGE

`STUDENTRECO: A MULTI-PLATFORM PERSONALIZED ACADEMIC CONTENT RECOMMENDATION SYSTEM FOR STUDENTS AND RESEARCHERS`

A PROJECT REPORT

Submitted by

`<YOUR NAME>`  
`<YOUR REGISTER NUMBER>`

in partial fulfillment for the award of the degree  
of

`BACHELOR OF ENGINEERING`

in

`COMPUTER SCIENCE AND ENGINEERING`

`<YOUR COLLEGE NAME>`  
`<COLLEGE LOCATION>`

ANNA UNIVERSITY:: CHENNAI 600 025

`APRIL 2026`

## BONAFIDE CERTIFICATE

Certified that this project report “STUDENTRECO: A MULTI-PLATFORM PERSONALIZED ACADEMIC CONTENT RECOMMENDATION SYSTEM FOR STUDENTS AND RESEARCHERS” is the bonafide work of “`<YOUR NAME>`” who carried out the project work under my supervision.

SIGNATURE                                          SIGNATURE  
`<HOD NAME>`                                       `<GUIDE NAME>`  
HEAD OF THE DEPARTMENT                             SUPERVISOR  
`<Designation>`                                   `<Designation>`  
Computer Science and Engineering                  Computer Science and Engineering  
`<College Name and Address>`                      `<College Name and Address>`

Submitted for the viva-voce examination held on `__________________`

INTERNAL EXAMINER                                 EXTERNAL EXAMINER

## ACKNOWLEDGEMENT

With great pleasure, I express my sincere gratitude to the management of our institution for providing the facilities and support required for the successful completion of this project.

I express my heartfelt thanks to our Principal for the encouragement, motivation, and academic environment provided throughout the project period.

I offer my sincere thanks to the Head of the Department of Computer Science and Engineering for the valuable guidance, encouragement, and support extended during the development of this project.

I express my deep sense of gratitude to my project supervisor for the continuous guidance, constructive suggestions, technical support, and encouragement that helped me complete this project successfully.

I also thank all the faculty members, friends, and family members who directly and indirectly supported me in carrying out this work with confidence and enthusiasm.

## ABSTRACT

Students and researchers often depend on multiple digital platforms such as YouTube, news portals, online books, and academic articles to find relevant learning resources. Since these resources are scattered across different platforms, users spend significant time searching, filtering, and organizing content. Traditional search methods do not provide a personalized, centralized, and academic-focused experience. This leads to information overload, irrelevant results, and poor productivity.

This project presents `StudentReco`, a multi-platform personalized academic content recommendation system designed to help students and researchers discover useful educational resources from a single unified platform. The system aggregates content from external sources such as YouTube, News API, and Google Books, stores the content metadata in a centralized database, and generates recommendations according to the user’s interests and behavioral interactions.

The proposed system includes modules for user authentication, OTP verification for first-time login, OTP-based password recovery, profile management, interest domain selection, personalized content recommendations, engagement tracking, user settings, and library folder management. The recommendation engine uses TF-IDF vectorization and cosine similarity to compare user profiles with content items. The ranking process is further improved using popularity and recency scores.

The system is implemented using Django, Django REST Framework, PostgreSQL, React, and machine learning techniques. It improves academic content discovery by reducing search effort, increasing personalization, and supporting structured organization of learning materials. The project demonstrates the practical application of recommendation systems in education and provides a scalable foundation for future intelligent learning platforms.

## TABLE OF CONTENTS

1. INTRODUCTION  
1.1 Overview  
1.2 Problem Statement  
1.3 Recommendation System Concept  
1.3.1 Definition of Recommendation System  
1.3.2 Content Aggregation  
1.3.3 Personalization Mechanism  
1.3.4 Security and OTP Verification  
1.3.5 Advantages of the Proposed Approach  
1.4 Aim and Objectives  
1.5 Scope of the Project  

2. LITERATURE REVIEW  
2.1 Overview of Literature Survey  

3. SYSTEM ANALYSIS  
3.1 Existing System  
3.1.1 Disadvantages  
3.2 Proposed System  
3.2.1 Advantages  
3.3 System Environment  
3.3.1 Software Configuration  
3.3.2 Hardware Configuration  
3.3.3 About Software  
3.4 Modules Description  
3.5 System Architecture  

4. SYSTEM DESIGN  
4.1 Introduction  
4.2 System Overview  
4.3 Module Description  
4.4 System Workflow  
4.5 Implementation Tools  

5. AUTHENTICATION AND USER MANAGEMENT  
5.1 Introduction  
5.2 User Registration  
5.3 Login with OTP Verification  
5.4 Forgot Password with OTP  
5.5 Profile Management  
5.6 Settings Management  

6. CONTENT AND RECOMMENDATION MANAGEMENT  
6.1 Introduction  
6.2 Interest Selection  
6.3 Content Aggregation  
6.4 Search and Filtering  
6.5 Personalized Recommendation Engine  
6.6 Engagement Tracking  
6.7 Library Management  

7. FRONTEND AND USER INTERFACE  
7.1 Introduction  
7.2 Home and Content-Type Navigation  
7.3 Search Interface  
7.4 OTP Screens  
7.5 Library and Saved Content  
7.6 Compact Responsive Design  

8. SYSTEM DESIGN AND IMPLEMENTATION  
8.1 Introduction  
8.2 System Design  
8.3 Database Design  
8.4 System Implementation  
8.5 User Interface Design  
8.6 Input Design  
8.7 Output Design  
8.8 Security Design  

9. CONCLUSION AND FUTURE ENHANCEMENT  
9.1 Conclusion  
9.2 Future Enhancement  

REFERENCE

## LIST OF TABLES

Table 1 Existing learning resource discovery methods  
Table 2 Literature survey comparison  
Table 3 System overview  
Table 4 Authentication module  
Table 5 Recommendation module  
Table 6 Engagement module  
Table 7 Library module  
Table 8 Settings module  
Table 9 Implementation tools  
Table 10 Test scenarios

## LIST OF FIGURES

Figure 1.1 StudentReco system architecture  
Figure 1.2 Recommendation system concept  
Figure 3.1 Overall module architecture  
Figure 4.1 System workflow diagram  
Figure 5.1 OTP authentication flow  
Figure 6.1 Recommendation engine workflow  
Figure 7.1 Frontend search and segment navigation  
Figure 8.1 Database design

## LIST OF ABBREVIATIONS

`API` Application Programming Interface  
`DRF` Django REST Framework  
`JWT` JSON Web Token  
`OTP` One Time Password  
`TF-IDF` Term Frequency - Inverse Document Frequency  
`UI` User Interface  
`UX` User Experience  
`ML` Machine Learning  
`NLP` Natural Language Processing  
`RBAC` Role Based Access Control  
`DBMS` Database Management System

## CHAPTER 1

# INTRODUCTION

## 1.1 OVERVIEW

StudentReco is a web-based academic content recommendation system developed to help students and researchers discover relevant educational resources from different digital platforms through a single unified interface. In the current learning environment, users frequently depend on YouTube for videos, online portals for news, digital libraries for books, and websites for articles. Since these resources are distributed across multiple platforms, it becomes difficult to search efficiently and identify the most relevant material.

Traditional search methods usually provide generic results without understanding the academic domain, learning preference, or previous behavior of the user. This reduces productivity and increases the time spent on searching rather than learning. StudentReco addresses this problem by combining multi-platform content aggregation with personalized recommendation techniques.

The system stores content metadata in a centralized backend and recommends items based on user interests, past searches, likes, saves, and views. It also provides secure authentication, OTP verification for first-time login, OTP-based forgot-password recovery, and a personal library for organizing content.

## 1.2 PROBLEM STATEMENT

Students and researchers often search for learning materials across multiple unrelated platforms. Videos, books, articles, and news are not available in one academic-focused interface. The search results from general platforms are often excessive, not personalized, and may not reflect the specific domain or learning goal of the user.

This scattered approach causes time loss, information overload, poor organization of useful materials, and difficulty in maintaining continuity in research or study. In addition, many platforms do not maintain a combined user learning profile, making personalization weak or absent. There is a need for a centralized system that can aggregate educational content from different sources and recommend the most useful resources in a personalized manner.

## 1.3 RECOMMENDATION SYSTEM CONCEPT

StudentReco is based on the concept of educational recommendation systems, which use user preferences and behavioral data to suggest relevant resources.

### 1.3.1 Definition of Recommendation System

A recommendation system is an intelligent software mechanism that identifies user preferences and suggests relevant items accordingly. In the context of education, a recommendation system helps learners discover suitable resources based on interests, activity, and learning goals.

### 1.3.2 Content Aggregation

The system collects content from multiple external services such as YouTube, News API, and Google Books. These content sources are normalized into a single format and stored in a centralized database to support consistent search and recommendation.

### 1.3.3 Personalization Mechanism

The personalization process uses selected interests and engagement signals such as searches, likes, saves, and views. The recommendation engine matches user-profile text with content metadata using TF-IDF and cosine similarity, then ranks the results using popularity and recency.

### 1.3.4 Security and OTP Verification

The system includes secure login and password recovery mechanisms. A first-time user must verify an OTP sent to email after correct email and password login. A similar OTP mechanism is provided for forgot-password recovery. This improves trust and security for account ownership verification.

### 1.3.5 Advantages of the Proposed Approach

- Centralized access to multi-platform learning content
- Personalized recommendation based on domain and behavior
- Improved content discovery efficiency
- Secure authentication with OTP verification
- Better organization through saved items and library folders

## 1.4 AIM AND OBJECTIVES

### Aim

The aim of this project is to design and develop a secure, efficient, and intelligent academic content recommendation platform that aggregates educational resources from multiple digital sources and provides personalized recommendations to students and researchers.

### Objectives

- To collect educational content from videos, books, news, and articles through external APIs.
- To build a centralized web platform for searching and viewing academic resources.
- To recommend personalized content using machine learning techniques.
- To implement OTP-based first-time login verification and password recovery.
- To track user behavior such as likes, saves, views, and searches for improving recommendation quality.
- To provide a library feature for organizing useful content.

## 1.5 SCOPE OF THE PROJECT

The scope of StudentReco is limited to academic resource discovery and recommendation through a web-based application. The project supports students and researchers by recommending learning resources based on interest domains, search behavior, and content interactions. The current implementation integrates videos, books, and news content from selected external APIs and allows users to manage saved materials through library folders. The system is scalable and can be extended later to support research papers, semantic search, analytics dashboards, and mobile applications.

## CHAPTER 2

# LITERATURE REVIEW

1. Educational Recommendation Systems for Personalized Learning  
Authors: F. Ricci, L. Rokach, B. Shapira  
Year: 2015  
Objective: To improve user-specific content recommendation using recommender system principles.  
Methodology: Hybrid recommendation using content and collaborative information.  
Technology: Recommendation algorithms, profile modeling.  
Merits: Strong personalization and broad applicability.  
Demerits: Requires careful feature design and quality data.

2. Recommender Systems in E-Learning Environments  
Authors: C.C. Aggarwal and others  
Year: 2016  
Objective: To support learners through personalized educational suggestions.  
Methodology: Behavior-based and profile-based recommendation.  
Technology: Similarity computation, ranking, user modeling.  
Merits: Better learning support and reduced search effort.  
Demerits: Cold-start and sparse interaction problems.

3. Content-Based Filtering Using TF-IDF and Cosine Similarity  
Authors: J. Ramos  
Year: 2003  
Objective: To measure text relevance using TF-IDF.  
Methodology: Vectorization and cosine similarity between query and content.  
Technology: TF-IDF, cosine similarity.  
Merits: Simple, interpretable, effective for text-heavy recommendation.  
Demerits: Limited semantic understanding.

4. Secure Web Authentication with One-Time Password Systems  
Authors: Various applied web security studies  
Year: 2020-2024  
Objective: To improve account verification and password recovery security.  
Methodology: OTP delivery to verified communication channels.  
Technology: Email OTP, token expiration, verification records.  
Merits: Better identity validation and password recovery security.  
Demerits: Dependent on delivery success and user email access.

5. Multi-Source Learning Resource Integration Platforms  
Authors: Recent educational platform studies  
Year: 2021-2024  
Objective: To unify multiple resource channels into one learner-facing system.  
Methodology: API integration and metadata normalization.  
Technology: REST APIs, web platforms, centralized data stores.  
Merits: Reduced fragmentation and better accessibility.  
Demerits: Data consistency and API dependency challenges.

## 2.1 OVERVIEW OF LITERATURE SURVEY

The literature survey shows that existing educational recommendation platforms and related systems focus on one or more of the following aspects: personalization, recommendation algorithms, secure authentication, and content integration. However, many systems do not combine all these aspects in a single learner-focused platform. StudentReco brings together content aggregation, recommendation, engagement-aware ranking, and OTP-secured account flow in one integrated system.

## CHAPTER 3

# SYSTEM ANALYSIS

## 3.1 EXISTING SYSTEM

At present, students search for learning content manually across different platforms such as YouTube, online news portals, e-book services, and websites. Each platform provides only a limited type of content and does not maintain a unified academic profile for the learner.

- Manual search across multiple platforms
- Generic search results without academic personalization
- No centralized academic resource management
- No consistent saved-content organization across sources
- Weak continuity between search history and recommendations

### 3.1.1 DISADVANTAGES

- Wastes time in switching across multiple platforms
- Produces many irrelevant search results
- Difficult to track or organize useful materials
- No domain-based personalization
- No unified academic recommendation experience
- Repeated search effort for similar topics

## 3.2 PROPOSED SYSTEM

The proposed StudentReco system is a centralized recommendation platform that collects educational content from multiple digital sources and delivers personalized results through a secure web application. It uses machine learning similarity scoring, engagement tracking, and settings-aware filtering to improve recommendation quality. The system also supports OTP-based first-time login and OTP-based forgot-password flow through email.

### 3.2.1 ADVANTAGES

- Centralized academic content discovery
- Personalized recommendation
- Domain-aware interest selection
- OTP-based secure account verification
- Better content organization using saved items and library folders
- Scalable modular architecture

## 3.3 SYSTEM ENVIRONMENT

### 3.3.1 SOFTWARE CONFIGURATION

- Operating System: Windows
- Frontend: React, JavaScript, CSS
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL / SQLite in development
- Authentication: JWT and Email OTP
- APIs: YouTube Data API, News API, Google Books API
- Machine Learning: scikit-learn

### 3.3.2 HARDWARE CONFIGURATION

- Processor: Intel i3 or above
- RAM: 4 GB or above
- Hard Disk: 20 GB minimum free space
- Internet connection for API data and email service

### 3.3.3 ABOUT SOFTWARE

`Django` is used to develop the backend services and implement models, APIs, authentication, and business logic.  
`Django REST Framework` is used for RESTful API development and serializer-based validation.  
`React` is used to create the user interface for authentication, search, recommendations, and library operations.  
`PostgreSQL` stores structured application data.  
`scikit-learn` is used for TF-IDF vectorization and cosine similarity-based recommendation.

## 3.4 MODULES DESCRIPTION

- Authentication Module
- Accounts Module
- Interests Module
- Content Module
- Engagement Module
- Library Module
- Settings Module
- Recommendation Engine

## 3.5 SYSTEM ARCHITECTURE

The StudentReco system follows a full-stack client-server architecture. The frontend sends requests to the Django REST backend. The backend interacts with the database and external APIs. User interactions are stored as engagement data and used by the recommendation engine. The final ranked results are returned to the frontend and displayed in content-specific segments such as videos, books, news, and articles.

## CHAPTER 4

# SYSTEM DESIGN

## 4.1 INTRODUCTION

System design defines the internal organization of StudentReco and the interaction between users, frontend components, backend APIs, recommendation services, and the database.

## 4.2 SYSTEM OVERVIEW

StudentReco accepts input from users in the form of signup information, login credentials, OTP codes, selected interests, search keywords, likes, saves, views, and folder actions. It processes these through backend services and generates outputs such as personalized recommendations, filtered search results, saved items, and user-specific settings-based content views.

## 4.3 MODULE DESCRIPTION

### Authentication Module

Supports signup, login, OTP verification, resend OTP, forgot-password OTP, and reset-password operations.

### Accounts Module

Manages profile data, password updates, account deletion, and profile retrieval.

### Interests Module

Stores academic domains and maps selected domains to the user.

### Content Module

Maintains content items, tags, search, recommendation endpoints, and external ingestion logic.

### Engagement Module

Stores views, likes, saves, and searches with privacy-aware tracking.

### Library Module

Allows folder creation and content organization.

### Settings Module

Stores language, page size, tracking preferences, and UI-related settings.

## 4.4 SYSTEM WORKFLOW

1. User signs up and logs in.
2. If first-time login, OTP is sent to the email.
3. User verifies OTP and receives access tokens.
4. User selects interest domains.
5. User searches or browses content segments.
6. Backend fetches or reuses multi-platform content.
7. Recommendation engine ranks content using similarity, popularity, and recency.
8. User can like, save, view, or organize items into library folders.
9. Engagement data improves future recommendations.

## 4.5 IMPLEMENTATION TOOLS

- Python
- Django
- Django REST Framework
- React
- PostgreSQL
- JavaScript
- CSS
- scikit-learn
- SMTP email integration

## CHAPTER 5

# AUTHENTICATION AND USER MANAGEMENT

## 5.1 INTRODUCTION

This chapter explains how StudentReco manages users securely through registration, OTP-based verification, profile maintenance, and settings management.

## 5.2 USER REGISTRATION

The user creates an account using email and password. On successful signup, the system creates the associated profile and settings records for that user.

## 5.3 LOGIN WITH OTP VERIFICATION

When a first-time user logs in with valid email and password, the system checks whether the email has been verified. If not, an OTP is generated and sent to the user’s registered email address. The user must enter the OTP to complete login. Once verified, the account is marked as email verified, and future logins can continue directly with email and password.

## 5.4 FORGOT PASSWORD WITH OTP

If the user forgets the password, the system sends a password-reset OTP to the registered email address. The user must provide the email, OTP, and a strong new password to reset the account password securely.

## 5.5 PROFILE MANAGEMENT

Users can view and update profile details, change passwords, and delete their account when required. The profile also contains verification-related state and supports personalized user data.

## 5.6 SETTINGS MANAGEMENT

The settings module allows users to manage preferences such as language, items per page, content preferences, and tracking settings. These preferences influence the search and recommendation experience.

## CHAPTER 6

# CONTENT AND RECOMMENDATION MANAGEMENT

## 6.1 INTRODUCTION

This chapter explains how StudentReco manages content collection, user interests, search, recommendation ranking, engagement tracking, and library organization.

## 6.2 INTEREST SELECTION

Users select academic domains such as Artificial Intelligence, Machine Learning, Data Science, and related fields. These interests are used to create an initial recommendation profile.

## 6.3 CONTENT AGGREGATION

The system fetches content metadata from external services including YouTube, News API, and Google Books. The fetched results are normalized and stored as content items in the database for recommendation and display.

## 6.4 SEARCH AND FILTERING

The system supports searching across all content or within a specific content segment such as videos, books, news, or articles. The frontend passes the relevant type so that each section searches only its own content when needed.

## 6.5 PERSONALIZED RECOMMENDATION ENGINE

The recommendation engine builds content text from title, description, domain, and tags. It builds user-profile text from interests, searches, likes, saves, and views. TF-IDF vectorization and cosine similarity measure relevance. The final ranking is improved using popularity and recency scores.

## 6.6 ENGAGEMENT TRACKING

User activity such as likes, saves, views, and searches is recorded to improve recommendation quality. Privacy settings are respected so that search and view history can be disabled by the user.

## 6.7 LIBRARY MANAGEMENT

Users can save items into custom library folders for later access. This helps organize learning materials according to topics, subjects, or projects.

## CHAPTER 7

# FRONTEND AND USER INTERFACE

## 7.1 INTRODUCTION

The frontend interface is designed to provide a clear and compact user experience for academic resource discovery.

## 7.2 HOME AND CONTENT-TYPE NAVIGATION

The home interface provides navigation for content sections such as videos, books, news, and articles. Each section can show filtered content relevant to its type.

## 7.3 SEARCH INTERFACE

The search interface supports both global search and section-based search. When the user searches within a specific segment, the system returns only the corresponding content type. This improves clarity and avoids mixed irrelevant results.

## 7.4 OTP SCREENS

The frontend includes dedicated screens for OTP verification, resend OTP, forgot-password OTP flow, and reset-password submission.

## 7.5 LIBRARY AND SAVED CONTENT

The library page supports folder management and display of saved content. Users can review and organize useful academic materials easily.

## 7.6 COMPACT RESPONSIVE DESIGN

The interface is improved with compact result cards, safe image fallback behavior, better search alignment, and responsive presentation across sections.

## CHAPTER 8

# SYSTEM DESIGN AND IMPLEMENTATION

## 8.1 INTRODUCTION

This chapter presents the design and implementation details of the StudentReco system from backend, frontend, database, and security perspectives.

## 8.2 SYSTEM DESIGN

The system follows modular app separation in Django:

- `authentication`
- `accounts`
- `interests`
- `content`
- `engagement`
- `library`
- `settings_app`
- `backend`

The React frontend communicates with these backend services through structured API calls.

## 8.3 DATABASE DESIGN

The database includes the following major entities:

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

## 8.4 SYSTEM IMPLEMENTATION

Backend implementation includes:

- REST API development
- OTP email verification flow
- personalized recommendation services
- external content API ingestion
- engagement recording
- settings-aware filtering

Frontend implementation includes:

- authentication pages
- OTP verification interface
- search and recommendation pages
- content cards with image fallback
- library and settings pages

## 8.5 USER INTERFACE DESIGN

The interface is designed to provide simple navigation, compact cards, content-type-specific search, and user-friendly resource browsing.

## 8.6 INPUT DESIGN

Important user inputs include:

- signup details
- login credentials
- OTP codes
- search keywords
- interest domain selection
- save, like, and folder actions

## 8.7 OUTPUT DESIGN

Important outputs include:

- personalized recommendations
- filtered content search results
- OTP verification responses
- saved and liked content lists
- folder-based library views

## 8.8 SECURITY DESIGN

The security design includes:

- JWT-based authentication
- OTP verification by email
- OTP-based forgot-password flow
- password validation
- protected endpoints
- user settings for privacy-aware tracking

## CHAPTER 9

# CONCLUSION AND FUTURE ENHANCEMENT

## 9.1 CONCLUSION

StudentReco successfully addresses the problem of fragmented academic content discovery by providing a centralized, secure, and personalized recommendation platform. The system integrates multi-platform content aggregation, user-interest-based recommendation, engagement-aware ranking, and OTP-secured user authentication. It improves learning efficiency, reduces search effort, and helps students and researchers organize useful resources in a structured manner. The project demonstrates the practical value of full-stack web development and machine learning in educational applications.

## 9.2 FUTURE ENHANCEMENT

- Add research paper integration from arXiv, Semantic Scholar, and Crossref
- Introduce semantic search using transformer-based embeddings
- Add collaborative filtering for user-to-user recommendation
- Build analytics dashboards for learning trends
- Develop a mobile version of the platform
- Support multilingual recommendation and translation
- Add notes and annotations inside library folders

## REFERENCES

### Journal / Academic References

1. Aggarwal, C.C. (2016) `Recommender Systems: The Textbook`, Springer.
2. Ricci, F., Rokach, L. and Shapira, B. (2015) `Recommender Systems Handbook`, Springer.
3. Pedregosa, F. et al. (2011) `Scikit-learn: Machine Learning in Python`, Journal of Machine Learning Research.
4. Ramos, J. (2003) `Using TF-IDF to Determine Word Relevance in Document Queries`.
5. Salton, G. and McGill, M.J. (1983) `Introduction to Modern Information Retrieval`, McGraw-Hill.

### Book References

1. Sommerville, I. `Software Engineering`.
2. Pressman, R.S. `Software Engineering: A Practitioner’s Approach`.
3. Elmasri, R. and Navathe, S.B. `Fundamentals of Database Systems`.

### Web References

1. Django Documentation: https://docs.djangoproject.com/
2. Django REST Framework Documentation: https://www.django-rest-framework.org/
3. YouTube Data API Documentation: https://developers.google.com/youtube/v3
4. Google Books API Documentation: https://developers.google.com/books
5. NewsAPI Documentation: https://newsapi.org/docs

## FINAL EDITING NOTES

- Replace placeholders with your real name, register number, college name, guide name, and department details.
- Add real screenshots from your StudentReco frontend for search, OTP verification, home page, and library page.
- Insert diagrams for architecture, workflow, and database design.
- Add page numbers after formatting in Word.
- If your department asks for shorter content, I can compress this into a final submission version.
