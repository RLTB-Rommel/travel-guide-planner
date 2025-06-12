const diningData = await fetch("../data/dining.json").then(res => res.json());

export async function renderDining(index = 0) {
  const res = await fetch("/data/dining.json");
  const data = await res.json();
  const restaurant = data[index];

  const img = document.getElementById("dining-img");
  img.src = restaurant.image;
  img.alt = restaurant.name;

  document.getElementById("dining-name").textContent = restaurant.name;
  document.getElementById("dining-stars").textContent =
    "⭐".repeat(Math.floor(restaurant.stars)) + (restaurant.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("dining-desc").textContent = restaurant.description;
  document.getElementById("dining-price").textContent = restaurant.price;
  document.getElementById("dining-link").href = restaurant.website;
  document.getElementById("dining-link").textContent = new URL(restaurant.website).hostname;

export function setupDiningRadio() {
  const radios = document.querySelectorAll('input[name="dining"]');
  radios.forEach(radio => {
    radio.addEventListener("change", e => {
      renderDining(parseInt(e.target.value));
    });
  });
}