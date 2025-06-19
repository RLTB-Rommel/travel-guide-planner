import { updateWeather } from "./weather.js";

let adventureData = [];

async function fetchAdventureData() {
  if (adventureData.length === 0) {
    const res = await fetch("/assets/data/adventure-v3.json");
    //const res = await fetch("/data/adventure.json?t=" + Date.now());
    adventureData = await res.json();
  }
  return adventureData;
}

export async function renderAdventure(index = 0) {
  const data = await fetchAdventureData();
  const place = data[index];

  console.log("Selected adventure data:", place);
  updateWeather(place.latitude, place.longitude);

  // Favorite button
  const favoriteBtn = document.getElementById("adventure-favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");
      console.log(`Toggled favorite for: ${place.name}`);
    };
  }

  // Image setup
  const imageEl = document.getElementById("adventure-img");
  imageEl.src = place.image;
  imageEl.alt = place.name;

  imageEl.onclick = () => {
    console.log("Adventure map loaded");

    // Ensure place has coordinates
    if (!place.latitude || !place.longitude) {
      alert("This location does not have coordinates.");
      return;
    }

    // Update map info
    document.getElementById("map-info-text").innerHTML = `
      <h3>${place.name}</h3>
      <p><strong>Location:</strong> ${place.location}</p>
    `;

    if (window.myMap) {
      window.myMap.remove();
    }

    window.myMap = L.map("leaflet-map", {
      center: [place.latitude, place.longitude],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

  // Update card fields
  document.getElementById("adventure-category").textContent = "Adventure";
  document.getElementById("adventure-name").textContent = place.name;
  document.getElementById("adventure-stars").textContent =
    "⭐".repeat(Math.floor(place.stars)) +
    (place.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("adventure-desc").textContent = place.description;
  document.getElementById("adventure-price").textContent = place.price;

  // Website link
  const linkEl = document.getElementById("adventure-link");
  linkEl.href = "#";
  linkEl.textContent = new URL(place.website).hostname;
  linkEl.onclick = (e) => {
    e.preventDefault();
    openPopup("popup-contact");
  };
}

export function setupAdventureRadio() {
  const radios = document.querySelectorAll('input[name="adventure"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderAdventure(parseInt(e.target.value));
    });
  });
}