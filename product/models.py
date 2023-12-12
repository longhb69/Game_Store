from django.db import models
from cloudinary.models import CloudinaryField
from django.db import models
from abc import ABCMeta,ABC, abstractmethod
from django.utils.text import slugify
from unidecode import unidecode 

#import six

#don't forget to specity app path. For example:
#python manage.py makemigrations app
#python manage.py migrate app

class Category(models.Model):
    name = models.CharField(max_length=100, default=None)
    image = CloudinaryField('image', null=True, blank=True)
    slug = models.CharField(max_length=110,null=True, blank=True)
    
    def __str__(self):
        return self.name
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(unidecode(self.name))
            return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)

class Item(models.Model):
    name = models.CharField(max_length=200,default=None,null=True,blank=True)            
    price = models.DecimalField(max_digits=5, decimal_places=2,default=0,null=True,blank=True)
    slug = models.CharField(max_length=110,null=True, blank=True)
    
    
    def __str__(self):
        return self.name
    
    def get_cost(self):
        return self.price
    
    def set_cost(self, price):
        self.price = price
        self.save()
    
    def get_Description(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(unidecode(self.name))
            return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)
        
    class Meta:
        abstract = True

class Size(models.Model):
    class SizeChoice(models.TextChoices):
        SMALL = 'Small'
        MEDIUM = 'Medium'
        LARGE = 'Large'
    size = models.CharField(max_length=6,choices=SizeChoice)
    price = models.DecimalField(max_digits=8, decimal_places=3, default=0)
    
    def __str__(self):
        return self.size + "-" + str(self.price)
    
class Drink(Item):
    description = models.CharField(max_length=500,null=True,blank=True)
    image = CloudinaryField('iamge', null=True,blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True,blank=True)
    sizes = models.ManyToManyField(Size)
    
class Topping(Item):
    pass    
    
class DecoratorManager(models.Manager):
    def create(self, beverage, **kwargs):
        kwargs.setdefault('name', beverage.get_Description())
        kwargs.setdefault('price', beverage.get_cost())
        
        decorator_instance = super().create(beverage=beverage, **kwargs)
        return decorator_instance

class Decorator(Item):
    beverage = models.ForeignKey(Drink, on_delete=models.CASCADE, default=None)
    toppings = models.ManyToManyField(Topping, blank=True)
    size = models.ForeignKey(Size, blank=True, default=None, on_delete=models.SET_DEFAULT, null=True)
    
    objects = DecoratorManager()
    
    def add_topping(self, topping):
        self.toppings.add(topping)
        self.save()
        
    #@property
    def get_cost(self):
        base_cost = self.beverage.price
        topping_cost = sum(topping.get_cost() for topping in self.toppings.all())
        size_cost = self.size.price if self.size else 0 
        new_cost = base_cost + topping_cost + size_cost
        self.set_cost(new_cost)
        return new_cost


"""
This structure follows the decorator pattern, allowing you to dynamically add responsibilities (toppings and sizes) to objects (beverages) 
without modifying their code directly. It adheres to the principles of composition and separation of concerns
"""