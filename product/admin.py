from django.contrib import admin
from django.contrib.contenttypes.models import ContentType
from .models import Category,Game,DLC,ProductDecorator,SpecialEditionGame,GameImage,GameVideo,Developer, Publisher, Developer, DLCImage

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
class GameAdmin(admin.ModelAdmin):
    list_display = ['name','id']

admin.site.register(Category)
admin.site.register(Game,GameAdmin)
admin.site.register(DLC,DLCAdmin)
admin.site.register(ProductDecorator,ProductDecoratorAdmin)
admin.site.register(SpecialEditionGame,SpecialEditionGameAdmin)
admin.site.register(GameImage)
admin.site.register(GameVideo)
admin.site.register(Developer)
admin.site.register(Publisher)
admin.site.register(DLCImage)