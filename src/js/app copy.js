import { renderDining, setupDiningRadio } from './components/dining.js';
import { renderAttractions, setupAttractionsRadio } from './components/attractions.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Dining card
  renderDining(0);
  setupDiningRadio();

  // Initialize Attractions card
  renderAttractions(0);
  setupAttractionsRadio();
});