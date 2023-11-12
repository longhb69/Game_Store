from django.db import models
from abc import ABCMeta
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

class Drink(models.Model):
    name = models.CharField(max_length=200,default=None,null=True)
    description = models.CharField(max_length=2000, default=None,null=True, blank=True)
    image = models.ImageField(upload_to="drinkimage",default=None,blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Topping(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.name

class ToppedDrink(models.Model):
    beverage = models.ForeignKey(Drink, on_delete=models.CASCADE, default=None)
    toppings = models.ManyToManyField(Topping, related_name="drinks", blank=True)

    def add_topping(self, topping):
        self.toppings.add(topping)
        self.save()

    def cost(self):
        # Calculate the total cost of the drink with added toppings
        base_cost = self.beverage.cost
        topping_cost = sum(topping.price for topping in self.toppings.all())
        return base_cost + topping_cost


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


    
    