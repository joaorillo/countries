import json
from .models import Country
from django.http import JsonResponse
from django.shortcuts import render
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
                        flagUrl=country_data.get('flagUrl', '-')
                    )
                    results['created'].append({'id': country.id, 'name': country.name})
                except Exception as e:
                    results['errors'].append({'name': country_name, 'error': str(e)})

            return JsonResponse(results, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)



# Endpoint to render the page
def index(request):
    return render(request, 'countries/index.html')
