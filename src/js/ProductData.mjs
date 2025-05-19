// src/js/ProductData.mjs

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad response from server");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; // Vite serves from /public
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}