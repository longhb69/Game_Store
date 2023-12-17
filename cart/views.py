from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from product.models import ProductDecorator,DLC,SpecialEditionGame
from product.serializers import ProductDecoratorSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
import datetime
from django.http import JsonResponse
from django.contrib.contenttypes.models import ContentType



class CartView(APIView):
    def get(self, request):
        user = User.objects.get(username="long1")
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart, many=False).data
        #test = ProductDecorator.objects.get(name="Cyberpunk 2077")
        #serializer = ProductDecoratorSerializer(test, many=False).data
        return Response(serializer)
    
    #{"special": false,"game_id":1,"cart_id":2}
    def post(self, request, *args, **kwargs):
        special = request.data.get('special')
        dlc = request.data.get('dlc')
        game_id = request.data.get('game_id')
        cart_id = request.data.get('cart_id')
        
        cart = get_object_or_404(Cart,pk=cart_id)            
        if dlc: 
            cart_item_content_type = ContentType.objects.get_for_model(DLC)
        elif special:
            cart_item_content_type = ContentType.objects.get_for_model(SpecialEditionGame)
        else:
            cart_item_content_type = ContentType.objects.get_for_model(ProductDecorator)
        
        try:
            cart_item = CartItem.objects.create(cart=cart, 
                                                content_type=cart_item_content_type,
                                                object_id=game_id
                                                )
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        return JsonResponse({'message': 'CartItem created successfully'}, status=201)
        # serializer = CartItemSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # else:
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, *args, **kwargs):
        item_pk = kwargs.get('item_pk')
        cart_item = CartItem.objects.get(pk=item_pk)
        cart_item.delete()
        return Response('item delete')
        

@api_view(["DELETE"])
def delete_dlc_in_cart(requset, *args, **kwargs):
    #cart_item = get_object_or_404(CartItem, pk=pk)
    cart_pk = kwargs.get('cart_pk')
    item_pk = kwargs.get('item_pk')
    product_pk = kwargs.get('product_pk')
    dlc_pk = kwargs.get('dlc_pk')
    
    cart_item = CartItem.objects.get(pk=item_pk)
    cart = Cart.objects.get(pk=cart_pk)
    dlc = DLC.objects.get(pk=dlc_pk)
    product = ProductDecorator.objects.get(pk=product_pk)
    product.delete_dlc(dlc)
    cart_item.save()
    return Response(' ')

def checkout(request):
    user = User.objects.get(username="long1")
    transaction_id = datetime.datetime.now().timestamp()
    order, created = Order.objects.get_or_create(user=user)
    order_item = OrderItem.objects.get(pk=1)
    print(order.get_order_total)
    return render(request, "home/inbox.html")