const apiKey = '4ed9648cb7249148f63c0ed4d1acae3f'; // استبدل YOUR_API_KEY بمفتاح API الخاص بك
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '401') {
                alert('Invalid API key. Please check your API key.');
            } else if (data.cod === '404') {
                alert('City not found. Please enter a valid city name.');
            } else {
                displayWeather(data);
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('An error occurred while fetching weather data.');
        });
});

function displayWeather(data) {
    const weatherData = document.getElementById('weather-data');
    if (data.sys && data.sys.country) {
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherData.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Description: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;
    } else {
        weatherData.innerHTML = `<p>Weather data not available for this city.</p>`;
    }
}