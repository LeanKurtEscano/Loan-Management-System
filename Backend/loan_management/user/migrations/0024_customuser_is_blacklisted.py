# Generated by Django 5.1.6 on 2025-07-14 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0023_customuser_suffix'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_blacklisted',
            field=models.BooleanField(default=False),
        ),
    ]
