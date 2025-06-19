import { renderDining } from './components/dining.js';
import { renderAttractions, setupAttractionsRadio } from './components/attractions.js';
import { renderAdventure, setupAdventureRadio } from './components/adventure.js';
import { renderEducational, setupEducationalRadio } from './components/educational.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initial render of all cards
  renderDining(0);
  renderAttractions(0);
  renderAdventure(0);
  renderEducational(0);

  // Set up individual radio handlers
  //setupDiningRadio();
  setupAttractionsRadio();
  setupAdventureRadio();
  setupEducationalRadio();

  // Setup shared radio selection listener for displaying card name
  setupSelectedEstablishmentDisplay();

  // Start geolocation and show result in #active-location-name
  detectUserLocation();
});

function setupSelectedEstablishmentDisplay() {
  const radioGroups = ['dining', 'attractions', 'adventure', 'educational'];
  radioGroups.forEach(group => {
    document.querySelectorAll(`input[name="${group}"]`).forEach((radio) => {
      radio.addEventListener('change', () => {
        const titleEl = document.getElementById(`${group}-name`);
        if (titleEl) {
          document.getElementById('selected-establishment').innerText = titleEl.textContent;
        }
      });
    });
  });
}

function detectUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    document.getElementById("active-location-name").innerText = "Not supported";
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  reverseGeocode(lat, lon);
}

function error() {
  document.getElementById("active-location-name").innerText = "Unavailable";
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    const components = data.address;
    const city = components.city || components.town || components.village || components.state || "Unknown";
    document.getElementById("active-location-name").innerText = city;
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    document.getElementById("active-location-name").innerText = "Error";
  }
}