// ===============================
// WEATHER APP CONSTRUCTOR
// ===============================
function WeatherApp(apiKey) {
    this.apiKey = apiKey;

    this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

    this.searchBtn = document.getElementById("search-btn");
    this.cityInput = document.getElementById("city-input");
    this.weatherDisplay = document.getElementById("weather-display");

    this.init();
}

// ===============================
// INIT
// ===============================
WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

// ===============================
// WELCOME
// ===============================
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h2>🌍 Welcome to SkyFetch</h2>
            <p>Search any city to see current weather & 5-day forecast</p>
        </div>
    `;
};

// ===============================
// HANDLE SEARCH
// ===============================
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        this.showError("City name too short.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

// ===============================
// FETCH WEATHER + FORECAST
// ===============================
WeatherApp.prototype.getWeather = async function (city) {

    this.showLoading();

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    const currentUrl = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    const forecastUrl = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    try {

        const [currentRes, forecastRes] = await Promise.all([
            axios.get(currentUrl),
            axios.get(forecastUrl)
        ]);

        this.displayWeather(currentRes.data);
        this.displayForecast(forecastRes.data);

    } catch (error) {

        if (error.response && error.response.status === 404) {
            this.showError("City not found ❌");
        } else if (error.response && error.response.status === 401) {
            this.showError("Invalid API key ⚠️");
        } else {
            this.showError("Something went wrong!");
        }

    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = "🔍 Search";
    }
};

// ===============================
// DISPLAY CURRENT WEATHER
// ===============================
WeatherApp.prototype.displayWeather = function (data) {

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${data.name}</h2>
            <img class="weather-icon"
                src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p class="description">${data.weather[0].description}</p>
        </div>
    `;
};

// ===============================
// PROCESS FORECAST DATA
// ===============================
WeatherApp.prototype.processForecastData = function (data) {
    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );
    return daily.slice(0, 5);
};

// ===============================
// DISPLAY FORECAST
// ===============================
WeatherApp.prototype.displayForecast = function (data) {

    const dailyForecasts = this.processForecastData(data);

    const forecastHTML = dailyForecasts.map(day => {

        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    }).join("");

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">
            <h3 class="forecast-title">5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;
};

// ===============================
// LOADING UI
// ===============================
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Loading weather data...</p>
        </div>
    `;
};

// ===============================
// ERROR UI
// ===============================
WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <p>⚠️ ${message}</p>
        </div>
    `;
};

// ===============================
// CREATE INSTANCE
// ===============================
const app = new WeatherApp("c436101a44ed081f07dbd6275d642aa3");

// DEFAULT LOAD
app.getWeather("Bengaluru");
