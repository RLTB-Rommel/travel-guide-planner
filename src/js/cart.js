// render-cart.js
import { getLocalStorage, setLocalStorage, clearLocalStorageKey } from "./utils.mjs";

export function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  localStorage.setItem("travelCart", JSON.stringify(cart));
}

export function getCart() {
  return JSON.parse(localStorage.getItem("travelCart") || "[]");
}

export function renderCartContents() {
  const cartList = document.getElementById("cart-items");
  if (!cartList) {
    console.warn("cart-items element not found.");
    return;
  }

  const cart = getCart();
  cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartList.appendChild(li);
  });
}




function renderCartContents() {
  const cartItems = getLocalStorage("cart") || [];
  const container = document.querySelector(".product-list");
  const summary = document.getElementById("cart-summary");

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

function cartItemTemplate(item) {
  return `<li class="cart-card">
    <h3>${item.name}</h3>
    <p>Category: ${item.category}</p>
    <p>Price: $${item.price.toFixed(2)}</p>
  </li>`;
}

export function addToCart(item) {
  const cart = getLocalStorage("cart");
  cart.push(item);
  setLocalStorage("cart", cart);
}

const clearButton = document.getElementById("clear-cart");
if (clearButton) {
  clearButton.addEventListener("click", () => {
    clearLocalStorageKey("cart");
    renderCartContents();
  });
}

renderCartContents();