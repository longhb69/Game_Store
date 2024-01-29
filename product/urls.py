from django.urls import path
from . import views 

urlpatterns = [
    path('test/', views.index),
    path('api/category/', views.CategoryMixinView.as_view(), name="category-list"),
    path('api/category2/', views.CategoryMixinView2.as_view(), name="category-list"),
    path('api/category/<str:slug>/', views.CategoryMixinView.as_view(), name="category-detail"),
    path('api/game/', views.game_alt_view, name='game-list'),
    path('api/game/<str:slug>', views.game_alt_view,name='game-detail'),
    path('api/top-sellers', views.TopSellers.as_view(), name="topsellers"),
    path('api/most-popular', views.MostPopular.as_view(), name="most-popular"),
    path('api/new-release', views.NewRelease.as_view(), name="new-release"),
    path('api/comming-soon', views.CommingSoon.as_view(), name="comming-soon"),
    path('api/dlc/<str:slug>/', views.dlc_alt_view,name='dlc-detail'),
    path('api/newfeatured/', views.NewFeaturedView.as_view(), name='newfeatured'),
    path('api/developer/<str:slug>', views)
    path('search', views.SearchListView.as_view(), name='search'),
    
]
