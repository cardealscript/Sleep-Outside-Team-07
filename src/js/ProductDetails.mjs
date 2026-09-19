import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    let cart = JSON.parse(localStorage.getItem('so-cart')) || [];
    const existingItem = cart.find((item) => item.Id === this.product.Id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      this.product.quantity = 1;
      cart.push(this.product);
    }

    setLocalStorage('so-cart', cart);
  }

  renderProductDetails() {
    document.querySelector('h3').textContent = this.product.Brand.Name;
    document.querySelector('h2').textContent = this.product.NameWithoutBrand;

    const productImage = document.querySelector('.product-image');
    productImage.src = this.product.Images.PrimaryLarge;
    productImage.alt = this.product.NameWithoutBrand;

    document.querySelector('.product-card__price').textContent =
      `$${this.product.FinalPrice}`;

    document.querySelector('.product__color').textContent =
      this.product.Colors[0].ColorName;

    document.querySelector('.product__description').innerHTML =
      this.product.DescriptionHtmlSimple;

    document.getElementById('addToCart').dataset.id = this.product.Id;
  }
}