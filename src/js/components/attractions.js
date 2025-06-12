let attractionsData = [];

async function fetchAttractionsData() {
  if (attractionsData.length === 0) {
    const res = await fetch("/data/attractions.json");
    attractionsData = await res.json();
  }
  return attractionsData;
}

export async function renderAttractions(index = 0) {
  const data = await fetchAttractionsData();
  const place = data[index];

  // Favorite toggle logic (optional if you want it per card)
  const favoriteBtn = document.getElementById("attractions-favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");
      console.log(`Toggled favorite for: ${place.name}`);
    };
  }

  // DOM updates
  document.getElementById("attractions-img").src = place.image;
  document.getElementById("attractions-img").alt = place.name;
  document.getElementById("attractions-category").textContent = "Attractions";
  document.getElementById("attractions-name").textContent = place.name;
  document.getElementById("attractions-stars").textContent =
    "⭐".repeat(Math.floor(place.stars)) + (place.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("attractions-desc").textContent = place.description;
  document.getElementById("attractions-price").textContent = place.price;
  document.getElementById("attractions-link").href = place.website;
  document.getElementById("attractions-link").textContent = new URL(place.website).hostname;
}

export function setupAttractionsRadio() {
  const radios = document.querySelectorAll('input[name="attractions"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderAttractions(parseInt(e.target.value));
    });
  });
}