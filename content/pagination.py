# student_Reco/content/pagination.py

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from settings_app.models import UserSettings


class StandardResultsPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50

    def get_page_size(self, request):
        if self.page_size_query_param:
            query_page_size = request.query_params.get(self.page_size_query_param)
            if query_page_size:
                return self.get_page_size_from_query_param(request)

        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            settings_obj, _ = UserSettings.objects.get_or_create(user=user)
            return min(settings_obj.items_per_page, self.max_page_size)

        return self.page_size

    def get_page_size_from_query_param(self, request):
        try:
            page_size = int(request.query_params[self.page_size_query_param])
        except (KeyError, TypeError, ValueError):
            return self.page_size

        if page_size <= 0:
            return self.page_size

        return min(page_size, self.max_page_size)

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "total_pages": self.page.paginator.num_pages,
            "current_page": self.page.number,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })
    
    
