from django.urls import path
from . import views

urlpatterns = [
    path('',views.UserView.as_view()),
    path('register',views.register, name='register'),
    path('libary', views.LibaryView.as_view(), name="libary"),
    path('game_in_libary', views.GameInLibary.as_view(), name="game_in_libary"),
    path('wishlist', views.WithListView.as_view(), name="wishlist"),
    path('game_in_wishlist', views.ItemInWishList.as_view(), name="game_in_wishlist"),
    path('transactions', views.TransactionsView.as_view(), name="transactions"),
    path('test', views.test)
]