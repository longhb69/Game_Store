# Generated by Django 5.0 on 2024-02-09 11:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0013_dlc_comment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dlc',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='game',
            name='comment',
        ),
    ]