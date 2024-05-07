from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomAuthToken, TeamMemberListCreateAPIView, TeamMemberRetrieveUpdateDestroyAPIView

urlpatterns = [
    # Existing token endpoints
    path('token/', CustomAuthToken.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Existing team members endpoints
    path('team-members/', TeamMemberListCreateAPIView.as_view(), name='team-member-list-create'),
    path('team-members/<int:pk>/', TeamMemberRetrieveUpdateDestroyAPIView.as_view(), name='team-member-detail'),
]
