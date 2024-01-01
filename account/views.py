from django.shortcuts import render
from .serializers import UserSerualizers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response

@permission_classes([IsAuthenticated])
class UserView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerualizers(user, many=False).data
        return Response(serializer)


