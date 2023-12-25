from dataclasses import dataclass, field
from .models import Command

@dataclass
class CartController:
    def Invoke(self, command:Command):
        command.execute()
        
@dataclass
class OrderController:
    
    def execute(self, command:Command):
        command.execute()
   
        