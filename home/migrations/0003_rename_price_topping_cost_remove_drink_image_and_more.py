# Generated by Django 4.1.3 on 2023-12-04 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_drink_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='topping',
            old_name='price',
            new_name='cost',
        ),
        migrations.RemoveField(
            model_name='drink',
            name='image',
        ),
        migrations.AlterField(
            model_name='drink',
            name='cost',
            field=models.DecimalField(decimal_places=2, max_digits=5),
        ),
        migrations.AlterField(
            model_name='drink',
            name='name',
            field=models.CharField(blank=True, default=None, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='topping',
            name='name',
            field=models.CharField(blank=True, default=None, max_length=200, null=True),
        ),
        migrations.DeleteModel(
            name='ToppedDrink',
        ),
    ]
