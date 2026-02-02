# student_Reco/content/services/recommendation.py

def compute_final_score(
    ml_similarity: float,
    popularity_score: float,
    recency_score: float
) -> float:
    """
    Combines ML similarity, popularity, and recency
    into a single final recommendation score.
    """

    return (
        (ml_similarity * 0.4) +
        (popularity_score * 0.3) +
        (recency_score * 0.3)
    )
from typing import List, Dict


def rank_contents(scored_contents: List[Dict]) -> List[Dict]:
    """
    Sorts content dictionaries by final_score (descending).
    Each item in scored_contents must contain 'final_score'.
    """

    return sorted(
        scored_contents,
        key=lambda x: x["final_score"],
        reverse=True
    )

from content.models import ContentItem
from content.services.text_processing import build_content_text
from content.services.tfidf import build_tfidf_matrix
from content.services.user_profile import build_user_profile_text
from content.services.similarity import compute_similarity
from content.services.popularity import calculate_popularity_score
from content.services.recency import calculate_recency_score


def generate_recommendations_for_user(user):
    """
    End-to-end recommendation pipeline.
    Returns ranked content items for a given user.
    """

    # 1. Fetch all content
    contents = list(ContentItem.objects.all())
    if not contents:
        return []

    # 2. Build content text corpus
    content_texts = [build_content_text(c) for c in contents]

    # 3. TF-IDF vectorization
    tfidf_matrix, vectorizer = build_tfidf_matrix(content_texts)

    # 4. Build user profile text
    user_text = build_user_profile_text(user)

    # Cold-start: no user data
    if not user_text.strip():
        scored = []
        for c in contents:
            popularity = calculate_popularity_score(c)
            recency = calculate_recency_score(c)
            final_score = compute_final_score(
                ml_similarity=0.0,
                popularity_score=popularity,
                recency_score=recency
            )
            scored.append({
                "content": c,
                "final_score": final_score
            })
        return rank_contents(scored)

    # 5. Vectorize user profile using same vectorizer
    user_vector = vectorizer.transform([user_text])

    # 6. Compute cosine similarity
    similarity_scores = compute_similarity(user_vector, tfidf_matrix)

    # 7. Combine all scores
    scored_contents = []
    for idx, content in enumerate(contents):
        ml_sim = similarity_scores[idx]
        popularity = calculate_popularity_score(content)
        recency = calculate_recency_score(content)

        final_score = compute_final_score(
            ml_similarity=ml_sim,
            popularity_score=popularity,
            recency_score=recency
        )

        scored_contents.append({
            "content": content,
            "ml_similarity": ml_sim,
            "popularity_score": popularity,
            "recency_score": recency,
            "final_score": final_score
        })

    # 8. Rank and return
    return rank_contents(scored_contents)
