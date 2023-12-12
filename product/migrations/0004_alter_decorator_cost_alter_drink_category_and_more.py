# Generated by Django 5.0 on 2023-12-09 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0003_drink_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='decorator',
            name='cost',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=2, null=True),
        ),
        migrations.AlterField(
            model_name='drink',
            name='category',
            field=models.CharField(choices=[('softdrinks', 'SOFT DRINKS'), ('beer', 'BEER')], default=True, max_length=14, null=True),
        ),
        migrations.AlterField(
            model_name='drink',
            name='cost',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=2, null=True),
        ),
        migrations.AlterField(
            model_name='topping',
            name='cost',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=2, null=True),
        ),
    ]