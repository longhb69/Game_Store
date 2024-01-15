from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test2),
    path('test3/', views.test3),
    path('',views.CartView.as_view()),
    path('quantity', views.CartQuantityView.as_view()),
    path('item-in-cart', views.ItemInCart.as_view()),
    path('checkout_cart/', views.CheckoutFromCart.as_view(), name="checkout_cart"),
    path('cartitem/delete/<int:item_pk>', views.CartView.as_view(), name="delete_item_in_cart"),
    path('cartitem/delete_dlc/<int:cart_pk>/<int:item_pk>/<int:product_pk>/<int:dlc_pk>/', views.delete_dlc_in_cart, name='delete_dlc_in_cart'),
    
]


#http://127.0.0.1:8000/cart/cartitem/delete_dlc/True/2/5/32/3/