from dataclasses import dataclass
from .models import Cart,CartItem,Order,OrderItem,ItemType
from django.contrib.auth.models import User
from typing import Union
from django.contrib.contenttypes.models import ContentType
from product.models import SpecialEditionGame,DLC,ProductDecorator,Game
from django.shortcuts import get_object_or_404


@dataclass 
class AddToOrderCommand:
    order: Order
    items: Union[SpecialEditionGame,DLC,Game]
    
    def execute(self) -> None:
        if self.items is None: 
            return
        self.order.add_item(items=self.items)
    
    def undo(self) -> None:
        if self.items is None: 
            return
        self.order.delete_item(item=self.item)
        
@dataclass
class RemoveFromOrderCommand:
    order: Order
    
    def execute(self) -> None:
        self.order.delete_item()
    
    def undo(self) -> None:
        self.order.add_item(item=self.item)

@dataclass
class CreateOrderCommand:
    user: User
    transaction_id: float
    def execute(self) -> Order:
        order, created = Order.objects.get_or_create(user=self.user, transaction_id=self.transaction_id)
        cart = Cart.objects.get(user=self.user)
        items = CartItem.objects.filter(cart=cart)
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
                return "Error can't create Order"
        items.delete()
        return order
    def undo(self):
        order = get_object_or_404(Order, user=self.user, transaction_id=self.transaction_id)
        order.delete()

@dataclass
class DeleteOrderCommand:
    user: User
    transaction_id: float
    def execute(self) -> None:
        order = get_object_or_404(Order, user=self.user, transaction_id=self.transaction_id)
        order.delete()
    def undo(self) -> Order:
        order, created = Order.objects.get_or_create(user=self.user, transaction_id=self.transaction_id)
        return order






@dataclass
class AddToCartCommand:
    cart: Cart
    item: Union[SpecialEditionGame,DLC,ProductDecorator]
    
    @property
    def transfer_detail(self) -> str:
        return f"${self.item} add to cart {self.cart}" 
    
    def execute(self):
        self.cart.add_item(item=self.item)
        print(self.transfer_detail)
    
@dataclass
class RemoveFromCartCommand:
    cart: Cart
    item: CartItem
    
    @property
    def transfer_detail(self) -> str:
        return f"${self.item} remove from cart {self.cart}" 
    
    def execute(self):
        self.cart.delet_item(item=self.item)
        print(self.transfer_detail)