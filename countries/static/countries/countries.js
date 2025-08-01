let openedBox;
let countriesList = [];
let allCountries = {};
let selectedContinents = []
let selectedLanguages = []
let selectedCurrencies = []
let countriesOrder = []

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch Countries API when page loaded 
    try {
        const response = await fetch(
            'https://restcountries.com/v3.1/all?fields=name,continents,population,area,languages,currencies,flags'
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    // Reorder countries alphabetically
    data.sort((a, b) => {
        if (a.name.common < b.name.common) return -1;
        if (a.name.common > b.name.common) return 1;
        return 0; // If names are equal
    });

    // Initialize empty arrays to collect filters
    let allContinents = [];
    let allLanguages = [];
    let allCurrencies = [];

    // Append results (countries) to HTML
    const container = document.getElementById('all-countries-container');
    data.forEach(countryData => {
        // Create country container
        const countryBox = document.createElement('div');
        countryBox.classList.add('country-box', 'collapsed');
        container.appendChild(countryBox);
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('title-div');
        countryBox.appendChild(titleDiv);
        // Create country image (flag)
        const countryImg = document.createElement('img');
        countryImg.classList.add('flag');
        const countryFlag = countryData.flags.png;
        countryImg.src = countryFlag;
        titleDiv.append(countryImg);
        // Create country title
        const countryTitle = document.createElement('h6');
        countryTitle.classList.add('country-name');
        const countryName = countryData.name.common;
        countryBox.setAttribute('id', countryName);
        countriesList.push(countryName);
        countryTitle.textContent = `${countryName}`;
        titleDiv.appendChild(countryTitle);
        // Create expand button
        const collapseButton = document.createElement('button');
        collapseButton.classList.add('btn', 'collapse-expand-btn');
        titleDiv.appendChild(collapseButton);
        const collapseButtonIcon = document.createElement('i');
        collapseButtonIcon.classList.add('fas', 'fa-chevron-down');
        collapseButton.appendChild(collapseButtonIcon);
        // Define country box expansion when clicked
        countryBox.onclick = () => {toggleCountry(countryBox)};
        // Save country's continent on a list with all continents
        for (const continent of countryData.continents) {
            if (!allContinents.includes(continent)) {
                allContinents.push(continent);
            }
        }
        // Save country's language on a list with all languages
        for (const language of Object.values(countryData.languages ?? {})) {
            if (!allLanguages.includes(language)) {
                allLanguages.push(language);
            }
        }
        // Save country's currency on a list with all currencies
        for (const currency of Object.keys(countryData.currencies ?? {})) {
            const currencySymbol = countryData.currencies[currency]?.symbol;
            if (currencySymbol && !allCurrencies.includes(`${currency} (${currencySymbol})`)) {
                allCurrencies.push(`${currency} (${currencySymbol})`);
            }
        }
        // Save country's info on a list with all countries
        allCountries[countryName] = {
            officialName: countryData.name?.official ?? '-',
            continents: countryData.continents?.join(', ') ?? '-',
            population: countryData.population ?? '-',
            area: countryData.area ?? '-',
            capital: countryData.capital?.join(', ') ?? '-',
            languages: countryData.languages ? Object.values(countryData.languages).join(', ') : '-',
            currencies: countryData.currencies 
                ? Object.entries(countryData.currencies)
                    .map(([abbreviation, currency]) => {
                        const symbol = currency.symbol || '';
                        return `${abbreviation} (${symbol})`;
                    }).join(', ') 
                : '-',
            flagUrl: countryData.flags.png ?? '-'
        };
    });

    // Create all countries instances
    createAllCountries();

    // Reorder lists and initializes selected filters' lists
    allContinents.sort();
    selectedContinents = allContinents;
    allLanguages.sort();
    selectedLanguages = allLanguages;
    allCurrencies.sort();
    selectedCurrencies = allCurrencies;
    // Generate the 'filters box' continents options
    const continentFragment = document.createDocumentFragment();
    allContinents.forEach((continent, index) => {
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-continent-${index + 1}`;
        checkbox.name = 'continent';
        checkbox.value = continent;
        checkbox.checked = true;
        checkbox.addEventListener('click', () => {
            applyFilter('continent', continent);
        })
        // Create the label
        const label = document.createElement('label');
        label.setAttribute('for', `filter-continent-${index + 1}`);
        label.textContent = continent;
        // Create a div with checkbox + label
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        // Append the container to the DocumentFragment
        continentFragment.appendChild(div);
    })
    const filterContinentDiv = document.getElementById('filter-continent');
    filterContinentDiv.appendChild(continentFragment);
    // Generate the 'filters box' languages options
    const languageFragment = document.createDocumentFragment();
    allLanguages.forEach((language, index) => {
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-language-${index + 1}`;
        checkbox.name = 'language';
        checkbox.value = language;
        checkbox.checked = true;
        checkbox.addEventListener('click', () => {
            applyFilter('language', language)
        });
        // Create the label
        const label = document.createElement('label');
        label.setAttribute('for', `filter-language-${index + 1}`);
        label.textContent = language;
        // Create a div with checkbox + label
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        // Append the container to the DocumentFragment
        languageFragment.appendChild(div);
    })
    const filterLanguageDiv = document.getElementById('filter-language');
    filterLanguageDiv.appendChild(languageFragment);
    // Generate the 'filters box' currencies options
    const currencyFragment = document.createDocumentFragment();
    allCurrencies.forEach((currency, index) => {
        // Create the checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-currency-${index + 1}`;
        checkbox.name = 'currency';
        checkbox.value = currency;
        checkbox.checked = true;
        checkbox.addEventListener('click', () => {
            applyFilter('currency', currency)
        });
        // Create the label
        const label = document.createElement('label');
        label.setAttribute('for', `filter-currency-${index + 1}`);
        label.textContent = currency;
        // Create a div with checkbox + label
        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        // Append the container to the DocumentFragment
        currencyFragment.appendChild(div);
    })
    const filterCurrencyDiv = document.getElementById('filter-currency');
    filterCurrencyDiv.appendChild(currencyFragment);
    const filtersBox = document.getElementById('filters-box-options-div');
        const inputElements = filtersBox.querySelectorAll('input');

    // Add functionality to 'Select all' and 'Unselect all' filters
    selectAllFilters = document.getElementById('select-all-filters');
    selectAllFilters.addEventListener('click', () => {
        inputElements.forEach((input) => {
            if (!input.checked) {
                input.click();
            }
        });
    })
    unselectAllFilters = document.getElementById('unselect-all-filters');
    unselectAllFilters.addEventListener('click', () => {
        inputElements.forEach((input) => {
            if (input.checked) {
                input.click();
            }
        });
    })

    // Add sorting functionality
    const sortBtn = document.getElementById('sort-btn');
    const sortOptionsBox = document.getElementById('sort-options-box');
    sortBtn.addEventListener('click', () => {
        if (!sortBtn.classList.contains('deactivated')) {
            sortOptionsBox.style.display = sortOptionsBox.style.display === 'block' ? 'none' : 'block';
        }
    });
    sortOptionsBox.querySelectorAll('button').forEach(option => {
        option.addEventListener('click', () => {
            const order = option.getAttribute('data-order');
            sortOptionsBox.style.display = 'none';
            sortOptionsBox.querySelectorAll('button').forEach(button => {
                button.classList.remove('selected');
            });
            option.classList.add('selected');
            if (option.id == 'sort-alphabetically-asc') {
                countriesOrder = Object.keys(allCountries).sort();
            } else if (option.id == 'sort-alphabetically-desc') {
                countriesOrder = Object.keys(allCountries).sort((a, b) => b.localeCompare(a));
            } else if (option.id == 'sort-area-asc') {
                countriesOrder = Object.entries(allCountries)
                    .sort(([, dataA], [, dataB]) => dataA.area - dataB.area)
                    .map(([countryName]) => countryName); 
            } else if (option.id == 'sort-area-desc') {
                countriesOrder = Object.entries(allCountries)
                .sort(([, dataA], [, dataB]) => dataB.area - dataA.area)
                .map(([countryName]) => countryName);
            } else if (option.id == 'sort-population-asc') {
                countriesOrder = Object.entries(allCountries)
                    .sort(([, dataA], [, dataB]) => dataA.population - dataB.population)
                    .map(([countryName]) => countryName); 
            } else if (option.id == 'sort-population-desc') {
                countriesOrder = Object.entries(allCountries)
                    .sort(([, dataA], [, dataB]) => dataB.population - dataA.population)
                    .map(([countryName]) => countryName);
            }
            const allCountriesContainer = document.getElementById('all-countries-container');
            const countryBoxes = Array.from(allCountriesContainer.getElementsByClassName('country-box'));
            countryBoxes.sort((a, b) => {
                const countryNameA = a.id;
                const countryNameB = b.id;
                const indexA = countriesOrder.indexOf(countryNameA);
                const indexB = countriesOrder.indexOf(countryNameB);
                return indexA - indexB;
            });
            countryBoxes.forEach(box => {
                allCountriesContainer.appendChild(box);
            });
        });
    });
    document.addEventListener('click', (event) => {
        if (!sortBtn.contains(event.target) && !sortOptionsBox.contains(event.target)) {
            sortOptionsBox.style.display = 'none';
        }
    })

    // Add search bar functionality
    let typingTimer;
    const typingDelay = 400;
    const searchBarInput = document.getElementById('search-bar-input');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const noQuery = document.getElementById('no-query');
    searchBarInput.addEventListener('input', function() {
        clearTimeout(typingTimer);
        const inputValue = this.value;
        if (inputValue.length >= 3) {
            noQuery.classList.add('d-none');
            typingTimer = setTimeout(() => {
                search(inputValue);
            }, typingDelay);
        } else if (inputValue.length >= 1) {
            noQuery.classList.remove('d-none');
            closeSearchBtn.classList.remove('d-none');
            hideAllCountries();
        } else {
            noQuery.classList.add('d-none');
            closeSearchBtn.classList.add('d-none');
            showAllCountries();
        }
    });
    searchBarInput.addEventListener('click', function() {
        const inputValue = this.value;
        if (inputValue.length < 3) {
            noQuery.classList.remove('d-none');
            hideAllCountries();
        }
        closeSearchBtn.classList.remove('d-none');
    });
    searchBarInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = this.value;
            if (inputValue.length >= 3) {
                search(inputValue);
            }
        }
    });
    closeSearchBtn.addEventListener('click', () => {
        searchBarInput.value = '';
        noQuery.classList.add('d-none');
        closeSearchBtn.classList.add('d-none');
        showAllCountries();
    });

    // Add filters functionality
    const filtersBtn = document.getElementById('filters-btn');
    filtersBtn.addEventListener('click', () => {
        toggleFiltersSidepanel();
    })
    const backdrop = document.getElementById('backdrop');
    backdrop.addEventListener('click', () => {
        toggleFiltersSidepanel();
    })
    const filtersBoxCloseBtn = document.getElementById('filters-box-close-btn');
    filtersBoxCloseBtn.addEventListener('click', () => {
        toggleFiltersSidepanel();
    })
})

// Function to hide / unhide elements given a filter option that was clicked
function applyFilter(type, value) {
    // Update the corresponding 'selected filters' list
    if (type == 'continent') {
        if (!selectedContinents.includes(value)) {
            selectedContinents.push(value);
        } else {
            selectedContinents = selectedContinents.filter(item => item !== value);
        }
    } else if (type == 'language') {
        if (!selectedLanguages.includes(value)) {
            selectedLanguages.push(value);
        } else {
            selectedLanguages = selectedLanguages.filter(item => item !== value);
        }
    } else {
        if (!selectedCurrencies.includes(value)) {
            selectedCurrencies.push(value);
        } else {
            selectedCurrencies = selectedCurrencies.filter(item => item !== value);
        }
    }
    // Filter corresponding countries
    for (const countryName in allCountries) {
        const country = allCountries[countryName];

        // Check continents
        const countryContinents = country.continents || '';
        const countryContinentsArray = countryContinents.split(',').map(continent => continent.trim());
        const anyMatchingContinent = countryContinentsArray.some(continent => selectedContinents.includes(continent));

        // Check languages
        const countryLanguages = country.languages || '';
        const countryLanguagesArray = countryLanguages.split(',').map(language => language.trim());
        const anyMatchingLanguage = countryLanguagesArray.some(language => selectedLanguages.includes(language));

        // Check currencies
        const countryCurrencies = country.currencies;
        const countryCurrenciesArray = countryCurrencies.split(',').map(currency => currency.trim());
        const anyMatchingCurrency = countryCurrenciesArray.some(currency => selectedCurrencies.includes(currency));

        // Toggle visibility of country box (and their search 'clones')
        const countryBox = document.getElementById(countryName);
        const countryBoxSearch = document.getElementById(`${countryName}-search`);
        if (anyMatchingContinent && anyMatchingLanguage && anyMatchingCurrency) {
            countryBox.classList.remove('d-none');
            if (countryBoxSearch) {
                countryBoxSearch.classList.remove('d-none');
            }
        } else {
            countryBox.classList.add('d-none');
            if (countryBoxSearch) {
                countryBoxSearch.classList.add('d-none');
            }
        }
    }
}

// Function to fetch API endpoint to create all countries
async function createAllCountries() {
    try {
        const response = await fetch('/create_countries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(allCountries)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Failed to send countries:', error);
    }
}

// Function to expand a 'country box' to show country details
async function expandCountry(countryBox) {
    const countryTitle = countryBox.querySelector('.country-name');
    const countryName = countryTitle ? countryTitle.textContent : null;
    const countryData = await getCountryInfo(countryName);
    const officialName = countryData.official_name;
    const continents = countryData.continents;
    const population = countryData.population;
    const area = countryData.area;
    const capital = countryData.capital;
    const languages = countryData.languages;
    const currencies = countryData.currencies;
    const flagUrl = countryData.flag_url;
    // Create country box 'details' div with two columns for expanded box: 'Text' and 'Image' (flag)
    const countryBoxDetails = document.createElement('div');
    countryBoxDetails.classList.add('details', 'd-none');
    countryBox.appendChild(countryBoxDetails);
    const textColumn = document.createElement('div');
    textColumn.classList.add('column');
    countryBoxDetails.appendChild(textColumn);
    const imageColumn = document.createElement('div');
    imageColumn.classList.add('column', 'image-column');
    countryBoxDetails.appendChild(imageColumn);
    // Create 'Official Name' field
    const officialNameTag = document.createElement('p');
    officialNameTag.style.marginTop = '20px';
    officialNameTag.innerHTML = `<strong>Official Name:</strong> ${officialName}`;
    textColumn.appendChild(officialNameTag);
    // Create 'Continents' field
    const continentsTag = document.createElement('p');
    continentsTag.innerHTML = `<strong>Continents:</strong> ${continents}`;
    textColumn.appendChild(continentsTag);
    // Create 'Population' field
    const populationTag = document.createElement('p');
    populationTag.innerHTML = `<strong>Population:</strong> ${population.toLocaleString('de-DE')}`;
    textColumn.appendChild(populationTag);
    // Create 'Area' field
    const areaTag = document.createElement('p');
    areaTag.innerHTML = `<strong>Area:</strong> ${area.toLocaleString('de-DE')}km²`;
    textColumn.appendChild(areaTag);
    // Create 'Capital' field
    const capitalTag = document.createElement('p');
    capitalTag.innerHTML = `<strong>Capital:</strong> ${capital}`;
    textColumn.appendChild(capitalTag);
    // Create 'Languages' field
    const languagesTag = document.createElement('p');
    languagesTag.innerHTML = `<strong>Languages:</strong> ${languages}`;
    textColumn.appendChild(languagesTag);
    // Create 'Currencies' field
    const currenciesTag = document.createElement('p');
    currenciesTag.innerHTML = `<strong>Currencies:</strong> ${currencies}`;
    textColumn.appendChild(currenciesTag);
    // Create 'Image' (flag) field
    const flagTag = document.createElement('img');
    flagTag.src = flagUrl;
    imageColumn.appendChild(flagTag);
}

// Function to fetch API endpoint to get country's info given its name
async function getCountryInfo(countryName) {
    try {
        const response = await fetch(`/get_country_data/${countryName}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error('Failed to send countries:', error);
    }
}

// Function to hide all 'country boxes'
function hideAllCountries() {
    const allCountriesContainer = document.getElementById('all-countries-container');
    allCountriesContainer.classList.add('d-none');
    const searchContainer = document.getElementById('search-container');
    searchContainer.innerHTML = '';
    if (openedBox) {
        toggleCountry(openedBox);
    }
    const sortBtn = document.getElementById('sort-btn');
    sortBtn.classList.add('deactivated');
}

// Function to update 'country boxes' shown given a search query
function search(inputValue) {
    // Clears search results
    const searchContainer = document.getElementById("search-container");
    searchContainer.innerHTML = "";
    // Initializes empty list of countries that match the search query
    const matchedCountries = [];
    // Analyses each country to see if it matches the search query
    countriesList.forEach(country => {
        if (country.toLowerCase().startsWith(inputValue.toLowerCase())) {
            // Countries that start with the search query have priority 1
            matchedCountries.push({ country, priority: 1 });
        } else if (country.toLowerCase().includes(inputValue.toLowerCase())) {
            // Countries that only contain (do not start with) the search query have priority 2
            matchedCountries.push({ country, priority: 2 });
        }
    });
    // Sort matched countries given their priority
    matchedCountries.sort((a, b) => a.priority - b.priority);
    // Append matched countries' 'country boxes' to HTML
    matchedCountries.forEach(({ country }) => {
        const countryBox = document.getElementById(country);
        // Create a clone of the original 'country box' to be appended to HTML
        const clonedBox = countryBox.cloneNode(true);
        clonedBox.id = `${country}-search`;
        clonedBox.onclick = () => {toggleCountry(clonedBox)};
        // Append cloned 'country box' to HTML
        searchContainer.appendChild(clonedBox);
    });
}

// Function to show all 'country boxes'
function showAllCountries() {
    const allCountriesContainer = document.getElementById('all-countries-container');
    allCountriesContainer.classList.remove('d-none');
    const searchContainer = document.getElementById('search-container');
    searchContainer.innerHTML = '';
    const sortBtn = document.getElementById('sort-btn');
    sortBtn.classList.remove('deactivated');
}

// Function to toggle a given class of a given element
function toggleClass(element, classToToggle) {
    if (element.classList.contains(classToToggle)) {
        element.classList.remove(classToToggle);
    } else {
        element.classList.add(classToToggle);
    }
}

// Function to expand/collapse a 'country box'
async function toggleCountry(countryBox) {
    if (countryBox.classList.contains('collapsed')) {
        if (openedBox) {
            toggleCountry(openedBox);
        }
        if (!countryBox.querySelector('details')) {
            await expandCountry(countryBox);
        }
        openedBox = countryBox;
    } else {
        openedBox = null;
    }
    toggleClass(countryBox, 'collapsed');
    const countryBoxTitle = countryBox.querySelector('.country-name');
    toggleClass(countryBoxTitle, 'expanded');
    const countryBoxDetails = countryBox.querySelector('.details');
    toggleClass(countryBoxDetails, 'd-none');
    toggleTitleDiv(countryBox);
}

// Function to hide/unhide Filter Sidepanel (mobile-only)
function toggleFiltersSidepanel() {
    const filtersSidepanel = document.getElementById('filters-box');
    toggleClass(filtersSidepanel, 'active-sidepanel');
    const backdrop = document.getElementById('backdrop');
    toggleClass(backdrop, 'd-none');
}

// Function to toggle element of class 'title-div' inside of a 'country box'
function toggleTitleDiv (countryBox) {
    const titleDiv = countryBox.querySelector('.title-div');
    const flagTag = titleDiv.querySelector('.flag');
    const collapseButtonIcon = titleDiv.querySelector('.collapse-expand-btn i');
    toggleClass(flagTag, 'd-none');
    toggleClass(collapseButtonIcon, 'fa-chevron-down');
    toggleClass(collapseButtonIcon, 'fa-chevron-up');
}