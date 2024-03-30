from django.contrib import admin
from .models import *

class OrderAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'transaction_id']
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'id']
class CartAdmin(admin.ModelAdmin):
    list_display = ['__str__', id]


admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem,OrderItemAdmin)