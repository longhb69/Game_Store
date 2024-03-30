from algoliasearch_django import AlgoliaIndex
from algoliasearch_django.decorators import register
from .models import Game

@register(Game)
class ProductInex(AlgoliaIndex):
    fields = [
        'id',
        'name',
    ]
    tags = 'get_categories'
    settings = {
        'searchableAttributes': ['name'],
    }
    


    
