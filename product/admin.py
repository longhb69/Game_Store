from django.contrib import admin
from .models import Category,Game,DLC,Decorator

admin.site.register(Category)
admin.site.register(Game)
admin.site.register(DLC)
admin.site.register(Decorator)