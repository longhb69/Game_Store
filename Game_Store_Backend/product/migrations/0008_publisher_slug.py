# Generated by Django 5.0 on 2024-01-29 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0007_developer_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='publisher',
            name='slug',
            field=models.CharField(blank=True, max_length=110, null=True),
        ),
    ]