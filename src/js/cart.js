import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

import { getLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function renderCartTotal(cartItems) {
  const cartTotalElement = document.querySelector('.cart-total');

  if (!cartItems || cartItems.length === 0) {
    cartTotalElement.textContent = '';
    return;
  }

  const total = cartItems.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + item.FinalPrice * quantity;
  }, 0);

  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

renderCartContents();