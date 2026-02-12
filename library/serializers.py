# student_reco/library/serializers.py

from rest_framework import serializers
from .models import LibraryFolder, LibraryItem
from content.serializers import ContentItemSerializer


class LibraryFolderSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and listing user folders
    """

    class Meta:
        model = LibraryFolder
        fields = ["id", "name", "description", "created_at"]
        read_only_fields = ["id", "created_at"]


class LibraryItemSerializer(serializers.ModelSerializer):
    """
    Serializer for items inside a folder
    """

    content_item = ContentItemSerializer(read_only=True)

    class Meta:
        model = LibraryItem
        fields = ["id", "content_item", "added_at"]
        read_only_fields = ["id", "added_at"]
