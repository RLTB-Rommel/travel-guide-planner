let educationalData = [];

async function fetchEducationalData() {
  if (educationalData.length === 0) {
    const res = await fetch("/data/educational-v2.json");
    educationalData = await res.json();
  }
  return educationalData;
}

export async function renderEducational(index = 0) {
  const data = await fetchEducationalData();
  const place = data[index];

  // Favorite button
  const favoriteBtn = document.getElementById("educational-favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");
      console.log(`Toggled favorite for: ${place.name}`);
    };
  }

  // Image and map popup
  const imageEl = document.getElementById("educational-img");
  if (imageEl) {
    imageEl.src = place.image;
    imageEl.alt = place.name;

    imageEl.onclick = () => {
      console.log("Map loaded");

      const infoText = document.getElementById("map-info-text");
      if (infoText) {
        infoText.innerHTML = `
          <h3>${place.name}</h3>
          <p><strong>Location:</strong> ${place.location}</p>
        `;
      }

      if (window.myMap) {
        window.myMap.remove();
      }

      window.myMap = L.map("leaflet-map", {
        center: [place.latitude, place.longitude],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // Content fields
  const nameEl = document.getElementById("educational-name");
  const starsEl = document.getElementById("educational-stars");
  const descEl = document.getElementById("educational-desc");
  const priceEl = document.getElementById("educational-price");
  const categoryEl = document.getElementById("educational-category");
  const linkEl = document.getElementById("educational-link");

  if (categoryEl) categoryEl.textContent = "Educational";
  if (nameEl) nameEl.textContent = place.name;
  if (descEl) descEl.textContent = place.description;
  if (priceEl) priceEl.textContent = place.price;
  if (starsEl) {
    const fullStars = "⭐".repeat(Math.floor(place.stars));
    const half = place.stars % 1 >= 0.5 ? "☆" : "";
    starsEl.textContent = fullStars + half;
  }
  if (linkEl) {
    linkEl.href = "#";
    linkEl.textContent = new URL(place.website).hostname;
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