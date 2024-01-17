from dataclasses import dataclass
from .models import Cart,CartItem,Order,ItemType
from account.models import Libary
from django.contrib.auth.models import User
from typing import Union
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
        order = Order.objects.create(user=self.user, transaction_id=self.transaction_id)
        cart = Cart.objects.get(user=self.user)
        items = CartItem.objects.filter(cart=cart)
        libary = Libary.objects.get(user=self.user)
        for item in items:
            if item.type == ItemType.GAME.value:
                game = Game.objects.get(slug=item.slug)
                order.add_item(game)
                libary.add_libary_item(order=order, product=game)
                for dlc in item.dlcs.all():
                    dlc = DLC.objects.get(slug=dlc.slug)
                    order.add_item(dlc)
                    libary.add_libary_item(order=order, product=dlc)
            elif item.type == ItemType.DLC.value:
                game = DLC.objects.get(slug=item.slug)
                order.add_item(game)
                libary.add_libary_item(order=order, product=game)
            else:
                pass
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