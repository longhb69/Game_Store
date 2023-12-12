from django.urls import path
from . import views 


urlpatterns = [
    path('test/', views.index),
    path('api/drink/', views.drink_alt_view, name="drink-list"),
    path('api/drink/<str:slug>/', views.drink_alt_view, name="drink-detail"),
    path('api/topping/',views.topping_alt_view, name="topping-list"),
    path('api/category/', views.CategoryMixinView.as_view(), name="category-list"),
    path('api/category/<str:slug>/', views.CategoryMixinView.as_view(), name="category-detail")
    
]