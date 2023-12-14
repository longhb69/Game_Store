from django.db import models
from django.contrib.auth.models import User
from product.models import ProductDecorator
from django.dispatch import receiver
from django.db.models.signals import post_save,pre_save

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    items = models.ManyToManyField(ProductDecorator, through="CartItem", related_name='items')
    total_price = models.DecimalField(max_digits=10, decimal_places=3,default=0)
    
    def __str__(self):
        return f"{self.user.username} cart"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductDecorator, on_delete=models.CASCADE)
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
    product_price = ProductDecorator.objects.get(id=instance.product.id).price
    instance.price = product_price

@receiver(post_save, sender=CartItem)
def add_price_cart_item(sender, instance, created, *args,**kwargs):
    cart = Cart.objects.get(id=instance.cart.id)
    if created:
        total_price = sum(cart_item.price for cart_item in cart.items.all())
        cart.total_price = total_price 
        cart.save()
    else:
        total_price = sum(cart_item.price for cart_item in cart.items.all())
        cart.total_price = total_price 
        cart.save()
    
    
    

    


# In a Django model, the Command Pattern might not be implemented explicitly in the same way as in a general Python application. However, you can structure your Django models and views in a way that follows similar principles. 
# Django itself uses an MVC (Model-View-Controller) architecture, 
# and you can leverage this architecture to create a separation of concerns similar to the Command Pattern.