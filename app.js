// ===============================
// API CONFIG
// ===============================
const API_KEY = 'c436101a44ed081f07dbd6275d642aa3';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ===============================
// ELEMENT REFERENCES
// ===============================
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');

// ===============================
// FETCH WEATHER
// ===============================
async function getWeather(city) {

    showLoading();

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        // ✅ FIXED LINE
        const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

        const response = await axios.get(url);

        displayWeather(response.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            showError("City not found ❌");
        } else if (error.response && error.response.status === 401) {
            showError("Invalid API Key ⚠️");
        } else {
            showError("Something went wrong!");
        }

    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// ===============================
// DISPLAY WEATHER
// ===============================
function displayWeather(data) {

    const html = `
        <div class="weather-info">
            <h2>${data.name}</h2>
            <img class="weather-icon" 
                 src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p>${data.weather[0].description}</p>
        </div>
    `;

    weatherDisplay.innerHTML = html;
}

// ===============================
// LOADING UI
// ===============================
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
}

// ===============================
// ERROR UI
// ===============================
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

// ===============================
// EVENTS
// ===============================
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// ===============================
// DEFAULT LOAD
// ===============================
getWeather("Bengaluru");
