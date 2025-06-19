import { updateWeather } from "./weather.js";

let diningData = [];

async function fetchDiningData() {
  if (diningData.length === 0) {
    try {
      const res = await fetch("/assets/data/dining-v3.json");
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON structure: Expected an array.");
      }

      diningData = data;
      console.log("Dining data loaded:", diningData);
    } catch (error) {
      console.error("Failed to load dining data:", error.message);
    }
  }
  return diningData;
}

export async function renderDining(index = 0) {
  const data = await fetchDiningData();
  const restaurant = data[index];

  console.log("Using lat/lng for weather:", restaurant.latitude, restaurant.longitude);
  updateWeather(restaurant.latitude, restaurant.longitude);

  const favoriteBtn = document.getElementById("favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");
      console.log(`Toggled favorite for: ${restaurant.name}`);
    };
  }

  const imageEl = document.getElementById("dining-img");
  imageEl.src = restaurant.image;
  imageEl.alt = restaurant.name;

  imageEl.onclick = () => {
    console.log("Map loaded");
    document.getElementById("map-info-text").innerHTML = `
      <h3>${restaurant.name}</h3>
      <p><strong>Location:</strong> ${restaurant.location}</p>
    `;

    if (window.myMap) {
      window.myMap.remove();
      document.getElementById("leaflet-map").innerHTML = "";
    }

    window.myMap = L.map("leaflet-map", {
      center: [restaurant.latitude, restaurant.longitude],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(window.myMap);

    L.marker([restaurant.latitude, restaurant.longitude])
      .addTo(window.myMap)
      .bindPopup(restaurant.name)
      .openPopup();

    openPopup("popup-map");

    setTimeout(() => {
      window.myMap.invalidateSize();
      window.myMap.panTo([restaurant.latitude, restaurant.longitude]);
    }, 200);
  };

  document.getElementById("dining-category").textContent = "Dining";
  document.getElementById("dining-name").textContent = restaurant.name;
  document.getElementById("dining-stars").textContent =
    "⭐".repeat(Math.floor(restaurant.stars)) +
    (restaurant.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("dining-desc").textContent = restaurant.description;
  document.getElementById("dining-price").textContent = restaurant.price;

  const linkEl = document.getElementById("dining-link");
  linkEl.href = "#";
  linkEl.textContent = new URL(restaurant.website).hostname;
  linkEl.onclick = (e) => {
    e.preventDefault();
    openPopup("popup-contact");
  };

  setupDiningRadio(); // ✅ good to leave this here
}

export function setupDiningRadio() { // ✅ export this
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