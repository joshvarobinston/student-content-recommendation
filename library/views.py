# student_Reco/library/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import LibraryFolder, LibraryItem
from .serializers import LibraryFolderSerializer, LibraryItemSerializer
from content.models import ContentItem


# ✅ 1) CREATE FOLDER
class CreateFolderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LibraryFolderSerializer(data=request.data)
        if serializer.is_valid():
            folder = serializer.save(user=request.user)
            return Response(
                LibraryFolderSerializer(folder).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ 2) LIST USER FOLDERS
class ListFoldersAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        folders = LibraryFolder.objects.filter(user=request.user).order_by("-created_at")
        serializer = LibraryFolderSerializer(folders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ 3) DELETE FOLDER (only owner)
class DeleteFolderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, folder_id):
        try:
            folder = LibraryFolder.objects.get(id=folder_id, user=request.user)
        except LibraryFolder.DoesNotExist:
            return Response({"error": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

        folder.delete()
        return Response({"message": "Folder deleted"}, status=status.HTTP_200_OK)


# ✅ 4) ADD ITEM TO FOLDER (safe + no duplicates)
class AddItemToFolderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, folder_id):
        # folder must belong to the logged-in user
        try:
            folder = LibraryFolder.objects.get(id=folder_id, user=request.user)
        except LibraryFolder.DoesNotExist:
            return Response({"error": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

        content_id = request.data.get("content_item_id")
        if not content_id:
            return Response(
                {"error": "content_item_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            content_item = ContentItem.objects.get(id=content_id)
        except ContentItem.DoesNotExist:
            return Response({"error": "Content not found"}, status=status.HTTP_404_NOT_FOUND)

        obj, created = LibraryItem.objects.get_or_create(
            folder=folder,
            content_item=content_item
        )

        if not created:
            return Response(
                {"message": "Item already exists in folder"},
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "message": "Item added successfully",
                "item": LibraryItemSerializer(obj).data
            },
            status=status.HTTP_201_CREATED
        )


# ✅ 5) VIEW ITEMS INSIDE FOLDER (only owner can view)
class FolderItemsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, folder_id):
        try:
            folder = LibraryFolder.objects.get(id=folder_id, user=request.user)
        except LibraryFolder.DoesNotExist:
            return Response({"error": "Folder not found"}, status=status.HTTP_404_NOT_FOUND)

        items = LibraryItem.objects.filter(folder=folder).order_by("-added_at")
        serializer = LibraryItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ 6) REMOVE ITEM FROM FOLDER (only owner can remove)
class RemoveItemFromFolderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        try:
            item = LibraryItem.objects.get(id=item_id, folder__user=request.user)
        except LibraryItem.DoesNotExist:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        item.delete()
        return Response({"message": "Item removed"}, status=status.HTTP_200_OK)