from django.contrib import admin
from .models import Category, Espresso, Drink,Topping, ToppedDrink
# Register your models here.
admin.site.register(Category)
admin.site.register(Drink)
admin.site.register(Topping)
admin.site.register(ToppedDrink)

