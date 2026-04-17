# student_Reco/content/services/text_processing.py

def build_content_text(content_item):
    """
    Builds a single text string representing a content item.
    This text will be used for TF-IDF vectorization.
    """

    parts = []

    if content_item.title:
        parts.append(content_item.title)

    if content_item.description:
        parts.append(content_item.description)

    if hasattr(content_item, "interest_domain") and content_item.interest_domain:
        parts.append(str(content_item.interest_domain))

    content_tags = getattr(content_item, "content_tags", None)
    if content_tags is not None:
        parts.extend(
            content_tag.tag.name
            for content_tag in content_tags.select_related("tag").all()
        )

    combined_text = " ".join(parts)
    return combined_text
