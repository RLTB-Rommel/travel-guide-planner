import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage, alertMessage } from "./utils.mjs";

const taxRate = 0.06;

function packageItems(items) {
  return items.map(item => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.quantity || 1
  }));
}

export function isExpiredCard(expiration) {
  // Ensure exact format MM/YY with no extra characters
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!regex.test(expiration)) {
    alertMessage("Invalid expiration format. Use MM/YY (e.g., 12/26).");
    return true;
  }

  const [monthStr, yearStr] = expiration.split("/");
  const month = Number(monthStr);
  const year = Number(yearStr);

  // Set expiration to the **first day of the following month**
  const expiryDate = new Date(2000 + year, month);
  const now = new Date();

  if (now >= expiryDate) {
    alertMessage("Invalid expiration date. Please enter a valid expiration date.");
    return true;
  }

  return false;
}

function isValidCardNumber(number) {
  const sanitized = number.replace(/[\s-]/g, "");

  if (!/^\d{13,19}$/.test(sanitized)) {
    alertMessage("Invalid card number. Must be 13–19 digits.");
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    alertMessage("Invalid card number. Please double-check.");
    return false;
  }

  return true;
}

export default class CheckoutProcess {
  constructor(key) {
    this.key = key;
    this.list = getLocalStorage(key) || [];
    this.services = new ExternalServices();
  }

  init() {
    this.displayOrderSummary();
  }

  displayOrderSummary() {
    if (!this.list.length) return;

    const subtotal = this.list.reduce(
      (acc, item) => acc + item.FinalPrice * (item.quantity || 1),
      0
    );
    const tax = subtotal * taxRate;
    const shipping = 10 + (this.list.length - 1) * 2;
    const orderTotal = subtotal + tax + shipping;

    // Check for element existence before trying to set textContent
    const subtotalElem = document.querySelector(".subtotal");
    const taxElem = document.querySelector(".tax");
    const shippingElem = document.querySelector(".shipping");
    const orderTotalElem = document.querySelector(".order-total");

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElem) taxElem.textContent = `$${tax.toFixed(2)}`;
    if (shippingElem) shippingElem.textContent = `$${shipping.toFixed(2)}`;
    if (orderTotalElem) orderTotalElem.textContent = `$${orderTotal.toFixed(2)}`;

    this.subtotal = subtotal;
    this.tax = tax;
    this.shipping = shipping;
    this.orderTotal = orderTotal;
  }

async checkout(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Expiration date validation
  if (isExpiredCard(data.expiration)) {
    return; // stop processing
  }

    // Validate CVV
  if (!/^\d{3,4}$/.test(data.code)) {
  alertMessage("Invalid security code. Must be 3 or 4 digits.");
  return;
  }

  // Validate card number
  //if (!isValidCardNumber(data.cardNumber)) {
  //return;
  //}

  if (data.cardNumber !== "1234123412341234") {
  alertMessage("Invalid card number. Please use 1234123412341234.");
  return;
  }

  if (data.code !== "123") {
  alertMessage("Invalid security code. Please use 123.");
  return;
  }

  const order = {
    orderDate: new Date().toISOString(),
    fname: data.fname,
    lname: data.lname,
    street: data.street,
    city: data.city,
    state: data.state,
    zip: data.zip,
    //cardNumber: data.cardNumber,
    cardNumber: data.cardNumber,
    expiration: data.expiration,
    code: data.code,
    items: packageItems(this.list),
    orderTotal: this.orderTotal.toFixed(2),
    shipping: this.shipping,
    tax: this.tax.toFixed(2)
  };

  try {
    const response = await this.services.checkout(order);
    console.log("Order submitted:", response);
    sessionStorage.setItem("recent-order", JSON.stringify(order));
    localStorage.removeItem(this.key);
    form.reset();
    window.location.href = "./success.html";
  } catch (err) {
    console.error("Checkout failed:", err);
    alertMessage("Checkout failed. Please check your inputs or try again later.");
  }
}
}