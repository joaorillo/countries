import json
from .models import Country
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt



# Endpoint to create country instances given a JSON object of countries
@csrf_exempt
def create_countries(request):
    if request.method == 'POST':
        try:
            # Check payload
            data = json.loads(request.body)
            if not isinstance(data, dict):
                return JsonResponse({'error': 'Payload must be a dictionary of countries'}, status=400)
            
            # First, delete all existing countries
            Country.objects.all().delete()
            
            results = {
                'created': [],
                'errors': []
            }

            # Create all countries
            for country_name, country_data in data.items():
                try:
                    country = Country.objects.create(
                        name=country_name,
                        official_name=country_data.get('officialName', '-'),
                        continents=country_data.get('continents', '-'),
                        population=country_data.get('population', 0),
                        area=country_data.get('area', 0),
                        capital=country_data.get('capital', '-'),
                        languages=country_data.get('languages', '-'),
                        currencies=country_data.get('currencies', '-'),
                        flag_url=country_data.get('flagUrl', '-')
                    )
                    results['created'].append({'id': country.id, 'name': country.name})
                except Exception as e:
                    results['errors'].append({'name': country_name, 'error': str(e)})

            return JsonResponse(results, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)



# Endpoint to get country's data given its name
def get_country_data(request, country_name):
    try:
        # Retrieve the country by its name
        country = get_object_or_404(Country, name__iexact=country_name)
        
        # Return the country data as JSON
        country_data = {
            'name': country.name,
            'official_name': country.official_name,
            'continents': country.continents,
            'population': country.population,
            'area': country.area,
            'capital': country.capital,
            'languages': country.languages,
            'currencies': country.currencies,
            'flag_url': country.flag_url,
        }
        return JsonResponse(country_data, status=200)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)



# Endpoint to render the page
def index(request):
    return render(request, 'countries/index.html')
