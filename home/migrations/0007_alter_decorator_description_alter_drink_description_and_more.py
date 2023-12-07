# Generated by Django 4.1.3 on 2023-12-04 07:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_alter_decorator_cost_alter_drink_cost_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='decorator',
            name='description',
            field=models.CharField(blank=True, default='', max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='drink',
            name='description',
            field=models.CharField(blank=True, default='', max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='topping',
            name='description',
            field=models.CharField(blank=True, default='', max_length=200, null=True),
        ),
    ]
