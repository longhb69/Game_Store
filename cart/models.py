from django.db import models
from django.contrib.auth.models import User
from product.models import ProductDecorator,SpecialEditionGame
from django.dispatch import receiver
from django.db.models.signals import post_save,pre_save,post_delete
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


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
            instance.price = product.price
        if isinstance(product, SpecialEditionGame):
            instance.price = product.price

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
    
    
    

    


# In a Django model, the Command Pattern might not be implemented explicitly in the same way as in a general Python application. However, you can structure your Django models and views in a way that follows similar principles. 
# Django itself uses an MVC (Model-View-Controller) architecture, 
# and you can leverage this architecture to create a separation of concerns similar to the Command Pattern.