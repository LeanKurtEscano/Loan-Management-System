# Generated by Django 5.1.6 on 2025-03-10 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_customuser_is_verified'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='middle_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
