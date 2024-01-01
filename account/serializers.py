from rest_framework import serializers
from rest_framework import reverse
from django.contrib.auth.models import User

class UserSerualizers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'pk',
            'username',
        ]
