from django.db import models
from django.db.models import Q
from django.db.models.query import QuerySet
from cloudinary.models import CloudinaryField
from django.db import models
from abc import ABCMeta,ABC, abstractmethod
from django.utils.text import slugify
from unidecode import unidecode 
from django.db.models.signals import post_save
from django.dispatch import receiver

#don't forget to specity app path. For example:
#python manage.py makemigrations app
#python manage.py migrate app

class Slug(models.Model):
    slug = models.CharField(max_length=110,null=True, blank=True)
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(unidecode(self.name))
            return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)
    class Meta:
        abstract = True
    
class Category(Slug):
    name = models.CharField(max_length=100, default=None)
    slug = models.CharField(max_length=110,null=True, blank=True)
    image = CloudinaryField('image', null=True,blank=True)
    
    def __str__(self):
        return self.name

class Item(models.Model):
    name = models.CharField(max_length=200,default=None,null=True,blank=True)            
    price = models.DecimalField(max_digits=10, decimal_places=3,default=0,null=True,blank=True)
    def __str__(self):
        return self.name if self.name else "no name"
    
    @property
    def get_cost(self):
        return self.price
    
    def set_cost(self, price):
        self.price = price
        self.save()
    
    def get_Description(self):
        return self.name
        
    class Meta:
        abstract = True    

class GameImage(models.Model):
    game = models.ForeignKey('Game', null=True, blank=True,related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('images')

    def __str__(self):
        return f"{self.game.name} image" if self.game else self.image
    
class GameVideo(models.Model):
    game = game = models.ForeignKey('Game', null=True, blank=True,related_name='videos', on_delete=models.CASCADE)
    video = CloudinaryField(resource_type='video')

    def __str__(self):
        return f"{self.game.name} video" if self.game else self.video 
    
class Game(Item,Slug):
    video = CloudinaryField(resource_type='video', null=True,blank=True)
    overview_description = models.TextField(null=True, blank=True)
    detail_description = models.TextField(null=True, blank=True)
    hero = CloudinaryField(null=True,blank=True)
    background = CloudinaryField(null=True,blank=True)
    image = CloudinaryField('image', null=True,blank=True)
    cover = CloudinaryField('cover', null=True,blank=True)
    category = models.ManyToManyField(Category,blank=True)
    year = models.DateField(null=True,blank=True)
    sell_number = models.BigIntegerField(null=True, blank=True, default=0)
    
    os_min = models.CharField(max_length=50, verbose_name='Minimum OS', null=True, blank=True)
    os_rec = models.CharField(max_length=50, verbose_name='Recommended OS', null=True, blank=True)
    processor_min = models.CharField(max_length=100, verbose_name='Minimum Processor', null=True, blank=True)
    processor_rec = models.CharField(max_length=100, verbose_name='Recommended Processor', null=True, blank=True)
    memory_min = models.CharField(max_length=20, verbose_name='Minimum Memory', null=True, blank=True)
    memory_rec = models.CharField(max_length=20, verbose_name='Recommended Memory', null=True, blank=True)
    storage_min = models.CharField(max_length=50, verbose_name='Minimum Storage', null=True, blank=True)
    storage_rec = models.CharField(max_length=50, verbose_name='Recommended Storage', null=True, blank=True)
    directx_min = models.CharField(max_length=10, verbose_name='Minimum DirectX', null=True, blank=True)
    directx_rec = models.CharField(max_length=10, verbose_name='Recommended DirectX', null=True, blank=True)
    graphics_min = models.CharField(max_length=100, verbose_name='Minimum Graphics', null=True, blank=True)
    graphics_rec = models.CharField(max_length=100, verbose_name='Recommended Graphics', null=True, blank=True)

    def get_categories(self):
        return [[category.name,category.id] for category in self.category.all()]

    
class DLC(Item,Slug):
    game = models.ForeignKey(Game, on_delete=models.CASCADE,null=True,blank=True, related_name='dlcs')
    overview_description = models.TextField(null=True, blank=True)
    detail_description = models.TextField(null=True, blank=True)
    image = CloudinaryField('image', null=True,blank=True)
    cover = CloudinaryField('cover', null=True,blank=True)
    category = models.ManyToManyField(Category,null=True,blank=True)
    year = models.DateField(null=True,blank=True)
    
    os_min = models.CharField(max_length=50, verbose_name='Minimum OS', null=True, blank=True)
    os_rec = models.CharField(max_length=50, verbose_name='Recommended OS', null=True, blank=True)
    processor_min = models.CharField(max_length=100, verbose_name='Minimum Processor', null=True, blank=True)
    processor_rec = models.CharField(max_length=100, verbose_name='Recommended Processor', null=True, blank=True)
    memory_min = models.CharField(max_length=20, verbose_name='Minimum Memory', null=True, blank=True)
    memory_rec = models.CharField(max_length=20, verbose_name='Recommended Memory', null=True, blank=True)
    storage_min = models.CharField(max_length=50, verbose_name='Minimum Storage', null=True, blank=True)
    storage_rec = models.CharField(max_length=50, verbose_name='Recommended Storage', null=True, blank=True)
    directx_min = models.CharField(max_length=10, verbose_name='Minimum DirectX', null=True, blank=True)
    directx_rec = models.CharField(max_length=10, verbose_name='Recommended DirectX', null=True, blank=True)
    graphics_min = models.CharField(max_length=100, verbose_name='Minimum Graphics', null=True, blank=True)
    graphics_rec = models.CharField(max_length=100, verbose_name='Recommended Graphics', null=True, blank=True)

class SpecialEditionGame(Item,Slug):
    base_game = models.ForeignKey(Game,on_delete=models.CASCADE,null=True,blank=True, related_name='base')
    dlcs = models.ManyToManyField(DLC,blank=True)


class DecoratorManager(models.Manager):
    def create(self, game, **kwargs):
        kwargs.setdefault('name', game.get_Description())
        kwargs.setdefault('price', game.get_cost())
        
        decorator_instance = super().create(game=game, **kwargs)
        return decorator_instance

class ProductDecorator(Item):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, default=None,related_name='game')
    dlcs = models.ManyToManyField(DLC, blank=True,related_name='dlcs')
    
    objects = DecoratorManager()   
    
    def add_dlc(self, dlc):
        self.dlcs.add(dlc)
        new_cost = self.price + dlc.get_cost()
        self.set_cost(new_cost)
        self.save()
    def delete_dlc(self,dlc):
        self.dlcs.remove(dlc)
        new_cost = self.price - dlc.get_cost()
        self.set_cost(new_cost)
        self.save()
        
# @receiver(post_save, sender=ProductDecorator)
# def update_when_add_or_delete_product(sender,instance,*args,**kwargs):
#     cart_item = CartItem.objects.get(product=instance)
#     cart_item.save()
        
    # #@property
    # def get_cost(self):
    #     base_cost = self.game.price
    #     dlcs_cost = sum(dlc.get_cost() for dlc in self.dlcs.all())
    #     new_cost = base_cost + dlcs_cost
    #     self.set_cost(new_cost)
    #     return new_cost
    
 


"""
This structure follows the decorator pattern, allowing you to dynamically add responsibilities (toppings and sizes) to objects (beverages) 
without modifying their code directly. It adheres to the principles of composition and separation of concerns
"""
from typing import List

class AbstractComponent(ABC):
    @abstractmethod
    def get_price(self, item) -> float:
        pass
    def get_name(self) -> str:
        pass
    def get_dlcs(self):
        pass
    def get_cover(self):
        pass
    
class ConcreteComponent(AbstractComponent):
    def __init__(self, item) -> None:
        self.item = item
        self.dlcs: List[DLC] = []
    def get_price(self) -> float:
        return self.item.get_cost
    def get_name(self):
        return self.item.name
    def get_cover(self):
        return self.item.cover
    def get_dlcs(self):
        return self.dlcs
    def add_dlc(self,dlc):
        self.dlcs.append(dlc)
    
class AbstractDecorator(AbstractComponent):
    def __init__(self, decorated: AbstractComponent, item: AbstractComponent) -> None:
        self.decorated = decorated
        self.item = item
        self.decorated.add_dlc(item)
        
class DLCDecorator(AbstractDecorator):
    def get_price(self) -> float:
        base_price = self.decorated.get_price()
        new_price = self.item.get_cost + base_price
        return new_price
    def get_name(self) -> str:
        return self.decorated.get_name()
    def get_cover(self):
        return self.decorated.get_cover()
    def get_dlcs(self):
        return self.decorated.get_dlcs()
    def add_dlc(self,dlc):
        self.decorated.add_dlc(dlc)

