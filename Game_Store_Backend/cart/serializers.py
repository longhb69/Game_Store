from rest_framework import serializers
from .models import *
from product.models import SpecialEditionGame,DLC,Game
from product.serializers import SpecialEditionGameSerializer,DLCSerializer,GameSerializer

class CartItemSerializer(serializers.ModelSerializer):
    #product = serializers.SerializerMethodField(allow_null=True)
    cover = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    discount_percentage = serializers.SerializerMethodField()
    dlcs = DLCSerializer(many=True)
    class Meta:
        model = CartItem
        fields = [
            'id',
            'type',
            'name',
            'slug',
            'price',
            'discounted_price',
            'discount_percentage',
            'cover',
            'dlcs',
        ]
    def get_cover(self,instance):
        return instance.cover.url if instance.cover else None
    def get_price(self,instance):
        formatted_number = f'{instance.price:,.3f}'.replace(".",",")
        return formatted_number
    def get_discounted_price(self, instance):
        if instance.type == 'game':
            game = get_object_or_404(Game, slug=instance.slug)
            formatted_number = f'{game.discounted_price:,.3f}'.replace(".",",")
            return formatted_number
    def get_discount_percentage(self, instance):
        if instance.type == 'game':
            game = get_object_or_404(Game, slug=instance.slug)
            return game.discount_percentage
    
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
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = [
            'pk',
            'user',
            'ordered',
            'items',
            'total_price',
        ]
    def get_total_price(self,instance):
        formatted_number = f'{instance.total_price:,.3f}'.replace(".",",")
        return formatted_number

class OrderItemSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField(allow_null=True)
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'item'
        ]
    def get_item(self, instance):
            if isinstance(instance.product, Game):
                return GameSerializer(instance.product).data
            elif isinstance(instance.product, DLC):
                return DLCSerializer(instance.product).data

class OrderSerializer(serializers.ModelSerializer):
    order = serializers.SerializerMethodField()
    date_orderd = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = [
            'id',
            'date_orderd',
            'complete',
            'transaction_id',
            'order',
        ]
    def get_order(self, instance):
        order_items = OrderItem.objects.filter(order=instance)
        return OrderItemSerializer(order_items,many=True).data
    def get_date_orderd(self, instance):
        formatted_date = instance.date_orderd.strftime("%m/%d/%Y")
        return formatted_date
