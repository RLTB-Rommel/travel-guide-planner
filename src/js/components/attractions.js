import { updateWeather } from "./weather.js";
import { addToCart } from './cart.js';

let attractionsData = [];


async function fetchAttractionsData() {
  if (attractionsData.length === 0) {
    const res = await fetch("/assets/data/attractions-v3.json");
    attractionsData = await res.json();
  }
  return attractionsData;
}

export async function renderAttractions(index = 0) {
  const data = await fetchAttractionsData();
  const place = data[index];
  console.log("Selected attraction data:", place);
  updateWeather(place.latitude, place.longitude);

  // Favorite button (optional)
   const favoriteBtn = document.getElementById("favorite-btn");
   if (favoriteBtn) {
     favoriteBtn.classList.remove("active");
     favoriteBtn.onclick = () => {
       favoriteBtn.classList.toggle("active");

       addToCart({
         name: restaurant.name,
         price: restaurant.price,
         category: "Dining",
         timestamp: new Date().toISOString()
       });

       console.log(`Added to cart: ${restaurant.name}`);
     };
   }

  // Update image and bind map click
  const imageEl = document.getElementById("attractions-img");
  imageEl.src = place.image;
  imageEl.alt = place.name;

  imageEl.onclick = () => {
    console.log("Attractions map loaded");

    document.getElementById("map-info-text").innerHTML = `
      <h3>${place.name}</h3>
      <p><strong>Location:</strong> ${place.location}</p>
    `;

    if (window.myMap) {
      window.myMap.remove();
    }

    console.log("Lat:", place.latitude, "Lng:", place.longitude);

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

  // Update info content
  document.getElementById("attractions-category").textContent = "Attractions";
  document.getElementById("attractions-name").textContent = place.name;
  document.getElementById("attractions-stars").textContent =
    "⭐".repeat(Math.floor(place.stars)) +
    (place.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("attractions-desc").textContent = place.description;
  document.getElementById("attractions-price").textContent = place.price;

  const linkEl = document.getElementById("attractions-link");
  linkEl.href = "#";
  linkEl.textContent = new URL(place.website).hostname;
  linkEl.onclick = (e) => {
    e.preventDefault();
    openPopup("popup-contact");
  };
}

export function setupAttractionsRadio() {
  const radios = document.querySelectorAll('input[name="attractions"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderAttractions(parseInt(e.target.value));
    });
  });
}