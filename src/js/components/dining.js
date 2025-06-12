let diningData = [];

async function fetchDiningData() {
  if (diningData.length === 0) {
    const res = await fetch("/data/dining.json");
    diningData = await res.json();
  }
  return diningData;
}

export async function renderDining(index = 0) {
  const data = await fetchDiningData();
  const restaurant = data[index];

  const favoriteBtn = document.getElementById("favorite-btn");
  favoriteBtn.classList.remove("active");

  favoriteBtn.onclick = () => {
    favoriteBtn.classList.toggle("active");
    console.log(`Toggled favorite for: ${restaurant.name}`);
  };

  // Set all dynamic content
  document.getElementById("dining-img").src = restaurant.image;
  document.getElementById("dining-img").alt = restaurant.name;
  document.getElementById("dining-category").textContent = "Dining";
  document.getElementById("dining-name").textContent = restaurant.name;
  document.getElementById("dining-stars").textContent =
    "⭐".repeat(Math.floor(restaurant.stars)) +
    (restaurant.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("dining-desc").textContent = restaurant.description;
  document.getElementById("dining-price").textContent = restaurant.price;
  document.getElementById("dining-link").href = restaurant.website;
  document.getElementById("dining-link").textContent = new URL(
    restaurant.website
  ).hostname;
}

export function setupDiningRadio() {
  const radios = document.querySelectorAll('input[name="dining"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderDining(parseInt(e.target.value));
    });
  });
}