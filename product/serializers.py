from rest_framework import serializers
from .models import Category,Game,DLC,SpecialEditionGame,ProductDecorator,GameImage, GameVideo, Developer, Publisher, Comment

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'image',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None

class GameSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    background = serializers.SerializerMethodField(read_only=True)
    hero = serializers.SerializerMethodField(read_only=True)
    price = serializers.SerializerMethodField()
    cover = serializers.SerializerMethodField(read_only=True)
    cover12x12 = serializers.SerializerMethodField(read_only=True)
    logo = serializers.SerializerMethodField(read_only=True)
    category = CategorySerializer(many=True,read_only=True)
    class Meta:
        model = Game
        fields = [
            'id',
            'name',
            'slug',
            'price',
            'image',
            'background',
            'hero',
            'cover',
            'cover12x12',
            'logo',
            'year',
            'overview_description',
            'category',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_cover(self, instance):
        return instance.cover.url if instance.cover else None
    def get_cover12x12(self, instance):
        return instance.cover12x12.url if instance.cover12x12 else None
    def get_logo(self, instance):
        return instance.logo.url if instance.logo else None
    def get_background(self, instance):
        return instance.background.url if instance.background else None
    def get_hero(self, instance):
        return instance.hero.url if instance.hero else None
    def get_price(self,instance):
        formatted_number = f'{instance.price:,.3f}'.replace(".",",")
        return formatted_number
    
    
class DeveloperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Developer
        fields = '__all__'
class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'

class DLCSerializer(serializers.ModelSerializer):
    cover = serializers.SerializerMethodField(read_only=True)
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    class Meta:
        model = DLC
        fields = [
            'id',
            'name',
            'cover',
            'image',
            'price',
            'slug',
            'overview_description',
        ]
    def get_cover(self, instance):
        if hasattr(instance, 'cover'):
            return instance.cover.url if instance.cover else None
        elif instance.exists():
            return instance[0].cover.url if instance[0].cover else None
        else:            
            return None
    def get_image(self,instance):
        return instance.image.url if instance.image else None
    def get_price(self,instance):
        formatted_number = f'{instance.price:,.3f}'.replace(".",",")
        return formatted_number

class SpecialEditionGameSerializer(serializers.ModelSerializer):
    cover = serializers.SerializerMethodField(read_only=True)
    base_game = serializers.SerializerMethodField()
    base_game_id =serializers.SerializerMethodField()
    class Meta:
        model = SpecialEditionGame
        fields = [
            'id',
            'name',
            'base_game',
            'base_game_id',
            'cover',
            'price',
            'slug',
        ]
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_cover(self, instance):
        if hasattr(instance, 'cover'):
            return instance.cover.url if instance.cover else None
        # elif instance.exists():
        #     return instance[0].cover.url if instance[0].cover else None
        else:            
            return None
    def get_base_game(self, instance):
        return instance.base_game.get_Description()
    def get_base_game_id(self, instance):
        return instance.base_game.id
    
class GameImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = GameImage
        fields = [
            'id',
            'image'
        ]
    def get_image(self, instance):
        return instance.image.url
    
class GameVideoSerializer(serializers.ModelSerializer):
    video = serializers.SerializerMethodField()
    class Meta:
        model = GameVideo
        fields = [
            'id',
            'video'
        ]
    def get_video(self, instance):
        return instance.video.url

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = [
            'id',
            'text',
            'user',
            'recommended',
            'created_at',
        ]
    def get_user(self, instance):
       return instance.user.username
    def get_created_at(self, instance):
        return instance.created_at.strftime("%d %B %Y").lstrip('0')
        
class GameDetailSerializer(serializers.ModelSerializer):
    video =  serializers.SerializerMethodField(read_only=True)
    videos = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField(read_only=True)
    cover = serializers.SerializerMethodField(read_only=True)
    price = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()
    developer = DeveloperSerializer()
    publisher = PublisherSerializer()
    category = CategorySerializer(many=True,read_only=True)
    dlc = DLCSerializer(many=True, read_only=True, source='dlcs')
    special_edition = SpecialEditionGameSerializer(many=True, read_only=True, source='base')
    game_image = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    class Meta:
        model = Game
        fields = '__all__'
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_video(self, instance):
        return instance.video.url if instance.video else None
    def get_cover(self, instance):
        return instance.cover.url if instance.cover else None
    def get_game_image(self, instance):
        game_images = instance.images.all()
        return GameImageSerializer(game_images, many=True).data
    def get_videos(self, instance):
        game_videos = instance.videos.all()
        return GameVideoSerializer(game_videos, many=True).data
    def get_price(self,instance):
        formatted_number = f'{instance.price:,.3f}'.replace(".",",")
        return formatted_number
    def get_year(self, instance):
        formatted_date = instance.year.strftime("%m/%d/%Y")
        return formatted_date
    def get_comments(self, instance):
        commments = instance.comments.all()
        return CommentSerializer(commments, many=True).data
    
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
    image = serializers.SerializerMethodField(read_only=True)
    video =  serializers.SerializerMethodField(read_only=True)
    developer = DeveloperSerializer()
    publisher = PublisherSerializer()
    game_images = serializers.SerializerMethodField()
    category = CategorySerializer(many=True,read_only=True)
    cover = serializers.SerializerMethodField(read_only=True)
    year = serializers.SerializerMethodField()
    class Meta:
        model = DLC
        fields = '__all__'
    def get_image(self, instance):
        return instance.image.url if instance.image else None
    def get_detail(self, instance):
        game_serializers = GameMetaDetailsSerializer(instance.game)
        return game_serializers.data
    def get_cover(self, instance):
        return instance.cover.url if instance.cover else None
    def get_video(self, instance):
        return instance.video.url if instance.video else None
    def get_game_images(self, instance):
        game_images = instance.images.all()
        return GameImageSerializer(game_images, many=True).data
    def get_price(self,instance):
        formatted_number = f'{instance.price:,.3f}'.replace(".",",")
        return formatted_number
    def get_year(self, instance):
        formatted_date = instance.year.strftime("%m/%d/%Y")
        return formatted_date
    

class SpecialEditionGameDetailSerializer(serializers.ModelSerializer):
    dlcs = DLCSerializer(many=True, read_only=True)
    class Meta:
        model = SpecialEditionGame
        fields = [
            'id',
            'name',
            'slug',
            'price',
            'dlcs',
        ]
    
class ProductDecoratorSerializer(serializers.ModelSerializer):
    game = GameSerializer()
    dlc = DLCSerializer(many=True, read_only=True,source='dlcs')
    class Meta:
        model = ProductDecorator
        fields = [
            'id',
            'game',
            'dlc',
        ]
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        game_data = {
            key: representation['game'][key] for key in ['id', 'name', 'cover','slug', 'price', 'image'] 
        }
        transformed_representation = {
            'id': representation['id'],
            'game': {
                "id": game_data["id"],
                "name" : game_data["name"],
                'cover': game_data["cover"],
                "price": game_data["price"],
            },
            'dlc': representation['dlc']
        }
        return transformed_representation
    







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