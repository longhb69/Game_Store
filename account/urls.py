from django.urls import path
from . import views

urlpatterns = [
    path('',views.UserView.as_view(), name='account'),
    path('libary', views.LibaryView.as_view(), name="libary"),
    path('game_in_libary', views.GameInLibary.as_view(), name="game_in_libary"),
    path('transactions', views.TransactionsView.as_view(), name="transactions")
]