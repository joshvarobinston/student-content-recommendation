# student_Reco/content/services/recency.py

import math
from django.utils import timezone


def calculate_recency_score(content_item, decay_days=30):
    """
    Computes recency score using exponential time decay.

    recency_score = e ^ ( - age_in_days / decay_days )
    """

    if not content_item.published_date:
        return 0

    now = timezone.now()
    published_date = content_item.published_date
    
    if timezone.is_naive(published_date):
        published_date = timezone.make_aware(published_date)
        
    age_in_days = (now - published_date).days

    recency_score = math.exp(-age_in_days / decay_days)

    return round(recency_score, 4)
