from dataclasses import dataclass
from .models import Cart,CartItem,Order,OrderItem
from typing import Union
from product.models import SpecialEditionGame,DLC,ProductDecorator


@dataclass 
class AddToOrderCommand:
    order: Order
    item: Union[SpecialEditionGame,DLC,ProductDecorator]
    
    def execute(self):
        self.order.add_item(item=self.item)
        
@dataclass
class RemoveFromOrderCommand:
    order: Order
    item: Union[SpecialEditionGame,DLC,ProductDecorator]
    
    def execute(self):
        self.order.delete_item(item=self.item)







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