# content/services/domain_classifier.py

def detect_interest_domain(query: str) -> str:
    q = query.lower()

    if any(word in q for word in ["machine learning", "ai", "programming", "coding", "computer"]):
        return "Computer Science"

    if any(word in q for word in ["business", "management", "marketing", "finance", "startup"]):
        return "Business"

    if any(word in q for word in ["engineering", "mechanical", "electrical", "civil"]):
        return "Engineering"

    if any(word in q for word in ["medical", "health", "medicine", "disease"]):
        return "Medical"

    if any(word in q for word in ["law", "legal", "constitution", "rights"]):
        return "Law"

    if any(word in q for word in ["agriculture", "farming", "crop", "soil"]):
        return "Agriculture"

    if any(word in q for word in ["science", "physics", "chemistry", "biology"]):
        return "Science"

    if any(word in q for word in ["technology", "gadgets", "software", "hardware"]):
        return "Technology"

    if any(word in q for word in ["art", "design", "music", "history", "literature"]):
        return "Arts"

    return "Others"
