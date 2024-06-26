from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test2),
    path('',views.CartView.as_view()),
    path('quantity', views.CartQuantityView.as_view()),
    path('item-in-cart', views.ItemInCart.as_view()),
    path('checkout_cart', views.CheckoutFromCart.as_view(), name="checkout_cart"),
    path('checkout', views.Checkout.as_view(), name="checkout"),
    path('payment', views.Payment.as_view(), name="payment"),
    path('callback', views.Callback.as_view(), name="callback"),
    path('transaction-status', views.TransactionStatus.as_view(), name="transaction-status"),
    path('cartitem/delete/<int:item_pk>', views.CartView.as_view(), name="delete_item_in_cart"),
    path('cartitem/delete_dlc/<int:cart_pk>/<int:item_pk>/<int:product_pk>/<int:dlc_pk>/', views.delete_dlc_in_cart, name='delete_dlc_in_cart'),
    
]


