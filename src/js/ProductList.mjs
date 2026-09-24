import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const isOnSale = product.FinalPrice < product.ListPrice;
  const badge = isOnSale ? `<span class="discount-badge">Sale</span>` : '';

  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      ${badge}
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.NameWithoutBrand}">
      <h2 class="card__brand">${product.Brand.Name}</h2>
      <h3 class="card__name">${product.NameWithoutBrand}</h3>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);

    const titleElement = document.querySelector('.category-title');
    if (titleElement) {
      titleElement.textContent = `Top Products: ${this.category}`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}