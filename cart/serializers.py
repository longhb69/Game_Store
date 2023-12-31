from rest_framework import serializers
from .models import *
from product.models import ProductDecorator,SpecialEditionGame,DLC
from product.serializers import ProductDecoratorSerializer,SpecialEditionGameSerializer,DLCSerializer,GameSerializer

class CartItemSerializer(serializers.ModelSerializer):
    #product = serializers.SerializerMethodField(allow_null=True)
    cover = serializers.SerializerMethodField()
    dlcs = DLCSerializer(many=True)
    class Meta:
        model = CartItem
        fields = [
            'id',
            'type',
            'name',
            'slug',
            'price',
            'cover',
            'dlcs',
        ]
    def get_cover(self,instance):
        return instance.cover.url if instance.cover else None
    # def get_product(self,instance):
    #     if isinstance(instance.product,ProductDecorator):
    #         return ProductDecoratorSerializer(instance.product).data
    #     elif isinstance(instance.product,SpecialEditionGame):
    #         return SpecialEditionGameSerializer(instance.product).data
    #     elif isinstance(instance.product,DLC):
    #         return DLCSerializer(instance.product).data
    #     elif isinstance(instance.product,Game):
    #         return GameSerializer(instance.product).data

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, source='cart_items') 
    class Meta:
        model = Cart
        fields = [
            'pk',
            'user',
            'ordered',
            'items',
            'total_price',
        ]


