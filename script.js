const apiKey = '4ed9648cb7249148f63c0ed4d1acae3f';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const unitToggle = document.getElementById('unit-toggle');
const suggestionsList = document.getElementById('suggestions');
let units = 'metric';

const capitals = [
    { ar: 'الرياض', en: 'Riyadh' },
    { ar: 'القاهرة', en: 'Cairo' },
    { ar: 'لندن', en: 'London' },
    { ar: 'باريس', en: 'Paris' },
    { ar: 'طوكيو', en: 'Tokyo' },
    { ar: 'نيويورك', en: 'New York' },
    { ar: 'دبي', en: 'Dubai' },
    { ar: 'الجزائر', en: 'Algiers' },
    { ar: 'بغداد', en: 'Baghdad' },
    { ar: 'الخرطوم', en: 'Khartoum' },
    { ar: 'الرباط', en: 'Rabat' },
    { ar: 'صنعاء', en: 'Sanaa' },
    { ar: 'تونس', en: 'Tunis' },
    { ar: 'مسقط', en: 'Muscat' },
    { ar: 'القدس', en: 'Jerusalem' },
    { ar: 'الدوحة', en: 'Doha' },
    { ar: 'بيروت', en: 'Beirut' },
    { ar: 'طرابلس', en: 'Tripoli' },
    { ar: 'عمان', en: 'Amman' },
    { ar: 'الكويت', en: 'Kuwait City' },
    { ar: 'أبو ظبي', en: 'Abu Dhabi' },
    { ar: 'المنامة', en: 'Manama' },
    { ar: 'مقديشو', en: 'Mogadishu' },
    { ar: 'نواكشوط', en: 'Nouakchott' },
    { ar: 'جوبا', en: 'Juba' },
    { ar: 'جيبوتي', en: 'Djibouti' },
    { ar: 'موروني', en: 'Moroni' },
    { ar: 'دمشق', en: 'Damascus' }
];

unitToggle.addEventListener('change', () => {
    units = unitToggle.checked ? 'imperial' : 'metric';
});

cityInput.addEventListener('input', () => {
    const inputValue = cityInput.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (inputValue.length > 0) {
        const filteredCapitals = capitals.filter(capital =>
            capital.ar.toLowerCase().startsWith(inputValue) ||
            capital.en.toLowerCase().startsWith(inputValue)
        );
        filteredCapitals.forEach(capital => {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = `${capital.ar} (${capital.en})`;
            suggestionItem.addEventListener('click', () => {
                cityInput.value = capital.en;
                suggestionsList.innerHTML = '';
            });
            suggestionsList.appendChild(suggestionItem);
        });
    }
});

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '401') {
                alert('Invalid API key. Please check your API key.');
            } else if (data.cod === '404') {
                alert('City not found. Please enter a valid city name.');
            } else {
                displayForecast(data);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching weather data.');
        });
});

function displayForecast(data) {
    const forecastData = document.getElementById('weather-data');
    forecastData.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];
    let todayData = null;
    const futureDays = {};

    if (data.list && Array.isArray(data.list)) {
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (date === today && !todayData) {
                todayData = item;
            } else if (date !== today) {
                if (!futureDays[date]) {
                    futureDays[date] = item;
                }
            }
        });

        if (todayData) {
            const iconCode = todayData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            forecastData.innerHTML += `
                <div class="today-forecast">
                    <h3>Today</h3>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p>Temperature: ${todayData.main.temp}°${units === 'metric' ? 'C' : 'F'}</p>
                    <p>Description: ${todayData.weather[0].description}</p>
                </div>
            `;
        }

        const forecastContainer = document.createElement('div');
        forecastContainer.className = 'forecast-container';

        for (const date in futureDays) {
            const item = futureDays[date];
            const iconCode = item.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            forecastContainer.innerHTML += `
                <div class="forecast-item">
                    <h3>${date}</h3>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p>Temperature: ${item.main.temp}°${units === 'metric' ? 'C' : 'F'}</p>
                    <p>Description: ${item.weather[0].description}</p>
                </div>
            `;
        }

        forecastData.appendChild(forecastContainer);
    } else {
        forecastData.innerHTML = '<p>No forecast data available.</p>';
    }
}