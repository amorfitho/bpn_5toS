# Generated by Django 5.2 on 2025-07-06 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agendar',
            name='tipo_edad',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
