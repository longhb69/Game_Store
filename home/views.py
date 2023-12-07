from django.shortcuts import render
from .models import Espresso, HouseBlend, Mocha, Whip, Soy,Drink,Topping,Decorator
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.views.generic.list import ListView
from django.utils import timezone


beverage_mapping = {
    'espresso': Espresso,
    'house_blend': HouseBlend,
}
condiment_mapping = {
    'mocha': Mocha,
    'whip': Whip,
    'soy': Soy,
}

class DrinkView(ListView):
    model = Drink
    template_name = "home/inbox.html"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["drinks"] = Drink.objects.all()
        return context
    
    

def index(request):
    drink = Drink.objects.get(description = "Espresso")
    topping = Topping.objects.get(description="milk")
    topping2 = Topping.objects.get(description="mocha")
    test = Decorator.objects.create(beverage = drink)
    test.add_topping(topping)
    test.add_topping(topping2)
    print(test.get_cost())
    return render(request, "home/inbox.html")

# def add(request):
#     if request.method == 'POST':
#         condiments_selection = request.POST.getlist('condiments')
#         drink_name = request.POST.get('drink_name')
#         print(drink_name)
#         drink = Drink.objects.get(name=drink_name)
#         toppeddrink = ToppedDrink.objects.create(beverage=drink)
#         print(condiments_selection)
#         for condiment in condiments_selection:
#             if Topping.objects.filter(name=condiment).exists():
#                 topping = Topping.objects.get(name=condiment)
#                 toppeddrink.add_topping(topping)
#                 print(toppeddrink.cost)
#         return render(request, "home/orderfrom.html", {
#             "drink": toppeddrink
#         })

    

