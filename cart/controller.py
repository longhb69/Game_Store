from dataclasses import dataclass, field
from .models import Command

@dataclass
class CartController:
    def Invoke(self, command:Command):
        command.execute()
        
@dataclass
class OrderController:
    undo_stack: list[Command] = field(default_factory=list) 
    
    def execute(self, command:Command):
        command.execute()
        self.undo_stack.append(command)
    def undo(self):
        if not self.undo_stack:
            return
        command = self.undo_stack.pop()
        command.undo()
        