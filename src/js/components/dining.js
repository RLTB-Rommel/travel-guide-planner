import { updateWeather } from "./weather.js";

let diningData = [];

async function fetchDiningData() {
  if (diningData.length === 0) {
    const res = await fetch("/data/dining-v2.json");
    diningData = await res.json();
  }
  return diningData;
}

export async function renderDining(index = 0) {
  const data = await fetchDiningData();
  const restaurant = data[index];

  console.log("Using lat/lng for weather:", restaurant.latitude, restaurant.longitude);

  updateWeather(restaurant.latitude, restaurant.longitude);

  // Favorite button
  const favoriteBtn = document.getElementById("favorite-btn");
  favoriteBtn.classList.remove("active");

  favoriteBtn.onclick = () => {
    favoriteBtn.classList.toggle("active");
    console.log(`Toggled favorite for: ${restaurant.name}`);
  };

  // Dynamic content
  const imageEl = document.getElementById("dining-img");
  imageEl.src = restaurant.image;
  imageEl.alt = restaurant.name;

  // Map popup on image click
  imageEl.onclick = () => {
    console.log("Map loaded");

    // Update info
    document.getElementById("map-info-text").innerHTML = `
      <h3>${restaurant.name}</h3>
      <p><strong>Location:</strong> ${restaurant.location}</p>
    `;

    // Remove previous map instance
    if (window.myMap) {
      window.myMap.remove();
      document.getElementById("leaflet-map").innerHTML = ""; // forcibly clear container
    }

    // Create new map centered on restaurant
    window.myMap = L.map("leaflet-map", {
      center: [restaurant.latitude, restaurant.longitude],
      zoom: 13,
      zoomControl: true
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.myMap);

    // Add marker and popup
    L.marker([restaurant.latitude, restaurant.longitude])
      .addTo(window.myMap)
      .bindPopup(restaurant.name)
      .openPopup();

    // Show the modal popup
    openPopup("popup-map");

    // Fix Leaflet rendering inside modal
    setTimeout(() => {
      window.myMap.invalidateSize();
      window.myMap.panTo([restaurant.latitude, restaurant.longitude]);
    }, 200);
  };

  // Dining info
  document.getElementById("dining-category").textContent = "Dining";
  document.getElementById("dining-name").textContent = restaurant.name;
  document.getElementById("dining-stars").textContent =
    "⭐".repeat(Math.floor(restaurant.stars)) +
    (restaurant.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("dining-desc").textContent = restaurant.description;
  document.getElementById("dining-price").textContent = restaurant.price;

  // Website link
  const linkEl = document.getElementById("dining-link");
  linkEl.href = "#"; // prevent default navigation
  linkEl.textContent = new URL(restaurant.website).hostname;
  linkEl.onclick = (e) => {
    e.preventDefault();
    openPopup("popup-contact");
  };

  // Setup radio buttons
  setupDiningRadio();
}

function setupDiningRadio() {
  const radios = document.querySelectorAll('input[name="dining"]');
  console.log("Found radios:", radios.length);

  if (radios.length === 0) {
    console.warn("No dining radio buttons found in DOM at this time.");
  }

  radios.forEach((radio) => {
    console.log("Attaching listener to", radio.value);
    radio.addEventListener("change", (e) => {
      console.log("Radio changed to index:", e.target.value);
      renderDining(parseInt(e.target.value));
    });
  });
}