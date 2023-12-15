from product.models import Game
def run():
    game = Game.objects.get(name = "Alan Wake 2")
    print(game.name)