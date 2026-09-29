import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkoutProcess = new CheckoutProcess('so-cart', '.checkout-summary');
checkoutProcess.init();

document.querySelector('#zip').addEventListener('blur', () => {
  checkoutProcess.calculateOrderTotal();
});

document.forms['checkout'].addEventListener('submit', (e) => {
  e.preventDefault();
  checkoutProcess.checkout(e.target);
});