# student_Reco/content/services/tfidf.py

from sklearn.feature_extraction.text import TfidfVectorizer
from django.core.cache import cache


def build_tfidf_matrix(content_texts):
    """
    Converts content texts into TF-IDF matrix.
    Cached for 30 minutes to avoid rebuilding on every request.
    """

    cache_key = "tfidf_data"
    cached = cache.get(cache_key)

    if cached:
        return cached["matrix"], cached["vectorizer"]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5000
    )

    tfidf_matrix = vectorizer.fit_transform(content_texts)

    # Cache for 30 minutes
    cache.set(cache_key, {
        "matrix": tfidf_matrix,
        "vectorizer": vectorizer
    }, timeout=1800)

    return tfidf_matrix, vectorizer


def invalidate_tfidf_cache():
    """
    Call this when new content is added
    so TF-IDF matrix gets rebuilt fresh.
    """
    cache.delete("tfidf_data")