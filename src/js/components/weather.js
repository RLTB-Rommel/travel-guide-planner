let isCelsius = true;
let currentCoords = { latitude: null, longitude: null };
let cachedWeatherData = null;

document.getElementById('unit-toggle')?.addEventListener('click', () => {
  isCelsius = !isCelsius;

  // 🔸 Only re-render using cached data — no re-fetching!
  if (cachedWeatherData) {
    renderWeather(cachedWeatherData);
  }
});

export async function updateWeather(lat, lng) {
  currentCoords.latitude = lat;
  currentCoords.longitude = lng;

  const apiKey = 'd36ad3e1b3f048fda9b132733251506';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=4`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    cachedWeatherData = data; // 🔹 Save the full weather data
    renderWeather(data);      // 🔹 Render immediately using this data

  } catch (err) {
    console.error("Weather API error:", err);
  }
}

// 🔻 NEW: renderWeather() only updates the UI without fetching again
function renderWeather(data) {
  const temp = isCelsius ? data.current.temp_c : data.current.temp_f;
  const unit = isCelsius ? "°C" : "°F";
  const condition = data.current.condition.text;
  const icon = data.current.condition.icon;
  const locationName = data.location.name;

  document.getElementById("current-temp").textContent = `${temp}${unit}`;
  document.getElementById("weather-location-value").textContent = locationName;
  document.getElementById("weather-condition").textContent = condition;
  document.getElementById("weather-icon").innerHTML = `<img src="https:${icon}" alt="${condition}" />`;

  // FORECAST (next 3 days)
  const forecastContainer = document.getElementById("forecast-days");
  forecastContainer.innerHTML = '';

  const forecastDays = data.forecast.forecastday.slice(1); // Exclude today
  forecastDays.forEach((day) => {
    const forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");

    const dayTemp = isCelsius ? day.day.avgtemp_c : day.day.avgtemp_f;
    const dayIcon = day.day.condition.icon;
    const dayCondition = day.day.condition.text;
    const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });

    forecastCard.innerHTML = `
      <h5>${dayName}</h5>
      <img src="https:${dayIcon}" alt="${dayCondition}" />
      <p>${dayTemp}${unit}</p>
      <p class="forecast-condition">${dayCondition}</p>
    `;

    forecastContainer.appendChild(forecastCard);
  });
}