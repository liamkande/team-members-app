from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import TeamMember
from .serializers import TeamMemberSerializer
import json

class TeamMemberAPIViewTests(TestCase):
    def setUp(self):
        # Create a user and obtain an authentication token
        self.user = User.objects.create_user(username='test_user', email='test@example.com', password='test_password')
        self.token = Token.objects.create(user=self.user)

        # Create some test data
        self.member1 = TeamMember.objects.create(first_name='John', last_name='Doe', phone_number='1234567890', role='Developer', user=self.user)
        self.member2 = TeamMember.objects.create(first_name='Jane', last_name='Doe', phone_number='9876543210', role='Designer', user=self.user)

    def test_list_create_api_view(self):
        client = APIClient()
        # Set the authentication token in the request headers
        client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        response = client.get('/api/team-members/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2) # Check that the response contains the two test team members

        # Test creating a new team member
        data = {
            'first_name': 'Alice',
            'last_name': 'Smith',
            'phone_number': '1234567890',
            'role': 'Manager',
            'user': json.dumps({'username': 'alice', 'email': 'alice@example.com', 'password': 'test_password'})  # Serialize user data to JSON
        }
        response = client.post('/api/team-members/', data, format='json')  # Specify format as JSON
        self.assertEqual(response.status_code, 201)

        # Check that the new team member was created
        self.assertEqual(TeamMember.objects.count(), 3)
        new_member = TeamMember.objects.get(first_name='Alice')
        self.assertEqual(new_member.last_name, 'Smith')

    def test_retrieve_update_destroy_api_view(self):
        client = APIClient()
        # Set the authentication token in the request headers
        client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

        # Test retrieving a specific team member
        response = client.get('/api/team-members/{}/'.format(self.member1.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['first_name'], 'John')

        # Test updating a team member
        updated_data = {
            'first_name': 'Updated John',
            'last_name': 'Updated Doe',
            'phone_number': '5555555555',
            'role': 'Updated Role'
        }
        response = client.put('/api/team-members/{}/'.format(self.member1.id), updated_data, format='json')  # Specify format as JSON
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['first_name'], 'Updated John')

        # Test deleting a team member
        response = client.delete('/api/team-members/{}/'.format(self.member1.id))
        self.assertEqual(response.status_code, 204)  # 204 indicates successful deletion
