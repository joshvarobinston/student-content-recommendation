# student_Reco/content/services/recommendation.py

from content.models import ContentItem
from content.services.popularity import calculate_popularity_score
from content.services.recency import calculate_recency_score
from content.services.similarity import compute_similarity
from content.services.text_processing import build_content_text
from content.services.tfidf import build_tfidf_matrix
from content.services.user_profile import build_user_profile_text
from engagement.models import UserLike, UserSave, UserSearch, UserView
from interests.models import UserInterest


def normalize_popularity(score, max_score=100):
    if max_score == 0:
        return 0.0
    return min(score / max_score, 1.0)


def compute_final_score(
    ml_similarity: float,
    popularity_score: float,
    recency_score: float,
    interest_boost: float = 0.0,
) -> float:
    return (
        (ml_similarity * 0.4) +
        (popularity_score * 0.3) +
        (recency_score * 0.2) +
        (interest_boost * 0.1)
    )


def is_behavior_cold_start(user) -> bool:
    return not (
        UserSearch.objects.filter(user=user).exists()
        or UserSave.objects.filter(user=user).exists()
        or UserLike.objects.filter(user=user).exists()
        or UserView.objects.filter(user=user).exists()
    )


def rank_contents(scored_contents):
    return sorted(scored_contents, key=lambda x: x["final_score"], reverse=True)


def generate_recommendations_for_user(user, content_type=None):
    user_interest_ids = set(
        UserInterest.objects.filter(user=user).values_list("interest_id", flat=True)
    )

    queryset = ContentItem.objects.select_related("interest_domain").prefetch_related("content_tags__tag")
    if content_type:
        queryset = queryset.filter(content_type=content_type)

    contents = list(queryset)
    if not contents:
        return []

    content_texts = [build_content_text(c) for c in contents]
    tfidf_matrix, vectorizer = build_tfidf_matrix(content_texts)
    user_text = build_user_profile_text(user)

    if not user_text.strip():
        scored = []
        for content in contents:
            popularity = calculate_popularity_score(content)
            normalized_pop = normalize_popularity(popularity)
            recency = calculate_recency_score(content)
            interest_boost = 1.0 if content.interest_domain_id in user_interest_ids else 0.0
            final_score = compute_final_score(
                ml_similarity=0.0,
                popularity_score=normalized_pop,
                recency_score=recency,
                interest_boost=interest_boost,
            )
            scored.append({"content": content, "final_score": final_score})
        return rank_contents(scored)

    user_vector = vectorizer.transform([user_text])
    similarity_scores = compute_similarity(user_vector, tfidf_matrix)
    cold_start = is_behavior_cold_start(user)

    scored_contents = []
    for idx, content in enumerate(contents):
        ml_sim = float(similarity_scores[idx])
        popularity = calculate_popularity_score(content)
        normalized_pop = normalize_popularity(popularity)
        recency = calculate_recency_score(content)
        interest_boost = 1.0 if content.interest_domain_id in user_interest_ids else 0.0

        if cold_start and interest_boost:
            ml_sim = min(ml_sim + 0.2, 1.0)

        final_score = compute_final_score(
            ml_similarity=ml_sim,
            popularity_score=normalized_pop,
            recency_score=recency,
            interest_boost=interest_boost,
        )

        scored_contents.append(
            {
                "content": content,
                "ml_similarity": ml_sim,
                "popularity_score": normalized_pop,
                "recency_score": recency,
                "final_score": final_score,
            }
        )

    return rank_contents(scored_contents)
