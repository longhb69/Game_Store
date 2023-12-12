# Generated by Django 5.0 on 2023-12-12 07:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0015_decorator_size_alter_size_size'),
    ]

    operations = [
        migrations.AlterField(
            model_name='decorator',
            name='size',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='product.size'),
        ),
    ]