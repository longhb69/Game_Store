from dataclasses import dataclass
from .models import Cart,CartItem,Order,OrderItem
from django.contrib.auth.models import User
from typing import Union
from product.models import SpecialEditionGame,DLC,ProductDecorator
from django.shortcuts import get_object_or_404


@dataclass 
class AddToOrderCommand:
    order: Order
    items: Union[SpecialEditionGame,DLC,ProductDecorator]
    
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