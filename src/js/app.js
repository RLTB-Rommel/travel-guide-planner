import { renderDining } from './components/dining.js';
import { renderAttractions, setupAttractionsRadio } from './components/attractions.js';
import { renderAdventure, setupAdventureRadio } from './components/adventure.js';
import { renderEducational, setupEducationalRadio } from './components/educational.js';

document.addEventListener("DOMContentLoaded", () => {
  renderDining(0);               // includes setupDiningRadio()
  renderAttractions(0);
  setupAttractionsRadio();

  renderAdventure(0);
  setupAdventureRadio();

  renderEducational(0);
  setupEducationalRadio();
});