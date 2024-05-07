from django.db import models
from django.contrib.auth.models import User

class TeamMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # Add ForeignKey to User model
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(max_length=100)
    role = models.CharField(max_length=100)
    avatar_url = models.URLField(max_length=200, null=True, blank=True)

    def __str__(self):
      return self.user.username if self.user else "No user"
