from django.db import models



class Country (models.Model):
    name = models.CharField(max_length=100)
    official_name = models.CharField(max_length=100)
    continents = models.CharField(max_length=100)
    population = models.PositiveIntegerField()
    area = models.PositiveIntegerField()
    capital = models.CharField(max_length=100)
    languages = models.CharField(max_length=100)
    currencies = models.CharField(max_length=100)
    flagUrl = models.URLField(max_length=200)

    def __str__(self):
        return self.name
