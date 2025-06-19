async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    // Send detailed error object for handling in CheckoutProcess
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`; // Load from public/json/
  }

  async getData() {
    try {
      const res = await fetch(this.path);
      return await convertToJson(res);
    } catch (err) {
      console.error("Failed to load local JSON:", err);
      return [];
    }
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find(product => product.Id === id);
  }

  async checkout(order) {
    const url = 'https://wdd330-backend.onrender.com/checkout';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    };

    try {
      const response = await fetch(url, options);
      return await convertToJson(response);
    } catch (err) {
      console.error("Checkout error:", err);
      throw err;
    }
  }
}