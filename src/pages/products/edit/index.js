import ProductForm from "../../../components/product-form/index";

export default class Page {
  element;
  subElements = {};
  components = {};
  productId = '';

  async render() {
    const pathname = decodeURI(window.location.pathname).replace(/^\/|\/$/, '');
    const productId = pathname.split('/')[1];
    if (productId && productId !== 'add') {
      this.productId = productId;
    }
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Товары</a> / ${this.productId ? 'Редактировать' : 'Добавить'}
          </h1>
        </div>
        <div class="content-box" data-element="body"></div>
      </div>`;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.initComponents();
    await this.renderComponents();

    return this.element;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  initComponents() {
    // const productId = '102-planset-apple-ipad-2019-32-gb--seryj';

    this.components.productFrom = new ProductForm(this.productId);
  }

  async renderComponents() {
    const element = await this.components.productFrom.render();
    this.subElements.body.append(element);
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
