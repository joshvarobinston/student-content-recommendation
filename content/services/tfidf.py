# student_Reco/content/services/tfidf.py

from sklearn.feature_extraction.text import TfidfVectorizer


def build_tfidf_matrix(content_texts):
    """
    Converts a list of content text strings into a TF-IDF matrix.

    Returns:
    - tfidf_matrix: numerical representation of content
    - vectorizer: fitted TF-IDF vectorizer (needed later)
    """

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5000
    )

    tfidf_matrix = vectorizer.fit_transform(content_texts)

    return tfidf_matrix, vectorizer
