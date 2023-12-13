from rest_framework import serializers
from rest_framework import reverse
from .models import Category,Game,DLC

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

class GameSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    category = CategorySerializer(many=True,read_only=True)
    class Meta:
        model = Game
        fields = [
            'pk',
            'name',
            'price',
            'image',
            'video',
            'category',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_video(self, instance):
        return instance.video.url if instance.video else None
    
class DLCSerializer(serializers.ModelSerializer):
    class Meta:
        model = DLC
        fields = [
            'name',
            'price',
            'slug',
        ]
    
class GameDetailSerializer(serializers.ModelSerializer):
    video =  serializers.SerializerMethodField(read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    category = CategorySerializer(many=True,read_only=True)
    dlc = DLCSerializer(many=True, read_only=True, source='dlcs')
    class Meta:
        model = Game
        fields = '__all__'
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_video(self, instance):
        return instance.video.url if instance.video else None
    
    def to_representation(self, instance):
        if isinstance(instance,DLC):
            return None
        return super().to_representation(instance)

class GameMetaDetailsSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True,read_only=True)
    class Meta:
        model = Game
        fields = [
            'category',
            'os_min',
            'os_rec',
            'processor_min',
            'processor_rec',
            'memory_min',
            'memory_rec',
            'storage_min',
            'storage_rec',
            'directx_min',
            'directx_rec',
            'graphics_min',
            'graphics_rec',
        ]
    
class DLCDetailSerializer(serializers.ModelSerializer):
    video =  serializers.SerializerMethodField(read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    detail = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = DLC
        fields = [
            'name',
            'price',
            'slug',
            'overview_description',
            'detail_description',
            'image',
            'video',
            'detail',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_video(self, instance):
        return instance.video.url if instance.video else None
    def get_detail(self, instance):
        game_serializers = GameMetaDetailsSerializer(instance.game)
        return game_serializers.data
        





# class DrinkSerializer(serializers.ModelSerializer):
#     image = serializers.SerializerMethodField(read_only=True)
#     sizes = SizeSerializer(many=True, read_only=True) 
#     class Meta:
#         model = Drink
#         fields = [
#             'pk',
#             'name',
#             'slug',
#             'price',
#             'image',
#             'description',
#             'sizes',
#         ]
#     def get_image(self, instance):
#         return instance.image.url if instance.image else None
# class ToppingSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Topping
#         fields = [
#             'pk',
#             'name',
#             'price',
#         ]