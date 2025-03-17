const apiKey = '4ed9648cb7249148f63c0ed4d1acae3f';
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

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

    const dailyForecast = {};

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecast[date]) {
            dailyForecast[date] = item;
        }
    });

    for (const date in dailyForecast) {
        const item = dailyForecast[date];
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        forecastData.innerHTML += `
            <div class="forecast-item">
                <h3>${date}</h3>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>Temperature: ${item.main.temp}°C</p>
                <p>Description: ${item.weather[0].description}</p>
            </div>
        `;
    }
}