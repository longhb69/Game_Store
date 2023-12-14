from rest_framework import serializers
from .models import *
from product.serializers import ProductDecoratorSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductDecoratorSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = [
            'pk',
            'product',
        ]

class CartSerializer(serializers.ModelSerializer):
    cart_items = ProductDecoratorSerializer(many=True,source='items')
    class Meta:
        model = Cart
        fields = [
            'user',
            'ordered',
            'cart_items',
            'total_price',
        ]

