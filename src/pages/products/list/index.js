import DoubleSlider from '../../../components/double-slider/index.js';
import SortableTable from '../../../components/sortable-table/index.js';
import header from './header.js';

const API_URL = 'api/rest/products?_embed=subcategory.category';

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="products-list">
        <div class="content__top-panel">
          <h1 class="page-title">Товары</h1>
          <a href="/products/add" class="button-primary">Добавить товар</a>
        </div>
        <div class="content-box content-box_small">
          <form class="form-inline">
            <div class="form-group">
              <label class="form-label">Сортировать по:</label>
              <input type="text" data-element="filterName" class="form-control" placeholder="Название товара">
            </div>
            <div class="form-group" data-element="sliderContainer">
            <label class="form-label">Цена:</label>
            </div>
            <div class="form-group">
              <label class="form-label">Статус:</label>
              <select class="form-control" data-element="filterStatus">
                <option value="" selected="">Любой</option>
                <option value="1">Активный</option>
                <option value="0">Неактивный</option>
              </select>
            </div>
          </form>
        </div>
        <div data-element="productsContainer" class="products-list__container">
        </div>
      </div>`;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initComponents();
    await this.renderComponents();
    this.initEventListeners();
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
    this.components.slider = new DoubleSlider({
      min: 0,
      max: 5000,
      formatValue: value => '$' + value
    });

    this.components.sortableTable = new SortableTable(header, {
      url: API_URL,
      rowLink: '/products'
    });
  }

  async renderComponents() {

    this.subElements.sliderContainer.append(this.components.slider.element);
    this.subElements.productsContainer.append(this.components.sortableTable.element);
  }

  initEventListeners () {
    this.components.slider.element.addEventListener('range-select', event => {
      const { from, to } = event.detail;
      this.components.sortableTable.filterData({price_gte: from, price_lte: to});
    });

    this.subElements.filterStatus.addEventListener('change', event => {
      const status = event.target.value;
      this.components.sortableTable.filterData({status});
    })

    this.subElements.filterName.addEventListener('input', event => {
      const title_like = event.target.value.trim();
      this.components.sortableTable.filterData({title_like});
    })
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
