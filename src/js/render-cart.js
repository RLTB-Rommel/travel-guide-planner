// /js/render-cart.js
import { getLocalStorage, clearLocalStorageKey } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("cart") || [];
  const container = document.querySelector(".product-list");
  const summary = document.getElementById("cart-summary");

  if (!cartItems.length) {
   container.innerHTML = `
     <div class="empty-cart-wrapper">
       <div class="empty-cart-msg">
         <h2>Your cart is empty</h2>
         <p>Looks like you haven't added anything yet.</p>
         <a href="/index.html" class="shop-now-button">← Back to Explore</a>
       </div>
       <button id="clear-cart" class="clear-button">Clear Cart</button>
     </div>`;

    if (summary) summary.innerHTML = "";

    // re-bind Clear Cart button after injecting it
    const clearButton = document.getElementById("clear-cart");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        clearLocalStorageKey("cart");
        renderCartContents();
      });
    }

    return;
  }

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  container.innerHTML = `
    <ul class="cart-list">
      ${cartItems.map(cartItemTemplate).join("")}
    </ul>`;

  if (summary) {
    summary.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card">
    <h3>${item.name}</h3>
    <p>Category: ${item.category}</p>
    <p>Price: $${item.price.toFixed(2)}</p>
  </li>`;
}

const clearButton = document.getElementById("clear-cart");
if (clearButton) {
  clearButton.addEventListener("click", () => {
    clearLocalStorageKey("cart");
    renderCartContents();
  });
}

renderCartContents();