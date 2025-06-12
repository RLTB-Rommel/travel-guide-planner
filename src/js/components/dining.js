const diningData = await fetch("../data/dining.json").then(res => res.json());

export function renderDining(index = 0) {
  const data = diningData[index];
  document.getElementById("dining-img").src = restaurant.image;
  document.getElementById("dining-name").textContent = data.name;
  document.getElementById("dining-stars").textContent = "⭐".repeat(Math.floor(data.stars)) + (data.stars % 1 >= 0.5 ? "☆" : "");
  document.getElementById("dining-desc").textContent = data.description;
  document.getElementById("dining-price").textContent = data.price;
  document.getElementById("dining-link").href = data.website;
  document.getElementById("dining-link").textContent = new URL(data.website).hostname;
}

export function setupDiningRadio() {
  const radios = document.querySelectorAll('input[name="dining"]');
  radios.forEach(radio => {
    radio.addEventListener("change", e => {
      renderDining(parseInt(e.target.value));
    });
  });
}