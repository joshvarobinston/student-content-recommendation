# student_Reco/content/services/popularity.py

from engagement.models import UserView, UserLike, UserSave


def calculate_popularity_score(content_item):
    """
    Computes popularity score based on user engagement.
    Weights:
    - View  = 1
    - Like  = 3
    - Save  = 5
    """

    view_count = UserView.objects.filter(content_item=content_item).count()
    like_count = UserLike.objects.filter(content_item=content_item).count()
    save_count = UserSave.objects.filter(content_item=content_item).count()

    popularity_score = (
        view_count * 1 +
        like_count * 3 +
        save_count * 5
    )

    return popularity_score
