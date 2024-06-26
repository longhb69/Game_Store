from dataclasses import dataclass
from .models import Cart,CartItem,Order,ItemType
from account.models import Libary
from django.contrib.auth.models import User
from typing import Union
from product.models import SpecialEditionGame,DLC,Game
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
class CreateOrderFromCartCommand:
    user: User
    transaction_id: float
    def execute(self) -> Order:
        order = Order.objects.create(user=self.user, transaction_id=self.transaction_id)
        cart = Cart.objects.get(user=self.user)
        items = CartItem.objects.filter(cart=cart)
        for item in items:
            if item.type == ItemType.GAME.value:
                game = Game.objects.get(slug=item.slug)
                order.add_item(game)

                for dlc in item.dlcs.all():
                    dlc = DLC.objects.get(slug=dlc.slug)
                    order.add_item(dlc)
            elif item.type == ItemType.DLC.value:
                game = DLC.objects.get(slug=item.slug)
                order.add_item(game)
            else:
                pass
        items.delete()
        return order
    def undo(self):
        order = get_object_or_404(Order, user=self.user, transaction_id=self.transaction_id)
        order.delete()

@dataclass
class CreateOrderCommand:
    user: User
    transaction_id: float
    game_id: int
    item_type: ItemType
    def execute(self) -> Order:
        order = Order.objects.create(user=self.user, transaction_id=self.transaction_id)
        item_slug = ""
        if self.item_type == ItemType.GAME:
            item = Game.objects.get(id=self.game_id)
            order.add_item(item)
            item_slug = item.slug
        elif self.item_type == ItemType.DLC:
            item = DLC.objects.get(id=self.game_id)
            order.add_item(item)
            item_slug = item.slug
        
        try:
            cartItem = CartItem.objects.get(slug=item_slug)
            cartItem.delete()
        except CartItem.DoesNotExist:
            print(f"CartItem '{item_slug} does not exist in user cart")

        return order

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
