from django.contrib.auth.models import User  # Add this import statement

from rest_framework import serializers
from .models import TeamMember

class TeamMemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = TeamMember
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'role', 'username', 'email', 'avatar_url']

    def create(self, validated_data):
        # Create a new user and associate it with the team member
        user_data = validated_data.pop('user', None)
        user = None
        if user_data:
            user = User.objects.create_user(**user_data)  # Fix the NameError here
        team_member = TeamMember.objects.create(user=user, **validated_data)
        return team_member

    def update(self, instance, validated_data):
        # Update both team member and user data if provided
        user_data = validated_data.pop('user', {})
        if user_data:
            username = user_data.get('username', instance.user.username)
            email = user_data.get('email', instance.user.email)
            instance.user.username = username
            instance.user.email = email
            instance.user.save()

        # Update team member fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.role = validated_data.get('role', instance.role)
        instance.avatar_url = validated_data.get('avatar_url', instance.avatar_url)
        instance.save()
        return instance
