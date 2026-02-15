from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        # Support both 'username' and 'email' parameters
        login_id = username or email
        if login_id is None:
            return None
            
        try:
            # Look for user by email
            user = User.objects.get(email=login_id)
        except User.DoesNotExist:
            # Fallback to username if email lookup fails
            try:
                user = User.objects.get(username=login_id)
            except User.DoesNotExist:
                return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
