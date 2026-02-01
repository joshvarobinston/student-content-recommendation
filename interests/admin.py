# student_Reco/interests/admin.py

from django.contrib import admin
from .models import InterestDomain, UserInterest

admin.site.register(InterestDomain)
admin.site.register(UserInterest)
