from account.models import WishListItem
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

class Observable:
    def __init__(self) -> None:
        self.observers = []
    
    def add_observer(self, observer):
        if observer not in self.observers:
            self.observers.append(observer)
    
    def remove_observer(self, observer):
        if observer not in self.observers:
            self.observers.remove(observer)
    
    def notify_observers(self, *args, **kwargs):
        for observer in self.observers:
            observer.update(self, *args, **kwargs)

class Observer:
    def update(self, observable, *args, **kwargs):
        pass

class GameObservable(Observable):
    def __init__(self, game) -> None:
        super().__init__()
        self.game = game
    
    def check_price_drop(self):
        if self.game.discount_percentage > 0:
            self.notify_observers(previous_price = self.game.price, new_price = self.game.discounted_price)

class EmailObserver(Observer):
    def update(self, observable, *args, **kwargs):
        game = observable.game
        previous_price = kwargs.get('previous_price')
        new_price = kwargs.get('new_price')
        subject = "BIG SALES"
        from_email = settings.EMAIL_HOST_USER
        discount_percentage = (game.discount_percentage/100)
        product_url = f"http://localhost:3000/app/{game.slug}"


        wishlist_items = WishListItem.filter_by_product(game)
        for item in wishlist_items:
            observer = item.wishlist.user
            print(f"Game Price Dropped! send email to {observer.email}")

            html_content = render_to_string('home/email_template.html', {'username': observer.username, 
                                                                        'image_url': game.cover.url, 
                                                                        'previous_price': previous_price, 
                                                                        'new_price': new_price,
                                                                        'discount_percentage': discount_percentage,
                                                                        'product_url': product_url})
            
            msg = EmailMultiAlternatives(subject,'',from_email,[observer.email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
    
