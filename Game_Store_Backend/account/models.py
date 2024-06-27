from django.db import models
from django.contrib.auth.models import User
from cart.models import Order
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.db.models.signals import post_save,pre_save,post_delete
from django.dispatch import receiver
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from product.models import Game,DLC
from cloudinary.models import CloudinaryField


class Libary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True,null=True)
    
    def __str__(self):
        return self.user.username + ' libary'
    
    def add_libary_item(self, order, product):
        content_object = None
        if(product.content_type == ContentType.objects.get_for_model(Game)):
            content_object = ContentType.objects.get_for_model(Game)
        elif(product.content_type == ContentType.objects.get_for_model(DLC)):
            content_object = ContentType.objects.get_for_model(DLC)
        libary_item = LibaryItem.objects.create(
            libary=self,
            order = order,
            content_type = content_object,
            object_id = product.object_id
        )
    
class LibaryItem(models.Model):
    libary =  models.ForeignKey(Libary, on_delete=models.CASCADE,blank=True,null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE,blank=True,null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    
    def __str__(self):
        return f"{self.product} in {self.libary.user.username}'s library"

@receiver(post_save, sender=User)
def create_user_libary(sender, instance, created, *args,**kwargs):
    if created and not Libary.objects.filter(user=instance).exists():
        Libary.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_user_wishlist(sender, instance, created, *args, **kwargs):
    if created and not WishList.objects.filter(user=instance).exists():
        WishList.objects.create(user=instance)


class Avatar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = CloudinaryField('avatar', null=True,blank=True)

    def __str__(self):
        return f"Avatar of {self.user.username}"
    
    
class WishList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username + ' wishlist'
    
    def add_wishlist_item(self, product):
        content_object = None
        if(isinstance(product, Game)):
            content_object = ContentType.objects.get_for_model(Game)
        elif(isinstance(product, DLC)):
            content_object = ContentType.objects.get_for_model(DLC)

        wishlist_item = WishListItem.objects.create(
            wishlist=self,
            content_type = content_object,
            object_id = product.id
        )

class WishListItemManager(models.Manager):
    def get_product(self, product):
        content_type = ContentType.objects.get_for_model(product)
        return self.filter(content_type=content_type, object_id=product.pk)

class WishListItem(models.Model):
    wishlist = models.ForeignKey(WishList, on_delete=models.CASCADE, related_name="wishlist_items")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')

    def __str__(self) -> str:
        return f"{self.product} in {self.wishlist}"
    
    @classmethod
    def filter_by_product(cls, product):
        content_type = ContentType.objects.get_for_model(product)
        return cls.objects.filter(content_type=content_type, object_id=product.pk)


    

    
  