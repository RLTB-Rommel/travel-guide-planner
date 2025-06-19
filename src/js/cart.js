// render-cart.js
import { getLocalStorage, setLocalStorage, clearLocalStorageKey } from "./utils.mjs";

// Add item to cart
export function addToCart(item) {
  const cart = getLocalStorage("cart");
  cart.push(item);
  setLocalStorage("cart", cart);
}

// Get full cart
export function getCart() {
  return getLocalStorage("cart");
}

// Render cart items to the UI
export function renderCartContents() {
  const container = document.querySelector(".product-list");
  const summary = document.getElementById("cart-summary");

  const cartItems = getCart();

  if (!container) {
    console.warn("product-list element not found.");
    return;
  }

  if (!cartItems.length) {
    container.innerHTML = `
      <div class="empty-cart-msg">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <a href="/index.html" class="shop-now-button">← Back to Explore</a>
      </div>`;
    if (summary) summary.innerHTML = "";
    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  container.innerHTML = `<ul class="cart-list">
    ${cartItems.map(cartItemTemplate).join("")}
  </ul>`;

  if (summary) {
    summary.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
  }
}

// Template for each cart item
function cartItemTemplate(item) {
  return `<li class="cart-card">
    <h3>${item.name}</h3>
    <p>Category: ${item.category}</p>
    <p>Price: $${item.price.toFixed(2)}</p>
  </li>`;
}

// Hook up clear cart button
const clearButton = document.getElementById("clear-cart");
if (clearButton) {
  clearButton.addEventListener("click", () => {
    clearLocalStorageKey("cart");
    renderCartContents();
  });
}

// Initial render
renderCartContents();