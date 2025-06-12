import { renderDining, setupDiningRadio } from './components/dining.js';
import { renderAttractions, setupAttractionsRadio } from './components/attractions.js';
import { renderAdventure, setupAdventureRadio } from './components/adventure.js';
import { renderEducational, setupEducationalRadio } from './components/educational.js';

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Dining Card
  try {
    renderDining(0);
    setupDiningRadio();
  } catch (err) {
    console.warn("Dining card failed to initialize:", err);
  }

  // Initialize Attractions Card
  try {
    renderAttractions(0);
    setupAttractionsRadio();
  } catch (err) {
    console.warn("Attractions card failed to initialize:", err);
  }

  // Initialize Adventure Card
  try {
    renderAdventure(0);
    setupAdventureRadio();
  } catch (err) {
    console.warn("Adventure card failed to initialize:", err);
  }

  // Initialize Educational Card
  try {
    renderEducational(0);
    setupEducationalRadio();
  } catch (err) {
    console.warn("Educational card failed to initialize:", err);
  }
});