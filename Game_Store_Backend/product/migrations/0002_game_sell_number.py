# Generated by Django 5.0 on 2024-01-18 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='sell_number',
            field=models.BigIntegerField(blank=True, default=0, null=True),
        ),
    ]