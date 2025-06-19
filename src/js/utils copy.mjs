// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true, clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function loadHeaderFooter() {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");

  fetch("/partials/header.html")
    .then((res) => {
      if (!res.ok) throw new Error("Header fetch failed");
      return res.text();
    })
    .then((html) => {
      if (header) header.innerHTML = html;
    })
    .catch((err) => console.warn("[Header Error]", err.message));

  fetch("/partials/footer.html")
    .then((res) => {
      if (!res.ok) throw new Error("Footer fetch failed");
      return res.text();
    })
    .then((html) => {
      if (footer) footer.innerHTML = html;
    })
    .catch((err) => console.warn("[Footer Error]", err.message));
}
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<span>${message}</span><span class="close-btn" style="float:right;cursor:pointer;">✖</span>`;

  alert.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("close-btn") ||
      e.target.innerText === "✖"
    ) {
      alert.remove();
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}
