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


class Libary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True,null=True)
    
    def __str__(self):
        return self.user.username + ' libary'
    
    def add_libary_item(self, order, product):
        libary_item = LibaryItem.objects.create(
            libary=self,
            order = order,
            content_type = ContentType.objects.get_for_model(product),
            object_id = product.id
        )
    
class LibaryItem(models.Model):
    libary =  models.ForeignKey(Libary, on_delete=models.CASCADE,blank=True,null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE,blank=True,null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField()
    product = GenericForeignKey('content_type', 'object_id')
    
    def __str__(self):
        return f"{self.product.name} in {self.libary.user.username}'s library"

@receiver(post_save, sender=User)
def create_user_libary(sender, instance, created, *args,**kwargs):
    if created and not Libary.objects.filter(user=instance).exists():
        Libary.objects.create(user=instance)



    
  