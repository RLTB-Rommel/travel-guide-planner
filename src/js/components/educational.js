import { updateWeather } from "./weather.js";

let educationalData = [];

async function fetchEducationalData() {
  if (educationalData.length === 0) {
    const res = await fetch("/assets/data/educational-v3.json");
    educationalData = await res.json();
  }
  return educationalData;
}

export async function renderEducational(index = 0) {
  const data = await fetchEducationalData();
  const location = data[index];

  console.log("Selected educational data:", location);
  updateWeather(location.latitude, location.longitude);

  // Favorite button
  const favoriteBtn = document.getElementById("educational-favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");

      console.log(`Toggled favorite for: ${location.name}`);
    };
  }

  // Image and map popup
  const imageEl = document.getElementById("educational-img");
  if (imageEl) {
    imageEl.src = location.image;
    imageEl.alt = location.name;

    imageEl.onclick = () => {
      console.log("Map loaded");

      const infoText = document.getElementById("map-info-text");
      if (infoText) {
        infoText.innerHTML = `
          <h3>${location.name}</h3>
          <p><strong>Location:</strong> ${location.location}</p>
        `;
      }

      if (window.myMap) {
        window.myMap.remove();
      }

      window.myMap = L.map("leaflet-map", {
        center: [location.latitude, location.longitude],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(window.myMap);

      L.marker([location.latitude, location.longitude])
        .addTo(window.myMap)
        .bindPopup(location.name)
        .openPopup();

      openPopup("popup-map");

      setTimeout(() => {
        window.myMap.invalidateSize();
        window.myMap.panTo([location.latitude, location.longitude]);
      }, 200);
    };
  }

  // Content fields
  const nameEl = document.getElementById("educational-name");
  const starsEl = document.getElementById("educational-stars");
  const descEl = document.getElementById("educational-desc");
  const priceEl = document.getElementById("educational-price");
  const categoryEl = document.getElementById("educational-category");
  const linkEl = document.getElementById("educational-link");

  if (categoryEl) categoryEl.textContent = "Educational";
  if (nameEl) nameEl.textContent = location.name;
  if (descEl) descEl.textContent = location.description;
  if (priceEl) priceEl.textContent = location.price;
  if (starsEl) {
    const fullStars = "⭐".repeat(Math.floor(location.stars));
    const half = location.stars % 1 >= 0.5 ? "☆" : "";
    starsEl.textContent = fullStars + half;
  }
  if (linkEl) {
    linkEl.href = "#";
    linkEl.textContent = new URL(location.website).hostname;
    linkEl.onclick = (e) => {
      e.preventDefault();
      openPopup("popup-contact");
    };
  }
}

export function setupEducationalRadio() {
  const radios = document.querySelectorAll('input[name="educational"]');
  if (!radios.length) {
    console.warn("No educational radio buttons found.");
    return;
  }

  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const index = parseInt(e.target.value);
      renderEducational(index);
    });
  });

  console.log("Educational radio buttons initialized.");
}