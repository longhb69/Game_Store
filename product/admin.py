from django.contrib import admin
from .models import Category,Game,DLC,ProductDecorator,SpecialEditionGame

class ProductDecoratorAdmin(admin.ModelAdmin):
    list_display = ['name','id']

class SpecialEditionGameAdmin(admin.ModelAdmin):
    list_display = ['name','id']

admin.site.register(Category)
admin.site.register(Game)
admin.site.register(DLC)
admin.site.register(ProductDecorator,ProductDecoratorAdmin)
admin.site.register(SpecialEditionGame,SpecialEditionGameAdmin)