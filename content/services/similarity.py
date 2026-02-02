from sklearn.metrics.pairwise import cosine_similarity


def compute_similarity(user_vector, content_matrix):
    """
    Computes cosine similarity between:
    - user profile vector
    - all content vectors

    Returns:
    similarity_scores → list of floats
    """

    if user_vector is None or content_matrix.shape[0] == 0:
        return []

    similarities = cosine_similarity(user_vector, content_matrix)
    return similarities[0]
