def detect_interest_domain(query: str) -> str:
    q = query.lower()

    if any(word in q for word in ["ai", "artificial intelligence", "chatgpt", "gpt"]):
        return "Artificial Intelligence"

    if any(word in q for word in ["machine learning", "ml", "deep learning", "neural network"]):
        return "Machine Learning"

    if any(word in q for word in ["data science", "data analysis", "pandas", "numpy"]):
        return "Data Science"

    if any(word in q for word in ["web", "html", "css", "javascript", "react", "django"]):
        return "Web Development"

    if any(word in q for word in ["mobile", "android", "ios", "flutter", "react native"]):
        return "Mobile Development"

    if any(word in q for word in ["security", "hacking", "cyber", "encryption", "firewall"]):
        return "Cybersecurity"

    if any(word in q for word in ["cloud", "aws", "azure", "google cloud", "docker"]):
        return "Cloud Computing"

    if any(word in q for word in ["software", "engineering", "design pattern", "architecture"]):
        return "Software Engineering"

    if any(word in q for word in ["database", "sql", "mysql", "postgresql", "mongodb"]):
        return "Database Systems"

    if any(word in q for word in ["network", "tcp", "ip", "protocol", "router"]):
        return "Computer Networks"

    if any(word in q for word in ["python", "java", "c++", "coding", "programming", "algorithm"]):
        return "Programming"

    if any(word in q for word in ["devops", "ci/cd", "kubernetes", "jenkins", "git"]):
        return "DevOps"

    if any(word in q for word in ["blockchain", "crypto", "bitcoin", "ethereum", "web3"]):
        return "Blockchain"

    if any(word in q for word in ["iot", "internet of things", "raspberry", "arduino", "sensor"]):
        return "Internet of Things"

    # ✅ Default
    return "Computer Science"