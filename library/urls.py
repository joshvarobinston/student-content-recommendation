# student_reco/library/urls.py

from django.urls import path
from .views import (
    CreateFolderAPIView,
    ListFoldersAPIView,
    DeleteFolderAPIView,
    AddItemToFolderAPIView,
    FolderItemsAPIView,
    RemoveItemFromFolderAPIView,
)

urlpatterns = [
    path("folders/create/", CreateFolderAPIView.as_view()),
    path("folders/", ListFoldersAPIView.as_view()),
    path("folders/<int:folder_id>/delete/", DeleteFolderAPIView.as_view()),
    path("folders/<int:folder_id>/items/", FolderItemsAPIView.as_view()),
    path('folders/<int:folder_id>/add-item/', AddItemToFolderAPIView.as_view()),
    path("items/<int:item_id>/delete/", RemoveItemFromFolderAPIView.as_view()),
]
