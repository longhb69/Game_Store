from .serializers import UserSerializer, LibaryItemSerializer
from .models import Libary, LibaryItem
from cart.models import Order
from cart.serializers import OrderSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User

@permission_classes([IsAuthenticated])
class UserView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, many=False).data
        return Response(serializer)

class GameInLibary(APIView):
    def get(self, request):
        user = request.user
        libary = get_object_or_404(Libary, user=user)
        libary_items = LibaryItem.objects.filter(libary=libary)
        games_name = [item.product.slug for item in libary_items]
        return Response({'items_name': games_name})

class LibaryView(APIView):
    def get(self, request):
        user = request.user
        libary = Libary.objects.get(user=user)
        libary_items = LibaryItem.objects.filter(libary=libary)
        serializer = LibaryItemSerializer(libary_items, many=True).data
        return Response(serializer)

class TransactionsView(APIView):
    def get(self, request):
        user = User.objects.get(username="long")
        order = Order.objects.filter(user=user)
        serializer = OrderSerializer(order, many=True).data
        return Response(serializer)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        #refresh = RefreshToken.for_user(user)
        #for login right after user signup
        # tokens = {
        #     'refresh': str(refresh),
        #     'access': str(refresh.access_token)
        # }
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

            
        