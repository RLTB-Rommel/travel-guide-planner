import { updateInnerText, updateImageSrc, updateWeather } from './utils.mjs';
//import { addToCart } from '../cart.js';
//import { addToCart } from '../cart.js';

let currentCoords = { latitude: null, longitude: null };
let diningData = [], adventureData = [], attractionsData = [], educationalData = [];

// Fetch JSON data once per category
async function fetchData(file, cache) {
  if (cache.length === 0) {
    const res = await fetch(`/assets/data/${file}`);
    cache.push(...(await res.json()));
  }
  return cache;
}

// Update the card UI
function updateCard(prefix, data, index) {
  if (!data || !data[index]) return;
  const place = data[index];

  updateInnerText(`${prefix}-name`, place.name);
  updateInnerText(`${prefix}-desc`, place.description);
  updateInnerText(`${prefix}-price`, place.price);
  updateInnerText(`${prefix}-stars`, '⭐'.repeat(Math.floor(place.stars)) + '☆');
  updateInnerText(`${prefix}-category`, prefix.charAt(0).toUpperCase() + prefix.slice(1));
  updateImageSrc(`${prefix}-img`, place.image, `${place.name} image`);


  const favoriteBtn = document.getElementById(`${prefix}-favorite-btn`);
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");

      addToCart({
        name: place.name,
        price: place.price,
        category: prefix.charAt(0).toUpperCase() + prefix.slice(1),
        timestamp: new Date().toISOString()
      });

      console.log(`Added to cart: ${place.name}`);
    };
  }  

  const imageEl = document.getElementById(`${prefix}-img`);
  if (imageEl) {
    imageEl.onclick = () => {
      const infoText = document.getElementById("map-info-text");
      if (infoText) {
        infoText.innerHTML = `
          <h3>${place.name}</h3>
          <p><strong>Location:</strong> ${place.location}</p>
      `  ;
      }

      if (window.myMap) {
        window.myMap.remove();
      }

      window.myMap = L.map("leaflet-map", {
        center: [place.latitude, place.longitude],
        zoom: 13,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(window.myMap);

      L.marker([place.latitude, place.longitude])
        .addTo(window.myMap)
        .bindPopup(place.name)
        .openPopup();

      openPopup("popup-map");

      setTimeout(() => {
        window.myMap.invalidateSize();
        window.myMap.panTo([place.latitude, place.longitude]);
      }, 200);
    };
  }

  const link = document.getElementById(`${prefix}-link`);
  if (link) {
    link.href = place.website;
    link.textContent = new URL(place.website).hostname;
  }

  // ❗ Only call updateWeather once — for the first card (Dining)
    if (prefix === "dining") {
     updateWeather(place.latitude, place.longitude, place.name);
     currentCoords.latitude = place.latitude;
     currentCoords.longitude = place.longitude;
     console.log("Weather updated for:", place.latitude, place.longitude);
    }
}

// Generate horizontal radio buttons dynamically
function generateRadioButtons(prefix, data) {
  const container = document.querySelector(`.${prefix}-radio`);
  if (!container) return;

  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '1rem';
  container.style.marginTop = '0.5rem';

  data.forEach((item, index) => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.fontSize = '0.85rem';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `${prefix}-options`;
    input.value = index;
    if (index === 0) input.checked = true;

    label.appendChild(input);
    //label.appendChild(document.createTextNode(` ${item.name}`));
    container.appendChild(label);
  });
}

// Attach event listeners to radios
function attachRadioListeners(prefix, data) {
  const radios = document.querySelectorAll(`.${prefix}-radio input[type="radio"]`);
  radios.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      updateCard(prefix, data, index);
      console.log(`${prefix} radio changed to index: ${index}`);
    });
  });
}

// Force-select and trigger the first radio
function activateFirstRadio(prefix) {
  const radios = document.querySelectorAll(`.${prefix}-radio input[type="radio"]`);
  if (radios.length > 0) {
    radios[0].checked = true;
    radios[0].dispatchEvent(new Event("change"));
  }
}

// Main search handler
document.getElementById("search-button").addEventListener("click", async () => {
  const input = document.getElementById("location-input").value.trim().toLowerCase();
  const [city, country] = input.split(',').map(s => s.trim().toLowerCase());

  // Reset caches
  diningData = [], adventureData = [], attractionsData = [], educationalData = [];

  const [dining, adventure, attractions, educational] = await Promise.all([
    fetchData("dining-v3.json", diningData),
    fetchData("adventure-v3.json", adventureData),
    fetchData("attractions-v3.json", attractionsData),
    fetchData("educational-v3.json", educationalData),
  ]);

  const match = (item) =>
    item &&
    typeof item.city === "string" &&
    typeof item.country === "string" &&
    item.city.toLowerCase() === city &&
    item.country.toLowerCase() === country;

  const filteredDining = dining.filter(match);
  const filteredAdventure = adventure.filter(match);
  const filteredAttractions = attractions.filter(match);
  const filteredEducational = educational.filter(match);

  // DYNAMIC RENDERING SECTION

  // Dining
  generateRadioButtons("dining", filteredDining);
  attachRadioListeners("dining", filteredDining);
  activateFirstRadio("dining");

  // Adventure
  generateRadioButtons("adventure", filteredAdventure);
  attachRadioListeners("adventure", filteredAdventure);
  activateFirstRadio("adventure");

  // Attractions
  generateRadioButtons("attractions", filteredAttractions);
  attachRadioListeners("attractions", filteredAttractions);
  activateFirstRadio("attractions");

  // Educational
  generateRadioButtons("educational", filteredEducational);
  attachRadioListeners("educational", filteredEducational);
  activateFirstRadio("educational");
});

function capitalize(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function loadLocationsToDatalist() {
  const files = ['dining-v3.json', 'adventure-v3.json', 'attractions-v3.json', 'educational-v3.json'];
  const datalist = document.getElementById('location-list');
  const uniqueLocations = new Set();

  for (const file of files) {
    try {
      const res = await fetch(`/assets/data/${file}`);
      const data = await res.json();

      data.forEach(item => {
        if (item.city && item.country) {
          const city = capitalize(item.city.trim());
          const country = capitalize(item.country.trim());
          uniqueLocations.add(`${city}, ${country}`);
        }
      });
    } catch (err) {
      console.error(`Failed to load ${file}`, err);
    }
  }

  // Populate datalist
  uniqueLocations.forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    datalist.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", loadLocationsToDatalist);
document.addEventListener("DOMContentLoaded", () => {
  loadLocationsToDatalist();
  document.getElementById("location-input").value = "Manila, Philippines";
  document.getElementById("search-button").click();
});