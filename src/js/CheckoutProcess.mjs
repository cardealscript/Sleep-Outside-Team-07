import { getLocalStorage, formDataToJSON } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const services = new ExternalServices();

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const itemCount = this.list.reduce(
      (count, item) => count + (item.quantity || 1),
      0,
    );

    this.itemTotal = this.list.reduce((sum, item) => {
      const quantity = item.quantity || 1;
      return sum + item.FinalPrice * quantity;
    }, 0);

    document.querySelector(`${this.outputSelector} #cartSubtotal`).textContent =
      `$${this.itemTotal.toFixed(2)}`;

    return itemCount;
  }

  calculateOrderTotal() {
    const itemCount = this.list.reduce(
      (count, item) => count + (item.quantity || 1),
      0,
    );

    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #cartTax`).textContent =
      `$${this.tax.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #cartShipping`).textContent =
      `$${this.shipping.toFixed(2)}`;
    document.querySelector(`${this.outputSelector} #cartTotal`).textContent =
      `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1,
    }));
  }

  async checkout(form) {
    const formData = formDataToJSON(form);

    formData.orderDate = new Date().toISOString();
    formData.orderTotal = this.orderTotal.toFixed(2);
    formData.tax = this.tax.toFixed(2);
    formData.shipping = this.shipping;
    formData.items = this.packageItems(this.list);

    try {
      const response = await services.checkout(formData);
      console.log('Order submitted:', response);
      return response;
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  }
}