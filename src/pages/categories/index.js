import SortableList from '../../components/sortable-list/index.js';
import escapeHtml from '../../utils/escape-html.js';
import fetchJson from '../../utils/fetch-json.js';

const API_URL = {
  categories: 'api/rest/categories?_sort=weight&_refs=subcategory',
  subcategories: 'api/rest/subcategories'
};

const BACKEND_URL = process.env.BACKEND_URL;

export default class Page {
  element;
  subElements = {};
  components = {};
  data = [];
  urls = {
    categories: new URL(API_URL.categories, BACKEND_URL),
    subcategories: new URL(API_URL.subcategories, BACKEND_URL)
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="categories">
        <div class="content__top-panel">
          <h1 class="page-title">
            Categories
          </h1>
        </div>
        <div class="" data-element="categoriesContainer"></div>
      </div>`;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    await this.initComponents();
    this.renderData();
    return this.element;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async initComponents() {

    try {
      this.data = await fetchJson(this.urls.categories);
    } catch (error) {
      console.error(error);
    }

  }

  getListItem({id, title, count}) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <li class="categories__sortable-list-item sortable-list__item"
        data-grab-handle=""
        data-id="${id}">
        <strong>${title}</strong>
        <span><b>${count}</b> products</span>
      </li>`;

    return wrapper.firstElementChild;
  }

  getSubcategoriesList(subcategories) {
    const items = subcategories.map(({ id, title, count }) => this.getListItem({id, title, count}));
    return new SortableList({items});
  }

  getCategory({id, title, subcategories}) {
    const element = document.createElement('div');

    element.innerHTML = `<div class="category category_open" data-id="${id}">
            <header class="category__header">${title}</header>
            <div class="category__body"><div class="subcategory-list"></div></div>
          </div>`;
    const list = this.getSubcategoriesList(subcategories);
    this.components[id] = list;
    element.querySelector('.subcategory-list').append(list.element);
    return element.firstElementChild;
  }

  renderData() {

    const items = this.data.map( ({id, title, subcategories}) => {
      return this.getCategory({id, title, subcategories});
    })

    this.subElements.categoriesContainer.append(...items);
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
