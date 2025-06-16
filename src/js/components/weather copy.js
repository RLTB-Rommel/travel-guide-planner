let isCelsius = true;
let currentCoords = { latitude: 14.5995, longitude: 120.9842 }; // Default: Manila
const apiKey = 'd36ad3e1b3f048fda9b132733251506'; // Replace with your actual WeatherAPI key

export async function updateWeather(latitude, longitude) {
  if (!latitude || !longitude) {
    console.error("Invalid coordinates for weather:", latitude, longitude);
    return;
  }

  currentCoords = { latitude, longitude };

  console.log("Calling updateWeather with:", latitude, longitude);

  const unit = isCelsius ? 'C' : 'F';
  const query = `${latitude},${longitude}`;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=3`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`WeatherAPI error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;

    // Update DOM elements safely
    const tempEl = document.getElementById('current-temp');
    const iconEl = document.getElementById('weather-icon');
    const locationEl = document.getElementById('weather-location-value');
    const forecastEl = document.getElementById('forecast-days');

    if (tempEl && current) {
      tempEl.textContent = `${current[`temp_${unit.toLowerCase()}`]}° ${unit} - ${current.condition.text}`;
    }

    if (iconEl && current.condition.icon) {
      iconEl.innerHTML = `<img src="${current.condition.icon}" alt="Weather icon">`;
    }

    if (locationEl && location) {
      locationEl.textContent = `${location.name}, ${location.country}`;
    }

    if (forecastEl) {
      forecastEl.innerHTML = forecast
        .map(day => {
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
          return `
            <div>
              <strong>${dayName}</strong>
              <p>${day.day[`avgtemp_${unit.toLowerCase()}`]}°${unit} - ${day.day.condition.text}</p>
              <img src="${day.day.condition.icon}" alt="Icon" />
            </div>
          `;
        })
        .join('');
    }

  } catch (error) {
    console.error('Weather error:', error);
    const tempEl = document.getElementById('current-temp');
    const locationEl = document.getElementById('weather-location-value');
    if (tempEl) tempEl.textContent = 'Weather data not available.';
    if (locationEl) locationEl.textContent = 'Loading...';
  }
}

// Toggle temperature unit and refresh display
document.getElementById('unit-toggle')?.addEventListener('click', () => {
  isCelsius = !isCelsius;
  updateWeather(currentCoords.latitude, currentCoords.longitude);
});