# Generated by Django 5.0 on 2023-12-09 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_drink_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='drink',
            name='category',
            field=models.CharField(choices=[('SD', 'Soft Drinks'), ('BE', 'Beer')], default=True, max_length=4, null=True),
        ),
    ]