from django.db import models
from django.contrib.auth.models import User
from product.models import ProductDecorator,SpecialEditionGame,DLC
from django.dispatch import receiver
from django.db.models.signals import post_save,pre_save,post_delete
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from typing import Protocol
from django.shortcuts import get_object_or_404


class Command(Protocol):
    def execute(self) -> None:
        ...

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    total_price = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    
    def __str__(self):
        return f"{self.user.username} cart"
        
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="cart_items")
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    price = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    quantity = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.cart} - {self.product}"
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True,null=True)
    date_orderd = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False, null=True,blank=True)
    transaction_id = models.CharField(max_length=200,null=True)
    
    def __str__(self):
        return str(self.user) + ' order'
    @property
    def get_order_total(self):
        orderitems = self.orderitem_set.all()
        for item in orderitems:
            print(item.product.get_cost)
        total = sum([item.get_total for item in orderitems])
        return total
    
    def add_item(self, item):
        cart_item = OrderItem(order=self,
                             content_type=ContentType.objects.get_for_model(item),
                             object_id=item.id)
        cart_item.save()
        
    #item is OrderItem
    def delete_item(self, item):
        content_type = ContentType.objects.get_for_model(item)
        product = OrderItem.objects.get(order=self,content_type=content_type, object_id=item.pk)
        product.delete()
    

class OrderItem(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL,blank=True,null=True)
    
    def __str__(self):
        return self.product.name
    @property
    def get_total(self):
        return self.product.get_cost

class CheckoutStep(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step_number = models.PositiveIntegerField()
    #payment details

    
    
@receiver(post_save, sender=User)
def create_user_cart(sender, instance, created, *args,**kwargs):
    if created:
        Cart.objects.create(user=instance)
        
@receiver(post_save, sender=User)
def save_user_cart(sender, instance, *args,**kwargs):
    instance.cart.save()

@receiver(pre_save, sender=CartItem)
def pre_save_cart_item(sender, instance, **kwargs):
    if instance.content_type is not None and instance.object_id is not None:
        product = instance.content_type.get_object_for_this_type(id=instance.object_id)
        if isinstance(product, ProductDecorator):
            instance.price = product.price + sum(dlc.get_cost for dlc in product.dlcs.all())
        if isinstance(product, SpecialEditionGame):
            instance.price = product.price
        if isinstance(product, DLC):
            instance.price = product.get_cost
    

@receiver(post_save, sender=CartItem)
def add_price_cart_item(sender, instance, created, *args,**kwargs):
    cart = Cart.objects.get(id=instance.cart.id)
    cart_items = CartItem.objects.filter(cart=cart)
    if created:
        total_price = sum(cart_item.price for cart_item in cart_items)
        cart.total_price = total_price 
        cart.save()
    else:
        total_price = sum(cart_item.price for cart_item in cart_items)
        cart.total_price = total_price 
        cart.save()
        
@receiver(post_delete, sender=CartItem)
def update_cart_total_price(sender, instance, **kwargs):
    cart = Cart.objects.get(id=instance.cart.id)
    cart_items = CartItem.objects.filter(cart=cart)
    total_price = sum(cart_item.price for cart_item in cart_items)
    cart.total_price = total_price 
    cart.save()








    