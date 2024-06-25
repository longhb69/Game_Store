from django.apps import AppConfig


class ProductConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'product'

    def ready(self):
        from django.db.models.signals import pre_save
        from .models import Game
        from account.observer import GameObservable, EmailObserver

        def game_pre_save(sender, instance, **kwargs):
            game_observable = GameObservable(instance)
            email_observer = EmailObserver()

            game_observable.add_observer(email_observer)
            game_observable.check_price_drop()

        pre_save.connect(game_pre_save, sender=Game)

