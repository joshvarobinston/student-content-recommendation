# student_Reco/content/services/user_profile.py

from interests.models import UserInterest
from engagement.models import UserSearch, UserSave
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
        parts.append(build_content_text(s.content_item))

    combined_text = " ".join(parts)

    return combined_text
