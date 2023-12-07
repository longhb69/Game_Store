from django.db import models
from abc import ABCMeta,ABC, abstractmethod
import six

#don't forget to specity app path. For example:
#python manage.py makemigrations app
#python manage.py migrate app

class Category(models.Model):
    name = models.CharField(max_length=200, default=None)
    

CATEGORY = {
    'Espresso Beverages' : 'Espresso Beverages',
    'Brewed Tea': 'Brewed Tea',
}

class Item(models.Model):
    description = models.CharField(max_length=200,default=None,null=True,blank=True)
    cost = models.DecimalField(max_digits=5, decimal_places=2,default=0,null=True,blank=True)
    
    
    def __str__(self):
        return self.description
    
    def get_cost(self):
        return self.cost
    
    def set_cost(self, cost):
        self.cost = cost
        self.save()
    
    def get_Description(self):
        return self.description
        
    class Meta:
        abstract = True

class Drink(Item):
    pass
class Topping(Item):
    pass

class DecoratorManager(models.Manager):
    def create(self, beverage, **kwargs):
        kwargs.setdefault('description', beverage.get_Description())
        kwargs.setdefault('cost', beverage.get_cost())
        
        decorator_instance = super().create(beverage=beverage, **kwargs)
        return decorator_instance

class Decorator(Item):
    beverage = models.ForeignKey(Drink, on_delete=models.CASCADE, default=None)
    toppings = models.ManyToManyField(Topping, blank=True)
    
    objects = DecoratorManager()
    
    def add_topping(self, topping):
        self.toppings.add(topping)
        self.save()
        
    #@property
    def get_cost(self):
        base_cost = self.beverage.cost
        topping_cost = sum(topping.get_cost() for topping in self.toppings.all())
        new_cost = base_cost + topping_cost
        self.set_cost(new_cost)
        return new_cost
    

# class ToppedDrink(models.Model): #replace models.Model with  Drink
#     beverage = models.ForeignKey(Drink, on_delete=models.CASCADE, default=None)
#     toppings = models.ManyToManyField(Topping, related_name="drinks", blank=True)

#     #@property ToppedDrink.add_topping = 'macha'
#     def add_topping(self, topping):
#         self.toppings.add(topping)
#         self.save()
        
#     @property
#     def cost(self):
#         # Calculate the total cost of the drink with added toppings
#         base_cost = self.beverage.cost
#         topping_cost = sum(topping.price for topping in self.toppings.all())
#         return base_cost + topping_cost



















@six.add_metaclass(ABCMeta)
class Beverage(object):
    description = ''
    category = ''
    
    def cost(self):
        pass
    def getDescription(self):
        return self.description
    def getCategory(self):
        return self.category
    
class Espresso(Beverage):
    def __init__(self):
        self.description = "Espresso" 
        self.category = CATEGORY['Espresso Beverages']
    def cost(self):
        return 1.99
    
class HouseBlend(Beverage):
    def __init__(self):
        self.description = "HouseBlend" 
        self.category = CATEGORY['Espresso Beverages']
    def cost(self):
        return .89

@six.add_metaclass(ABCMeta)
class CondimentDecorator(Beverage):
    def getDescription(self):
        pass

class Mocha(CondimentDecorator):
    id = 1
    def __init__(self, beverage):
        self.beverage = beverage
    def getDescription(self):
        return self.beverage.getDescription() + ", Mocha"
    def getCategory(self):
        return self.beverage.getCategory()
    def cost(self):
        return self.beverage.cost() +  .20
    
class Whip(CondimentDecorator):
    def __init__(self, beverage):
        self.beverage = beverage
    def getDescription(self):
        return self.beverage.getDescription() + ", Whip"
    def getCategory(self):
        return self.beverage.getCategory()
    def cost(self):
        return self.beverage.cost() +  .10

class Soy(CondimentDecorator):
    def __init__(self, beverage):
        self.beverage = beverage
    def getDescription(self):
        return self.beverage.getDescription() + ", Soy"
    def getCategory(self):
        return self.beverage.getCategory()
    def cost(self):
        return self.beverage.cost() +  .15

#research python list view 


    
    