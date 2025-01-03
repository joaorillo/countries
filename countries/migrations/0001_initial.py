# Generated by Django 5.1.2 on 2024-12-25 18:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('official_name', models.CharField(max_length=100)),
                ('continents', models.CharField(max_length=100)),
                ('population', models.PositiveIntegerField()),
                ('area', models.PositiveIntegerField()),
                ('capital', models.CharField(max_length=100)),
                ('languages', models.CharField(max_length=100)),
                ('currencies', models.CharField(max_length=100)),
                ('flagUrl', models.URLField()),
            ],
        ),
    ]
