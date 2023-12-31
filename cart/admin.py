from django.contrib import admin
from .models import *
# Register your models here.
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'id']
class CartAdmin(admin.ModelAdmin):
    list_display = ['__str__', id]

admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem,OrderItemAdmin)