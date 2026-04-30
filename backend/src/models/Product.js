/**
 * Product Model Shape
 * 
 * {
 *   id: Number,
 *   name: String,
 *   category: String,
 *   brand: String,
 *   price: Number,
 *   rating: String,
 *   image: String
 * }
 */

class Product {
  // Static helper to format product data if needed
  static format(product) {
    return {
      ...product,
      price: parseFloat(product.price).toFixed(2)
    };
  }
}

module.exports = Product;
