from rest_framework import generics
from rest_framework.permissions import AllowAny  # Import AllowAny permission
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from .models import TeamMember
from .serializers import TeamMemberSerializer
from django.contrib.auth.models import User  # Import User model
from .serializers import TeamMemberSerializer

# Use TokenObtainPairView for token authentication
class CustomAuthToken(TokenObtainPairView):
    """
    Custom authentication token view.
    """
    pass

class TeamMemberListCreateAPIView(generics.ListCreateAPIView):
    """
    API endpoint for listing all team members and creating a new team member.

    GET:
    Returns a list of all team members.

    POST:
    Creates a new team member.
    Request Payload Example:
    {
        "first_name": "John",
        "last_name": "Doe",
        "phone_number": "1234567890",
        "role": "Developer",
        "avatar_url": "https://example.com/avatar.jpg",
        "user": {
            "username": "john_doe",
            "email": "john@example.com",
            "password": "password123"
        }
    }
    """
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Create a new team member.

        Required fields in the request data: 'first_name', 'last_name', 'phone_number', 'role', 'user'
        """
        return super().post(request, *args, **kwargs)

class TeamMemberRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for retrieving, updating, and deleting a team member.

    GET:
    Retrieve details of a specific team member.

    PUT:
    Update details of a specific team member.
    Request Payload Example:
    {
        "first_name": "Updated John",
        "last_name": "Updated Doe",
        "phone_number": "5555555555",
        "role": "Updated Role"
        "avatar_url": "https://example.com/avatar.jpg"
    }

    DELETE:
    Delete a specific team member.
    """
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]

    def put(self, request, *args, **kwargs):
        """
        Update details of a specific team member.
        """
        return super().put(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete a specific team member.
        """
        return super().delete(request, *args, **kwargs)