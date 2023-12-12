from django.contrib import admin
from .models import Drink,Topping,Decorator,Category, Size

admin.site.register(Drink)
admin.site.register(Topping)
admin.site.register(Decorator)
admin.site.register(Category)
admin.site.register(Size)
