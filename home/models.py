from django.db import models
from abc import ABCMeta
import six

class Category(models.Model):
    name = models.CharField(max_length=200, default=None)
    

CATEGORY = {
    'Espresso Beverages' : 'Espresso Beverages',
    'Brewed Tea': 'Brewed Tea',
}

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


    
    