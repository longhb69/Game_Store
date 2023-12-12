# Generated by Django 5.0 on 2023-12-09 08:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default=None, max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Drink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('cost', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=5, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Topping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('cost', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=5, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Decorator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(blank=True, default=None, max_length=200, null=True)),
                ('cost', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=5, null=True)),
                ('beverage', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='product.drink')),
                ('toppings', models.ManyToManyField(blank=True, to='product.topping')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
