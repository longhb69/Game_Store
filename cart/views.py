from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from product.models import ProductDecorator,DLC,SpecialEditionGame,Game,ConcreteComponent,DLCDecorator
from product.serializers import ProductDecoratorSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
import datetime
from django.http import JsonResponse
from django.contrib.contenttypes.models import ContentType
from .command import  AddToCartCommand,RemoveFromCartCommand,AddToOrderCommand,RemoveFromOrderCommand,CreateOrderCommand, DeleteOrderCommand
from .controller import CartController,OrderController
from rest_framework.permissions import IsAuthenticated

class CustomAuthenticated(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return super().has_permission(request, view)
        return True

#@permission_classes([IsAuthenticated])
class CartView(APIView):
    def get(self, request):
        #user = request.user
        user = get_object_or_404(User,username="long")
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart, many=False).data
        #test = ProductDecorator.objects.get(name="Cyberpunk 2077")
        #serializer = ProductDecoratorSerializer(test, many=False).data
        return Response(serializer)
    
    #{"special": false,"dlc":true,"game_id":2,"cart_id":2}
    def post(self, request, *args, **kwargs):
        add_on = request.data.get('add_on', [])
        type = request.data.get('type')
        base_game_id = request.data.get('base_game_id')
        user = request.user
        #user = get_object_or_404(User,username="long")
        cart = get_object_or_404(Cart,user=user)
        if type == 'game':
            product = get_object_or_404(Game, id=base_game_id)
        if type == 'dlc':
            product = get_object_or_404(DLC, id=base_game_id)

        decorator = ConcreteComponent(product)
        for item in add_on:
            dlc = get_object_or_404(DLC, id=item.get('game_id'))
            decorator = DLCDecorator(decorator, dlc)
        try:
            dlcs = decorator.get_dlcs()
            cart_item = CartItem.objects.create(cart=cart,type=type,
                                                name=decorator.get_name(), 
                                                price=decorator.get_price(), 
                                                cover=decorator.get_cover())
            cart_item.dlcs.set(dlcs)
            cart_item.save()
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        
        # if dlc: 
        #     #cart_item_content_type = ContentType.objects.get_for_model(DLC)
        #     print(f"DLC {game_id} add to cart")
        #     product = get_object_or_404(DLC,pk=game_id)
        # elif special:
        #     product = get_object_or_404(SpecialEditionGame, pk=game_id)
        # else:
        #     print(f"Game {game_id} add to cart")
        #     product = get_object_or_404(Game, pk=game_id)
        # try:
        #     cart_item = CartItem.objects.create(cart=cart,  product=product)
        # except Exception as e:
        #     return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        return JsonResponse({'message': 'CartItem created successfully'}, status=201)
    
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

class CartQuantityView(APIView):
    def get(self, request):
        user = request.user
        #user = get_object_or_404(User, username="long")
        cart = get_object_or_404(Cart, user=user)
        try:
            cart_items = CartItem.objects.filter(cart=cart).count()
            return Response({'quantity': cart_items}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'quantity': 0}, status=status.HTTP_200_OK)
        
class ItemInCart(APIView):
    def get(self, request):
        user = request.user
        #user = get_object_or_404(User, username="long")
        cart = get_object_or_404(Cart, user=user)
        cart_items = CartItem.objects.filter(cart=cart)
        items_name = [item.slug for item in cart_items]
        dlc = []
        for cart_item in cart_items:
            dlc += [dlc.slug for dlc in cart_item.dlcs.all()]
        return Response({'items_name': items_name + dlc})

def checkout(request):
    user = User.objects.get(username="long1")
    # transaction_id = datetime.datetime.now().timestamp()
    cart = Cart.objects.get(user=user)
    order, created = Order.objects.get_or_create(user=user)
    items = CartItem.objects.filter(cart=cart)
    controller = OrderController()
    controller.execute(AddToOrderCommand(order,items))
    #controller.execute(RemoveFromOrderCommand(order))
    print(order.get_order_total)
    return render(request, "home/inbox.html")

def test(request):
    controller = OrderController()
    user = User.objects.get(username="long1")
    cart = Cart.objects.get(user=user)
    transaction_id = datetime.datetime.now().timestamp()
    order = controller.execute(CreateOrderCommand(user=user,transaction_id=transaction_id))
    #controller.undo()
    #controller.execute(DeleteOrderCommand(user=user,transaction_id=1703344243.71661))``
    #product = OrderItem.objects.filter(order=order).first()
    # item = get_object_or_404(product.content_type.model_class(), pk=product.object_id)
    # command = RemoveFromOrderCommand(order,item)
    # command.execute()
    return render(request, "home/inbox.html")


