from django.shortcuts import render
from .models import Espresso, HouseBlend, Mocha, Whip, Soy,Drink,ToppedDrink,Topping
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

beverage_mapping = {
    'espresso': Espresso,
    'house_blend': HouseBlend,
}
condiment_mapping = {
    'mocha': Mocha,
    'whip': Whip,
    'soy': Soy,
}

def index(request):
    drink = Drink.objects.get(description = "Espesso")
    topping = Topping.objects.get(name="milk")
    topping2 = Topping.objects.get(name="mocha")
    test = ToppedDrink.objects.create(beverage = drink)
    test.add_topping(topping)
    test.add_topping(topping2)

    print(test.cost())
    return render(request, "home/inbox.html")

def add(request):
    if request.method == 'POST':
        condiments_selection = request.POST.getlist('condiments')
        drink = beverage_mapping['espresso']()
        for condiment in condiments_selection:
            drink = condiment_mapping[condiment](drink)
        print(drink.getDescription(), drink.cost(), drink.getCategory())
        return render(request, "home/orderfrom.html", {
            "drink": drink
        })

    

