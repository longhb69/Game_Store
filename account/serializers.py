from rest_framework import serializers
from rest_framework import reverse
from .models import LibaryItem
from django.contrib.auth.models import User
from product.models import Game,DLC,SpecialEditionGame
from product.serializers import GameSerializer, DLCSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'pk',
            'username',
        ]

class LibaryItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField(allow_null=True)
    class Meta:
        model = LibaryItem
        fields = [
            'id',
            'product'
        ]
    def get_product(self, instance):
        if isinstance(instance.product, Game):
            return GameSerializer(instance.product).data
        elif isinstance(instance.product, DLC):
            return DLCSerializer(instance.product).data

