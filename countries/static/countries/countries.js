let openedBox;
let countriesList = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch Countries API when page loaded 
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
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
    // Append results (countries) to HTML
    const container = document.getElementById('all-countries-container');
    data.forEach(item => {
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
        const countryFlag = item.flags.png;
        countryImg.src = countryFlag;
        titleDiv.append(countryImg);
        // Create country title
        const countryTitle = document.createElement('h6');
        countryTitle.classList.add('country-name');
        const countryName = item.name.common;
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
    });

    // Add search bar functionality
    let typingTimer;
    const typingDelay = 400;
    const searchBarInput = document.getElementById('search-bar-input');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const noQuery = document.getElementById('no-query');
    searchBarInput.addEventListener('input', function() {
        clearTimeout(typingTimer); // Reset the timer when the user presses a key
        const inputValue = this.value;
        if (inputValue.length >= 3) {
            noQuery.classList.add('d-none');
            typingTimer = setTimeout(() => {
                search(inputValue);
            }, typingDelay);
        } else if (inputValue.length >= 1) {
            noQuery.classList.remove('d-none');
            closeSearchBtn.classList.remove('d-none');
            hide_all_countries();
        } else {
            noQuery.classList.add('d-none');
            closeSearchBtn.classList.add('d-none');
            show_all_countries();
        }
        // Set a timeout to trigger the function after the user stops typing
    });
    searchBarInput.addEventListener('click', function() {
        const inputValue = this.value;
        if (inputValue.length < 3) {
            noQuery.classList.remove('d-none');
            hide_all_countries();
        }
        closeSearchBtn.classList.remove('d-none');
    });
    searchBarInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') { // If the user presses 'Enter', call the function immediately
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
        show_all_countries();
    });
})

function toggleClass(element, classToToggle) {
    if (element.classList.contains(classToToggle)) {
        element.classList.remove(classToToggle);
    } else {
        element.classList.add(classToToggle);
    }
}

async function toggleCountry(countryBox) {
    if (countryBox.classList.contains('collapsed')) {
        if (openedBox) {
            toggleCountry(openedBox);
        }
        if (!countryBox.querySelector('details')) {
            await expand_country(countryBox);
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

function toggleTitleDiv (countryBox) {
    const titleDiv = countryBox.querySelector('.title-div');
    const flagTag = titleDiv.querySelector('.flag');
    const collapseButtonIcon = titleDiv.querySelector('.collapse-expand-btn i');
    toggleClass(flagTag, 'd-none');
    toggleClass(collapseButtonIcon, 'fa-chevron-down');
    toggleClass(collapseButtonIcon, 'fa-chevron-up');
}

// Expand a country 'box' to show country details
async function expand_country(countryBox) {
    const countryTitle = countryBox.querySelector('.country-name');
    const countryName = countryTitle ? countryTitle.textContent : null;
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    const countryData = data[0];
    const officialName = countryData.name?.official ?? '-';
    const continents = countryData.continents?.join(', ') ?? '-';
    const population = countryData.population ?? '-';
    const area = countryData.area ?? '-';
    const capital = countryData.capital?.join(', ') ?? '-';
    const languages = countryData.languages ? Object.values(countryData.languages).join(', ') : '-';
    const currencies = countryData.currencies ?? '-';
    const flagUrl = countryData.flags.png ?? '-';
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
    areaTag.innerHTML = `<strong>Area:</strong> ${area.toLocaleString('de-DE')}m²`;
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
    let currenciesString;
    if (currencies === '-') {
        currenciesString = '-';
    } else {
        const currenciesList = [];
        for (const currencyCode in currencies) {
            currenciesList.push({
                currencyCode: currencyCode,
                symbol: currencies[currencyCode].symbol
            })
        }
        currenciesString = currenciesList
            .map(currency => `${currency.currencyCode} (${currency.symbol})`)
            .join(', ');
    }
    currenciesTag.innerHTML = `<strong>Currencies:</strong> ${currenciesString}`;
    textColumn.appendChild(currenciesTag);
    // Create 'Image' (flag) field
    const flagTag = document.createElement('img');
    flagTag.src = flagUrl;
    imageColumn.appendChild(flagTag);
}

function search(inputValue) {
    const matchedCountries = [];
    countriesList.forEach(country => {
        if (country.toLowerCase().startsWith(inputValue.toLowerCase())) {
            matchedCountries.push({ country, priority: 1 });
        } else if (country.toLowerCase().includes(inputValue.toLowerCase())) {
            matchedCountries.push({ country, priority: 2 });
        }
    });
    matchedCountries.sort((a, b) => a.priority - b.priority);
    const searchContainer = document.getElementById('search-container');
    matchedCountries.forEach(({ country }) => {
        const countryBox = document.getElementById(country);
        const clonedBox = countryBox.cloneNode(true);
        clonedBox.onclick = () => {toggleCountry(clonedBox)};
        searchContainer.appendChild(clonedBox);
    });
}

function hide_all_countries() {
    const allCountriesContainer = document.getElementById('all-countries-container');
    allCountriesContainer.classList.add('d-none');
    const searchContainer = document.getElementById('search-container');
    searchContainer.innerHTML = '';
    if (openedBox) {
        toggleCountry(openedBox);
    }
}

function show_all_countries() {
    const allCountriesContainer = document.getElementById('all-countries-container');
    allCountriesContainer.classList.remove('d-none');
    searchContainer.innerHTML = '';
}