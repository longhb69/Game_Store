from django.shortcuts import render
from .models import Category,Game,DLC,SpecialEditionGame,ConcreteComponent,DLCDecorator, Publisher,Comment
from django.http import JsonResponse
from .serializers import CategorySerializer,GameSerializer,GameDetailSerializer,DLCSerializer,DLCDetailSerializer,SpecialEditionGameDetailSerializer, CommentSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import mixins 
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from algoliasearch_django import algolia_engine
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from cart.models import ItemType
from django.contrib.contenttypes.models import ContentType

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
        games = ['alan-wake-2', 'the-last-of-ustm-part-i','the-callisto-protocoltm','grand-theft-auto-v', 'red-dead-redemption-2','hogwarts-legacy']
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

class PicksForYou(mixins.ListModelMixin, GenericAPIView):
    games = ['outer-wilds','marvels-spider-man-miles-morales','the-quarry','sifu','the-last-of-ustm-part-i','grand-theft-auto-v', 'red-dead-redemption-2']
    queryset = Game.objects.filter(slug__in = games)
    serializer_class = GameSerializer
    def get(self, request,*args, **kwargs):
        return self.list(request, *args, **kwargs)

class DeveloperView(APIView):
    def get(self, request, *args, **kwargs):
        slug=self.kwargs.get('slug', None)
        if slug is not None:
            publisher = Publisher.objects.get(slug=slug)
            games = Game.objects.filter(publisher=publisher)
            serializer = GameSerializer(games, many=True).data
            publisher_logo = {"name": publisher.name}
            response_data = {
                'games': serializer,
                'publisher': publisher_logo
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Slug not found"}, status=status.HTTP_400_BAD_REQUEST)

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
            for category in category_filter:
                q = q.filter(category=category)
        serializer = GameSerializer(q, many=True).data
        return Response(serializer)

@permission_classes([IsAuthenticated])
class CommentView(APIView):
    def post(self, request):
        try:
            text = request.data.get('text')
            recommended = request.data.get('recommended')
            type = request.data.get("type")
            game_id = request.data.get('game_id')
            user = request.user
            content_type = None
            object_id = None
            if type == ItemType.GAME.value:
                game = Game.objects.get(id=game_id)
                content_type = ContentType.objects.get_for_model(game)
                object_id = game.id
            elif type == ItemType.DLC.value:
                dlc = DLC.objects.get(id=game_id)
                content_type = ContentType.objects.get_for_model(dlc)
                object_id = dlc.id
                
            comment = Comment.objects.create(
                text=text,
                recommended=recommended,
                user=user,
                content_type = content_type,
                object_id = object_id
            )
            serializer = CommentSerializer(comment, many=False).data
            return Response(serializer,status=status.HTTP_201_CREATED)
        except Exception as e:
            return  Response({'error': str(e)}, status=500)
        
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