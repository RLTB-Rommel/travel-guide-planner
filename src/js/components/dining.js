import { updateWeather } from "./weather.js";
import { addToCart } from './cart.js';

let diningData = [];

async function fetchDiningData() {
  if (diningData.length === 0) {
    try {
      const res = await fetch("/assets/data/dining-v3.json");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Expected array.");
      diningData = data;
    } catch (error) {
      console.error("Failed to load dining data:", error.message);
    }
  }
  return diningData;
}

export async function renderDining(index = 0) {
  const data = await fetchDiningData();
  const restaurant = data[index];

  // Update card content FIRST
  document.getElementById("dining-category").textContent = "Dining";
  document.getElementById("dining-name").textContent = restaurant.name;
  document.getElementById("dining-stars").textContent =
    "⭐".repeat(Math.floor(restaurant.stars)) +
    (restaurant.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("dining-desc").textContent = restaurant.description;
  document.getElementById("dining-price").textContent = `$${restaurant.price}`;
  
  const linkEl = document.getElementById("dining-link");
  linkEl.href = restaurant.website;
  linkEl.textContent = new URL(restaurant.website).hostname;
  linkEl.onclick = (e) => {
    e.preventDefault();
    openPopup("popup-contact");
  };

  // Update image
  const imageEl = document.getElementById("dining-img");
  imageEl.src = restaurant.image;
  imageEl.alt = restaurant.name;
  imageEl.onclick = () => {
    document.getElementById("map-info-text").innerHTML = `
      <h3>${restaurant.name}</h3>
      <p><strong>Location:</strong> ${restaurant.location}</p>`;
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
      attribution: '&copy; OpenStreetMap contributors'
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

  // ❤️ Attach or reattach popup confirmation logic
  const favoriteBtn = document.getElementById("favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = (e) => {
      const popup = document.getElementById("dining-confirm");
      if (!popup) {
        console.warn("Confirmation popup not found");
        return;
      }

      popup.style.left = `${e.pageX + 10}px`;
      popup.style.top = `${e.pageY + 10}px`;
      popup.classList.remove("hidden");

      const yesBtn = document.getElementById("dining-yes");
      const noBtn = document.getElementById("dining-no");

      yesBtn.onclick = () => {
        favoriteBtn.classList.add("active");
        addToCart({
          name: restaurant.name,
          price: restaurant.price,
          category: "Dining",
          timestamp: new Date().toISOString()
        });
        popup.classList.add("hidden");
        console.log(`Added to cart: ${restaurant.name}`);
      };

      noBtn.onclick = () => {
        popup.classList.add("hidden");
      };

      document.addEventListener("click", (event) => {
        if (!popup.contains(event.target) && event.target !== favoriteBtn) {
          popup.classList.add("hidden");
        }
      }, { once: true });
    };
  } else {
    console.warn("Favorite button not found");
  }

  setupDiningRadio();
}


export function setupDiningRadio() {
  const radios = document.querySelectorAll('input[name="dining"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderDining(parseInt(e.target.value));
    });
  });
}
