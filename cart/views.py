from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from product.models import ProductDecorator,DLC
from product.serializers import ProductDecoratorSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

class CartView(APIView):
    def get(self, request):
        user = User.objects.get(username="long1")
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart, many=False).data
        #test = ProductDecorator.objects.get(name="Cyberpunk 2077")
        #serializer = ProductDecoratorSerializer(test, many=False).data
        return Response(serializer)
    def delete(self, request, *args, **kwargs):
        item_pk = kwargs.get('item_pk')
        cart_item = CartItem.objects.get(pk=item_pk)
        cart_item.delete()
        return Response('item delete')
        

@api_view(["DELETE"])
def delete_dlc_in_cart(requset, *args, **kwargs):
    #cart_item = get_object_or_404(CartItem, pk=pk)
    delete_dlc = kwargs.get('delete_dlc')
    cart_pk = kwargs.get('cart_pk')
    item_pk = kwargs.get('item_pk')
    product_pk = kwargs.get('product_pk')
    dlc_pk = kwargs.get('dlc_pk')
    
    cart_item = CartItem.objects.get(pk=item_pk)
    cart = Cart.objects.get(pk=cart_pk)
    if delete_dlc:
        dlc = DLC.objects.get(pk=dlc_pk)
        product = ProductDecorator.objects.get(pk=product_pk)
        product.delete_dlc(dlc)
        cart_item.save()
    return Response(' ')