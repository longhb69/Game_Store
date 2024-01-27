from django.shortcuts import render
from .models import Category,Game,DLC,SpecialEditionGame,ConcreteComponent,DLCDecorator
from django.db.models import Q
from django.http import JsonResponse
from .serializers import CategorySerializer,GameSerializer,GameDetailSerializer,DLCSerializer,DLCDetailSerializer,SpecialEditionGameDetailSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import mixins 
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from algoliasearch_django import algolia_engine

class CategoryPagination(PageNumberPagination):
   page_size = 4
   def get_paginated_response(self, data):
       return Response({
           'links': {
               'next': self.get_next_link(),
               'previous': self.get_previous_link()
           },
           'conut': self.page.paginator.count,
           'total_pages': self.page.paginator.num_pages,
           'current_page': self.page.number,
           'results': data
       })
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5

class NewFeaturedView(APIView):
    def get(self, request):
        games = ['alan-wake-2', 'the-last-of-ustm-part-i','the-callisto-protocoltm','grand-theft-auto-v', 'red-dead-redemption-2']
        try: 
            newfeatured = Game.objects.filter(slug__in=games)
            serializer = GameSerializer(newfeatured, many=True).data
            return Response(serializer)
        except Game.DoesNotExist:
            return JsonResponse("Games doesn't exists!")
    

class CategoryMixinView(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = CategoryPagination
    lookup_field = 'name'
    
    def get_object(self, category):
        try:
            category = Category.objects.get(slug=category)
            return Game.objects.filter(category=category)
        except Category.DoesNotExist:
            return JsonResponse("Category doesn't exists!")
    
    def get(self, request, *args, **kwargs):
        category = kwargs.get('slug')
        if category is not None:
            instance = self.get_object(category)
            serializer = GameSerializer(instance, many=True).data
            return Response(serializer)
        return self.list(request, *args, **kwargs)
    
class CategoryMixinView2(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'name'
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
        

def index(request):
    game = Game.objects.get(slug='alan-wake-2')
    dlc = DLC.objects.get(slug='dlc1')
    dlc2 = DLC.objects.get(slug='dlc2')
    base_game = ConcreteComponent(game)
    decorator = DLCDecorator(decorated=base_game, item=dlc)
    decorator = DLCDecorator(decorated=decorator, item=dlc2)

    print(decorator.get_price())
    return render(request, "home/inbox.html")

@api_view(["POST", "GET"])
def game_alt_view(request, slug=None, *args, **kwargs):
    method = request.method
    if method == "GET":
        if slug is not None:
            try:
                obj = get_object_or_404(Game, slug=slug)
                data = GameDetailSerializer(obj,many=False).data
            except:
                return Response("Game connot serializer")
                #obj = get_object_or_404(SpecialEditionGame, slug=slug)
                #data = SpecialEditionGameDetailSerializer(obj,many=False).data
            return Response(data)
        queryset = Game.objects.all()
        data = GameSerializer(queryset, many=True).data
        return Response(data) 
    
@api_view(["POST", "GET"])
def dlc_alt_view(request, slug=None, *args, **kwargs):
    method = request.method
    if method == "GET":
        if slug is not None:
            game = get_object_or_404(DLC, slug=slug)
            data = DLCDetailSerializer(game,many=False).data
            return Response(data)
        queryset = Game.objects.all()
        data = GameSerializer(queryset, many=True).data
        return Response(data) 

class TopSellers(mixins.ListModelMixin,mixins.RetrieveModelMixin,GenericAPIView):
    queryset = Game.objects.filter(sell_number__gte = 50).order_by('-id')
    serializer_class = GameSerializer
    def get(self, request,*args, **kwargs):
        return self.list(request, *args, **kwargs)

class MostPopular(mixins.ListModelMixin,GenericAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    def get(self, request,*args, **kwargs):
        return self.list(request, *args, **kwargs)

class NewRelease(mixins.ListModelMixin, GenericAPIView):
    queryset = Game.objects.filter(year__year = 2023)
    serializer_class = GameSerializer
    def get(self, request,*args, **kwargs):
        return self.list(request, *args, **kwargs)

class CommingSoon(mixins.ListModelMixin, GenericAPIView):
    queryset = Game.objects.filter(year__year__gte = 2024)
    serializer_class = GameSerializer
    def get(self, request,*args, **kwargs):
        return self.list(request, *args, **kwargs)

def get_client():
    return algolia_engine.client
def get_index(index_name='long_Game'):
    client = get_client()
    index = client.init_index(index_name)
    return index
def perform_search(query, **kwargs):
    index = get_index()
    params = {}
    tags = ""
    if "tags" in kwargs:
        tags = kwargs.pop("tags") or []
        if len(tags) != 0:
            params['tagFilters'] = tags
            print(params['tagFilters'])
    results = index.search(query,params)
    return results

class SearchListView(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        query = request.GET.get('q')
        if not query:
            return Response("")
        tag = request.GET.get('tag')
        results = perform_search(query)
        ids = [r["id"] for r in results['hits']]
        q = Game.objects.filter(id__in = ids)
        if tag:
            new_tag = tag.split(",")
            category_filter  = Category.objects.filter(name__in=new_tag)
            for category in category_filter :
                q = q.filter(category=category)
        serializer = GameSerializer(q, many=True).data
        return Response(serializer)
        
        
# def add(request):
#     if request.method == 'POST':
#         condiments_selection = request.POST.getlist('condiments')
#         drink_name = request.POST.get('drink_name')
#         print(drink_name)
#         drink = Drink.objects.get(name=drink_name)
#         toppeddrink = Decorator.objects.create(beverage=drink)
#         print(condiments_selection)
#         for condiment in condiments_selection:
#             if Topping.objects.filter(name=condiment).exists():
#                 topping = Topping.objects.get(name=condiment)
#                 toppeddrink.add_topping(topping)
#                 print(toppeddrink.cost)
#         return render(request, "home/orderfrom.html", {
#             "drink": toppeddrink
#         })
# @api_view(["POST", "GET"])
# def drink_alt_view(request, slug=None, *args, **kwargs):
#     method = request.method
#     if method == "GET":
#         if slug is not None:
#             print(slug)
#             obj = get_object_or_404(Drink, slug=slug)
#             data = DrinkSerializer(obj,many=False).data
#             return Response(data)
#         queryset = Drink.objects.all()
#         data = DrinkSerializer(queryset, many=True).data
#         return Response(data) 

# @api_view(["POST", "GET"])
# def topping_alt_view(request, name=None, *args, **kwargs):
#     method = request.method
#     if method == "GET":
#         if name is not None:
#             obj = get_object_or_404(Topping, name=name)
#             data = ToppingSerializer(obj,many=False).data
#             return Response(data)
#         queryset = Topping.objects.all()
#         data = ToppingSerializer(queryset, many=True).data
#         return Response(data) 