from interests.models import InterestDomain

domains = [
    'Computer Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Cloud Computing',
    'Software Engineering',
    'Database Systems',
    'Computer Networks',
    'Programming',
    'DevOps',
    'Blockchain',
    'Internet of Things',
]

for name in domains:
    InterestDomain.objects.get_or_create(name=name)

print(f"Done! {InterestDomain.objects.count()} domains created!")