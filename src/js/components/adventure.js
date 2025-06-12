let adventureData = [];

async function fetchAdventureData() {
  if (adventureData.length === 0) {
    const res = await fetch("/data/adventure.json");
    adventureData = await res.json();
  }
  return adventureData;
}

export async function renderAdventure(index = 0) {
  const data = await fetchAdventureData();
  const place = data[index];

  // Favorite button (optional, if added in HTML)
  const favoriteBtn = document.getElementById("adventure-favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");
      console.log(`Toggled favorite for: ${place.name}`);
    };
  }

  // DOM Updates
  document.getElementById("adventure-img").src = place.image;
  document.getElementById("adventure-img").alt = place.name;
  document.getElementById("adventure-category").textContent = "Adventure";
  document.getElementById("adventure-name").textContent = place.name;
  document.getElementById("adventure-stars").textContent =
    "⭐".repeat(Math.floor(place.stars)) + (place.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("adventure-desc").textContent = place.description;
  document.getElementById("adventure-price").textContent = place.price;
  document.getElementById("adventure-link").href = place.website;
  document.getElementById("adventure-link").textContent = new URL(place.website).hostname;
}

export function setupAdventureRadio() {
  const radios = document.querySelectorAll('input[name="adventure"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderAdventure(parseInt(e.target.value));
    });
  });
}