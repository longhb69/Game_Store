from django.urls import path
from . import views 

urlpatterns = [
    path('test/', views.index),
    path('api/category/', views.CategoryMixinView.as_view(), name="category-list"),
    path('api/category/<str:slug>/', views.CategoryMixinView.as_view(), name="category-detail"),
    path('api/game/', views.game_alt_view, name='game-list'),
    path('api/game/<str:slug>', views.game_alt_view,name='game-detail'),
    path('api/dlc/<str:slug>/', views.dlc_alt_view,name='dlc-detail'),
    path('api/newfeatured/', views.NewFeaturedView.as_view(), name='newfeatured'),
    
]






   #path('test/', views.index),
    # path('api/drink/', views.drink_alt_view, name="drink-list"),
    # path('api/drink/<str:slug>/', views.drink_alt_view, name="drink-detail"),
    # path('api/topping/',views.topping_alt_view, name="topping-list"),