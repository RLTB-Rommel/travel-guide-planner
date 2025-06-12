let educationalData = [];

async function fetchEducationalData() {
  if (educationalData.length === 0) {
    const res = await fetch("/data/educational.json");
    educationalData = await res.json();
  }
  return educationalData;
}

export async function renderEducational(index = 0) {
  const data = await fetchEducationalData();
  const place = data[index];

  // Favorite button (optional, if added in HTML)
  const favoriteBtn = document.getElementById("educational-favorite-btn");
  if (favoriteBtn) {
    favoriteBtn.classList.remove("active");
    favoriteBtn.onclick = () => {
      favoriteBtn.classList.toggle("active");
      console.log(`Toggled favorite for: ${place.name}`);
    };
  }

  // DOM Updates
  document.getElementById("educational-img").src = place.image;
  document.getElementById("educational-img").alt = place.name;
  document.getElementById("educational-category").textContent = "Educational";
  document.getElementById("educational-name").textContent = place.name;
  document.getElementById("educational-stars").textContent =
    "⭐".repeat(Math.floor(place.stars)) + (place.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("educational-desc").textContent = place.description;
  document.getElementById("educational-price").textContent = place.price;
  document.getElementById("educational-link").href = place.website;
  document.getElementById("educational-link").textContent = new URL(place.website).hostname;
}

export function setupEducationalRadio() {
  const radios = document.querySelectorAll('input[name="educational"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderEducational(parseInt(e.target.value));
    });
  });
}