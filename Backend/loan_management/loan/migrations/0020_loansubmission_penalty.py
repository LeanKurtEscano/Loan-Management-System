# Generated by Django 5.1.6 on 2025-05-01 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loan', '0019_loansubmission_is_celebrate'),
    ]

    operations = [
        migrations.AddField(
            model_name='loansubmission',
            name='penalty',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
