from django.shortcuts import render
import json
import uuid
import requests
import hmac
import hashlib
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from product.models import DLC,SpecialEditionGame,Game,ConcreteComponent,DLCDecorator
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
import datetime
from django.http import JsonResponse
from django.contrib.contenttypes.models import ContentType
from .command import RemoveFromOrderCommand,CreateOrderFromCartCommand, DeleteOrderCommand,CreateOrderCommand
from .controller import CartController,OrderController
from rest_framework.permissions import IsAuthenticated
from account.models import Libary

accessKey = "F8BBA842ECF85"
secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"

class CustomAuthenticated(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return super().has_permission(request, view)
        return True

@permission_classes([IsAuthenticated])
class CartView(APIView):
    def get(self, request):
        user = request.user
        cart = Cart.objects.get(user=user)
        serializer = CartSerializer(cart, many=False).data
        return Response(serializer)
    
    def post(self, request, *args, **kwargs):
        add_on = request.data.get('add_on', [])
        type = request.data.get('type')
        game_id = request.data.get('game_id')
        user = request.user
        cart = get_object_or_404(Cart,user=user)
        if type == ItemType.GAME.value:
            product = get_object_or_404(Game, id=game_id)
        if type == ItemType.DLC.value:
            product = get_object_or_404(DLC, id=game_id)

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

@permission_classes([IsAuthenticated])
class CheckoutFromCart(APIView):
    def post(self,request):
        controller = OrderController()
        #user = User.objects.get(username="long") 
        user = request.user
        transaction_id = datetime.datetime.now().timestamp()
        try:
            order = controller.execute(CreateOrderFromCartCommand(user=user,transaction_id=transaction_id))
            serializers = OrderSerializer(order, many=False).data
            return Response(serializers,status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        
@permission_classes([IsAuthenticated])
class Checkout(APIView):
    def post(self,request,*args, **kwargs):
        game_id = request.data.get('game_id')
        type = request.data.get('type')
        from_cart = request.data.get('from_cart')
        order_id = request.data.get('order_id')
        controller = OrderController()
        user = request.user
        item_type = None

        if type == "game":
            item_type = ItemType.GAME
        elif type == "dlc":
            item_type = ItemType.DLC

        try:
            if from_cart:
                command = CreateOrderFromCartCommand(user=user, transaction_id=order_id)
            else:
                command = CreateOrderCommand(user=user, transaction_id=order_id,game_id=game_id,item_type=item_type)
            
            order = controller.execute(command)
            serializers = OrderSerializer(order, many=False).data
            return Response(serializers, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        
class Payment(APIView):
    def post(self, request):
        # parameters send to MoMo get get payUrl
        endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
        orderInfo = "pay with MoMo"
        partnerCode = "MOMO"
        redirectUrl = "https://b554-2405-4802-3c4c-37b0-a8ae-ebf2-9b5c-5cff.ngrok-free.app/cart/callback"
        ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b"
        amount = request.data.get("amount")
        orderId = request.data.get("orderId")
        requestId = request.data.get("orderId")
        extraData = ""  # pass empty value or Encode base64 JsonString
        partnerName = "MoMo Payment"
        requestType = "captureWallet"
        storeId = "Test Store"
        orderGroupId = ""
        autoCapture = True
        lang = "vi"
        orderGroupId = ""

        # before sign HMAC SHA256 with format: accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl
        # &orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId
        # &requestType=$requestType
        rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId \
                    + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl\
                    + "&requestId=" + requestId + "&requestType=" + requestType

        
        h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
        signature = h.hexdigest()

        # json object send to MoMo endpoint
        data = {
            'partnerCode': partnerCode,
            'orderId': orderId,
            'partnerName': partnerName,
            'storeId': storeId,
            'ipnUrl': ipnUrl,
            'amount': amount,
            'lang': lang,
            'requestType': requestType,
            'redirectUrl': redirectUrl,
            'autoCapture': autoCapture,
            'orderInfo': orderInfo,
            'requestId': requestId,
            'extraData': extraData,
            'signature': signature,
            'orderGroupId': orderGroupId
        }

        data = json.dumps(data)
        clen = len(data)

        try:
            response = requests.post(endpoint, data=data, headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})
            return Response(response.json(), status=status.HTTP_200_OK)
        except:
            return Response({"message": "Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Callback(APIView):
    def get(self, request):
        try:
            print('callback')
            callback_data = request.query_params.dict()
            print(callback_data.get('resultCode'))
            print(callback_data.get('message'))
            if callback_data.get('resultCode') == "0":
                order = Order.objects.get(transaction_id=callback_data.get('orderId'))
                order.complete = True
                user = User.objects.get(username="duc") 
                library = Libary.objects.get(user=user)
                order_items = OrderItem.objects.filter(order=order)
                print("Get order items")
                for item in order_items:
                    library.add_libary_item(order=order, product=item)
                order.save()
            return Response(callback_data, status=status.HTTP_200_OK)
        except:
            return Response({"error": "Failed to process callback"}, status=500)

class TransactionStatus(APIView):
    def post(self, request):
        orderId = request.data.get("orderId")
        endpoint = "https://test-payment.momo.vn/v2/gateway/api/query"
        rawSignature = "accessKey=" + accessKey + "&orderId=" + orderId + "&partnerCode=MOMO" + "&requestId=" + orderId
        h = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256)
        signature = h.hexdigest()
        data = {
            "partnerCode": "MOMO",
            "requestId": orderId,
            "orderId": orderId,
            "signature": signature,
            "lang": "vi"
        }

        data = json.dumps(data)
        print(data)
        clen = len(data)

        try:
            response = requests.post(endpoint, data=data, headers={'Content-Type': 'application/json', 'Content-Length': str(clen)})
            return Response(response.json(), status=status.HTTP_200_OK)
        except:
            return Response({"message": "Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





def test2(request):
    user = User.objects.get(username="long") 
    cart = Cart.objects.get(user=user)
    items = CartItem.objects.filter(cart=cart)
    transaction_id = datetime.datetime.now().timestamp()
    order, created = Order.objects.get_or_create(user=user, transaction_id=transaction_id)
    for item in items:
        if item.type == ItemType.GAME.value:
            game = Game.objects.get(slug=item.slug)
            order_item = OrderItem.objects.create(order=order, 
                                                content_type=ContentType.objects.get_for_model(game),
                                                object_id=game.id)
        elif item.type == ItemType.DLC.value:
            game = DLC.objects.get(slug=item.slug)
            order_item = OrderItem.objects.create(order=order, 
                                                content_type=ContentType.objects.get_for_model(game),
                                                object_id=game.id)
        else:
            #return 404
            pass
    return render(request, "home/inbox.html")



