# Capstone
Final Project - CS50web (2025)  
Single-app project in Django  
Author: João Pedro Nerone Rillo


## Distinctiveness and Complexity
This project was inspired by the projects developed along the course **CS50’s Web Programming with Python and JavaScript**. Neverthless, some of its specificities made it distinct and more complex to develop than these previous projects.  
Among these complexities, I point out:
- fetching a **real API**'s endpoints (REST Countries API);
- creating most of the HTML **dynamically**: the collapsed "country boxes" (containers containing each country's information) and their exapanded version when clicked;
- using a **local endpoint** to fetch and display a country's information when it is clicked: /get_country_data/${countryName};
- a **filtering system** which shows/hides countries based not on re-fetching the API, but on consulting the stored data 
collected on the original fetch (the filters are applied instantly, without requiring a form submission or anything similar);
- a **search engine** which, to optimize its response time, is based on _cloning_ the original country containers that match the specified search; this system automatically shows/hides countries on each character typed or deleted by user and shows results already ordered by the quality of the match (for instance, by typing "Ger" it shows "Germany" beofre "Algeria", even  though the african country comes first on an alphabetical order); also, the search engine works together with the filtering system;
- an **ordering system** which automatically re-order countries given the specified criteria and also works together with the filtering system;
- all of that on a **single-page** app, which does not require reloading the page for none of its functions to work.


## Project structure

### Countries (single-app)

This single-page app shows a list of all countries in the world, each of them with its most relevant information 
within its own container.  
Allows you to:
- scroll through a list of countries
- search for a specific country
- filter countries by their continents, languages or currencies
- order the filtered countries alphabetically, by area or population  

These are the main files of the app (all of them are located inside the /countries folder):  
- **views.py**: defines the views of the app;
- **urls.py**: defines the endpoints which will be used by _views.py_;
- **templates/countries/index.html**: contains the basic structure of the single-page HTML (which is filled dynamically);
- **static/countries.js**: the "heart" of the project, defines most of its functioning: fetches API's, dynamically fills the single-page HTML, defines the _filtering_, _ordering_ and _search_ systems, etc.;
- **static/styles.css**: defines the styles to be applied on the app.


## Initial setup

0) Make sure you have Python installed
```
python --version
```
1) Clone the repository
````
git clone https://github.com/joaorillo/countries.git
````
2) Create and activate a virtual environment; Install all requirements inside the environment
```
pip install -r requirements.txt
```
3) Run server (on root directory)
```
python manage.py runserver
```