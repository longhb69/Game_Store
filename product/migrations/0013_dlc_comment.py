# Generated by Django 5.0 on 2024-02-09 11:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_comment_text'),
        ('product', '0012_game_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='dlc',
            name='comment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='account.comment'),
        ),
    ]
