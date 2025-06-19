import { addToCart } from './cart.js';

function setupFavorites() {
  const favorites = [
    {
      btnId: 'favorite-btn',
      nameId: 'dining-name',
      priceId: 'dining-price',
      categoryId: 'dining-category',
    },
    {
      btnId: 'attractions-favorite-btn',
      nameId: 'attractions-name',
      priceId: 'attractions-price',
      categoryId: 'attractions-category',
    },
    {
      btnId: 'adventure-favorite-btn',
      nameId: 'adventure-name',
      priceId: 'adventure-price',
      categoryId: 'adventure-category',
    },
    {
      btnId: 'educational-favorite-btn',
      nameId: 'educational-name',
      priceId: 'educational-price',
      categoryId: 'educational-category',
    }
  ];

  favorites.forEach(({ btnId, nameId, priceId, categoryId }) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const name = document.getElementById(nameId)?.textContent?.trim() || "Unknown";
      const price = parseFloat(document.getElementById(priceId)?.textContent?.trim()) || 0;
      const category = document.getElementById(categoryId)?.textContent?.trim() || "Category";

      const item = {
        name,
        price,
        category,
        timestamp: new Date().toISOString()
      };

      addToCart(item);
      btn.textContent = '♥'; // Update icon to show it's saved
      btn.classList.add('favorited');
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setupFavorites();
});