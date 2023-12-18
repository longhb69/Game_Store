from django.db import models
from django.contrib.auth.models import User
from cart.models import Order


class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    address = models.CharField(max_length=200,blank=True,null=True)
    city = models.CharField(max_length=200,blank=True,null=True)
    province = models.CharField(max_length=200,blank=True,null=True)
    
    def __str__(self):
        return self.address
