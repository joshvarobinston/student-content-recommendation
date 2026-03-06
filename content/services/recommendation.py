# student_Reco/content/services/recommendation.py

from content.models import ContentItem
from content.services.text_processing import build_content_text
from content.services.tfidf import build_tfidf_matrix
from content.services.user_profile import build_user_profile_text
from content.services.similarity import compute_similarity
from content.services.popularity import calculate_popularity_score
from content.services.recency import calculate_recency_score


def normalize_popularity(score, max_score=100):
    """
    Normalizes popularity score to 0-1 range
    so it doesn't dominate the ML formula
    """
    if max_score == 0:
        return 0.0
    return min(score / max_score, 1.0)


def compute_final_score(
    ml_similarity: float,
    popularity_score: float,
    recency_score: float
) -> float:
    """
    Combines ML similarity, popularity, and recency
    into a single final recommendation score.

    Weights:
    - ML Similarity  → 40%
    - Popularity     → 30%
    - Recency        → 30%
    """
    return (
        (ml_similarity * 0.4) +
        (popularity_score * 0.3) +
        (recency_score * 0.3)
    )


def rank_contents(scored_contents):
    """
    Sorts content by final_score descending.
    """
    return sorted(
        scored_contents,
        key=lambda x: x["final_score"],
        reverse=True
    )


def generate_recommendations_for_user(user, content_type=None):
    """
    End-to-end ML recommendation pipeline.

    Steps:
    1. Fetch all content (filtered by type if given)
    2. Build TF-IDF matrix
    3. Build user profile text
    4. Compute cosine similarity
    5. Combine ML + popularity + recency scores
    6. Rank and return
    """

    # 1. Fetch content
    queryset = ContentItem.objects.all()
    if content_type:
        queryset = queryset.filter(content_type=content_type)

    contents = list(queryset)
    if not contents:
        return []

    # 2. Build content text corpus
    content_texts = [build_content_text(c) for c in contents]

    # 3. TF-IDF vectorization (cached internally)
    tfidf_matrix, vectorizer = build_tfidf_matrix(content_texts)

    # 4. Build user profile text
    user_text = build_user_profile_text(user)

    # Cold-start: no user data → fallback to popularity + recency
    if not user_text.strip():
        scored = []
        for c in contents:
            popularity = calculate_popularity_score(c)
            normalized_pop = normalize_popularity(popularity)
            recency = calculate_recency_score(c)
            final_score = compute_final_score(
                ml_similarity=0.0,
                popularity_score=normalized_pop,
                recency_score=recency
            )
            scored.append({"content": c, "final_score": final_score})
        return rank_contents(scored)

    # 5. Vectorize user profile
    user_vector = vectorizer.transform([user_text])

    # 6. Compute cosine similarity
    similarity_scores = compute_similarity(user_vector, tfidf_matrix)

    # 7. Combine all scores
    scored_contents = []
    for idx, content in enumerate(contents):
        ml_sim = float(similarity_scores[idx])
        popularity = calculate_popularity_score(content)
        normalized_pop = normalize_popularity(popularity)
        recency = calculate_recency_score(content)

        final_score = compute_final_score(
            ml_similarity=ml_sim,
            popularity_score=normalized_pop,
            recency_score=recency
        )

        scored_contents.append({
            "content": content,
            "ml_similarity": ml_sim,
            "popularity_score": normalized_pop,
            "recency_score": recency,
            "final_score": final_score
        })

    # 8. Rank and return
    return rank_contents(scored_contents)