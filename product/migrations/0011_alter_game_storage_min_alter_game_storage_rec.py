# Generated by Django 5.0 on 2023-12-14 04:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0010_alter_game_year'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='storage_min',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Minimum Storage'),
        ),
        migrations.AlterField(
            model_name='game',
            name='storage_rec',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Recommended Storage'),
        ),
    ]
