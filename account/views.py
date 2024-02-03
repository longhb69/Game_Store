from .serializers import UserSerializer, LibaryItemSerializer
from .models import Libary, LibaryItem
from product.models import Category
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
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 2


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

@permission_classes([IsAuthenticated])
class LibaryView(APIView):
    def get(self, request):
        user = request.user
        libary = Libary.objects.get(user=user)
        libary_items = LibaryItem.objects.filter(libary=libary)
        categories_dict = {}
        for item in libary_items:
            categories = item.product.category.all()
            for category in categories:
                if category.name in categories_dict:
                    categories_dict[category.name] += 1
                else:
                    categories_dict[category.name] = 1
        query = request.GET.get('q')
        if query:
            id_to_keep = []
            for item in libary_items:
                if query and query.lower() in item.product.name.lower():
                    id_to_keep.append(item.id)
            libary_items = libary_items.filter(id__in=id_to_keep)

        tag = request.GET.get('tag')
        if tag:
            new_tag = tag.split(",")
            ids_to_remove = []
            category_filter  = Category.objects.filter(name__in=new_tag)
            for item in libary_items:
                count = 0
                categories = item.product.category.all()
                for category in categories:
                    if category in category_filter:
                        count += 1
                if(count != category_filter.count()):
                    ids_to_remove.append(item.id)
            libary_items = libary_items.exclude(id__in=ids_to_remove)
                        
        serializer = LibaryItemSerializer(libary_items, many=True).data
        response_data = {
            'games' : serializer,
            'categories' : list(categories_dict.items())
        }
        return Response(response_data)

@permission_classes([IsAuthenticated])
class TransactionsView(APIView):
    pagination_class = StandardResultsSetPagination
    def get(self, request):
        paginator = self.pagination_class()
        user = request.user
        #user = User.objects.get(username='tu')
        order = Order.objects.filter(user=user)
        serializer = OrderSerializer(order, many=True).data
        result_page = paginator.paginate_queryset(order, request)
        serializer = OrderSerializer(result_page, many=True).data
        return paginator.get_paginated_response(serializer)

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
    

            
        