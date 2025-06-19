export function updateInnerText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

export function updateImageSrc(id, url, alt = "") {
  const el = document.getElementById(id);
  if (el) {
    el.src = url;
    el.alt = alt;
  }
}

export async function updateWeather(latitude, longitude, placeName) {
  const apiKey = 'd36ad3e1b3f048fda9b132733251506'; // Replace with your key if needed
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    updateInnerText("current-temp", `${data.current.temp_c}°C`);
    updateInnerText("weather-location-value", data.location.name);
    updateInnerText("active-location-name", data.location.name);
    updateInnerText("selected-establishment", placeName);

    const icon = document.getElementById("weather-icon");
    if (icon) {
      icon.innerHTML = `<img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}" />`;
    }

    const forecast = document.getElementById("forecast-days");
    if (forecast) {
      forecast.innerHTML = data.forecast.forecastday.map(day => {
        const date = new Date(day.date);
        return `
          <div class="forecast-card">
            <p><strong>${date.toLocaleDateString('en-US', { weekday: 'short' })}</strong></p>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
            <p>${day.day.avgtemp_c}°C</p>
          </div>`;
      }).join('');
    }
  } catch (err) {
    console.error("Weather error:", err);
  }
}

export async function reverseGeocode(lat, lng) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data?.address?.city || data?.address?.town || data?.address?.village || data.display_name;
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return "Unknown location";
  }
}