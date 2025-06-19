let diningData = [];

// Load dining.json data
fetch('/data/dining.json')
  .then(res => res.json())
  .then(data => {
    diningData = data;
    populateLocationList(data);
  })
  .catch(err => console.error('Error loading dining data:', err));

// Populate <datalist> with City, Country options
function populateLocationList(data) {
  const datalist = document.getElementById('location-list');
  const seen = new Set();

  data.forEach(entry => {
    const city = entry.city || '';
    const country = entry.country || '';
    const key = `${city}, ${country}`;
    if (city && country && !seen.has(key)) {
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
    item =>
      item.city?.toLowerCase() === city &&
      item.country?.toLowerCase() === country
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
  const dining = data[0];

  if (!dining) {
    console.warn('No valid dining entry found.');
    return;
  }

  console.log('Selected dining:', dining);

  document.getElementById('dining-img').src = dining.image || '';
  document.getElementById('dining-img').alt = dining.name || '';
  document.getElementById('dining-name').textContent = dining.name || 'Unknown';
  document.getElementById('dining-stars').textContent = '⭐'.repeat(Math.floor(dining.stars || 0));
  document.getElementById('dining-desc').textContent = dining.description || '';
  document.getElementById('dining-price').textContent = dining.price || '';
  document.getElementById('dining-link').href = dining.website || '#';

  const city = dining.city ?? 'Unknown City';
  const country = dining.country ?? 'Unknown Country';
  document.getElementById('selected-establishment').textContent = `${dining.name || 'Establishment'} (${city}, ${country})`;
}