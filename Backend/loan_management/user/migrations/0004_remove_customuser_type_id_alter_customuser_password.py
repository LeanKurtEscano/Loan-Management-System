# Generated by Django 5.1.6 on 2025-03-05 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_customuser_monthly_salary'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='type_id',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='password',
            field=models.CharField(max_length=300),
        ),
    ]
