# student_Reco/content/services/user_profile.py

from interests.models import UserInterest
from engagement.models import UserLike, UserSave, UserSearch, UserView
from content.services.text_processing import build_content_text


def build_user_profile_text(user):
    """
    Builds a single text string representing a user's interests and behavior.
    This text will be vectorized using the same TF-IDF model as content.
    """

    parts = []

    # 1. Interest domains (explicit preferences)
    interests = UserInterest.objects.filter(user=user)
    for ui in interests:
        parts.append(str(ui.interest))

    # 2. Search queries (explicit intent)
    searches = UserSearch.objects.filter(user=user)
    for s in searches:
        parts.append(s.query)

    # 3. Saved content (strong positive signal)
    saves = UserSave.objects.filter(user=user).select_related("content_item")
    for s in saves:
        parts.extend([build_content_text(s.content_item)] * 3)

    # 4. Liked content (positive signal)
    likes = UserLike.objects.filter(user=user).select_related("content_item")
    for like in likes:
        parts.extend([build_content_text(like.content_item)] * 2)

    # 5. Viewed content (lighter signal, boosted by watch time)
    views = UserView.objects.filter(user=user).select_related("content_item")
    for view in views:
        repetitions = 1
        if view.view_duration >= 120:
            repetitions = 2
        parts.extend([build_content_text(view.content_item)] * repetitions)

    combined_text = " ".join(parts)

    return combined_text
