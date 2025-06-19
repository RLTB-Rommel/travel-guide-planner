let diningData = [];
let currentCoords = { latitude: null, longitude: null };

// Load dining.json data
fetch('/assets/data/dining-v3.json')
  .then(res => res.json())
  .then(data => {
    diningData = data;
    console.log("Raw dining data:", diningData);
    console.log("Available (normalized):", data.map(d => `${normalize(d.city)}, ${normalize(d.country)}`));
    populateLocationList(data);
  })
  .catch(err => console.error('Error loading dining data:', err));

// Populate <datalist> with City, Country options
function populateLocationList(data) {
  const datalist = document.getElementById('location-list');
  const seen = new Set();

  data.forEach(entry => {
    const key = `${entry.city}, ${entry.country}`;
    if (!seen.has(key)) {
      seen.add(key);
      const option = document.createElement('option');
      option.value = key;
      datalist.appendChild(option);
    }
  });
}

// Handle search click
document.getElementById('search-button').addEventListener('click', () => {
  const input = document.getElementById('location-input').value.trim();

  // Ensure input contains both city and country
  if (!input.includes(',')) {
    alert('Please enter a valid format like "Manila, Philippines".');
    return;
  }

  const [cityRaw, countryRaw] = input.split(',').map(s => s.trim());

  if (!cityRaw || !countryRaw) {
    alert('Both city and country must be provided.');
    return;
  }

  const city = cityRaw.toLowerCase();
  const country = countryRaw.toLowerCase();

  const filtered = diningData.filter(
    item => item.city.toLowerCase() === city && item.country.toLowerCase() === country
  );

  if (filtered.length === 0) {
    alert('No dining results found for this location.');
    return;
  }

  updateDiningCard(filtered);

  // Optional: update weather
  if (filtered[0].latitude && filtered[0].longitude) {
    updateWeather(filtered[0].latitude, filtered[0].longitude);
  }
});

// Update dining card with first matching result
function updateDiningCard(data) {
  const dining = data[0]; // Just show the first match for now

  document.getElementById('dining-img').src = dining.image;
  document.getElementById('dining-img').alt = dining.name;
  document.getElementById('dining-name').textContent = dining.name;
  document.getElementById('dining-stars').textContent = '⭐'.repeat(Math.floor(dining.stars));
  document.getElementById('dining-desc').textContent = dining.description;
  document.getElementById('dining-price').textContent = dining.price;
  document.getElementById('dining-link').href = dining.website;
  document.getElementById('selected-establishment').textContent = `${dining.name} (${dining.city}, ${dining.country})`;
}