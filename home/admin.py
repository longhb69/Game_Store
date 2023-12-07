from django.contrib import admin
from .models import Category, Espresso, Drink,Topping,Decorator



admin.site.register(Category)
admin.site.register(Drink)
admin.site.register(Topping)
admin.site.register(Decorator)

