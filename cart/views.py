from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from product.serializers import ProductDecoratorSerializer

class CartView(APIView):
    def get(self, request):
        user = User.objects.get(username="long1")
        cart = Cart.objects.get(user=user)
        qs = CartItem.objects.filter(cart=cart)
        serializer = CartSerializer(cart, many=False).data
        #test = ProductDecorator.objects.get(name="Cyberpunk 2077")
        #serializer = ProductDecoratorSerializer(test, many=False).data
        return Response(serializer)
