import { fetchDiningData } from './ExternalServices.mjs';
import { fetchAdventureData } from './ExternalServices.mjs';
import { fetchAttractionData } from './ExternalServices.mjs';
import { fetchEducationalData } from './ExternalServices.mjs';
import { updateWeather } from './weather.js';
import { renderCard, attachRadioEvents } from './utils.mjs';

const searchBtn = document.getElementById('search-button');
const inputField = document.getElementById('location-input');

searchBtn.addEventListener('click', async () => {
  const input = inputField.value.trim();
  if (!input) return;

  const [city, country] = input.split(',').map(x => x.trim());
  if (!city || !country) return alert('Enter city and country as "City, Country"');

  // Load data from JSONs
  const [diningData, adventureData, attractionsData, educationalData] = await Promise.all([
    fetchDiningData(),
    fetchAdventureData(),
    fetchAttractionData(),
    fetchEducationalData()
  ]);

  const filterByLocation = (data) =>
    data.filter(item => item.city.toLowerCase() === city.toLowerCase() &&
                        item.country.toLowerCase() === country.toLowerCase());

  const filteredDining = filterByLocation(diningData);
  const filteredAdventure = filterByLocation(adventureData);
  const filteredAttraction = filterByLocation(attractionsData);
  const filteredEducational = filterByLocation(educationalData);

  // Render and attach events
  renderCard('dining', filteredDining);
  renderCard('adventure', filteredAdventure);
  renderCard('attractions', filteredAttraction);
  renderCard('educational', filteredEducational);

  attachRadioEvents('dining', filteredDining);
  attachRadioEvents('adventure', filteredAdventure);
  attachRadioEvents('attractions', filteredAttraction);
  attachRadioEvents('educational', filteredEducational);

  // Update weather panel using first dining coordinates if available
  if (filteredDining.length > 0) {
    updateWeather(filteredDining[0].latitude, filteredDining[0].longitude);
  }
});