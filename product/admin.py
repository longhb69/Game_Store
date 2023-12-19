from django.contrib import admin
from django.contrib.contenttypes.models import ContentType
from .models import Category,Game,DLC,ProductDecorator,SpecialEditionGame

class ProductDecoratorAdmin(admin.ModelAdmin):
    list_display = ['name','display_content_type','id']
    def display_content_type(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return content_type.model

class SpecialEditionGameAdmin(admin.ModelAdmin):
    list_display = ['name','display_content_type','id']
    def display_content_type(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return content_type.model

class DLCAdmin(admin.ModelAdmin):
    list_display = ['name','id']

admin.site.register(Category)
admin.site.register(Game)
admin.site.register(DLC,DLCAdmin)
admin.site.register(ProductDecorator,ProductDecoratorAdmin)
admin.site.register(SpecialEditionGame,SpecialEditionGameAdmin)