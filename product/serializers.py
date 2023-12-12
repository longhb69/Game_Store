from rest_framework import serializers
from rest_framework import reverse
from .models import Drink,Topping,Category,Size

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = [
            'pk',
            'size',
            'price'
        ]

class DrinkSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    sizes = SizeSerializer(many=True, read_only=True) 
    class Meta:
        model = Drink
        fields = [
            'pk',
            'name',
            'slug',
            'price',
            'image',
            'description',
            'sizes',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None

class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = [
            'pk',
            'name',
            'price',
        ]

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Category
        fields = [
            'pk',
            'name',
            'image',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None


