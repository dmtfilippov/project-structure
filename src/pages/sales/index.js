import RangePicker from "../../components/range-picker/index.js";
import SortableTable from '../../components/sortable-table/index.js';
import header from './header.js';

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="sales">
        <div class="content__top-panel" data-element="topPanel">
          <h1 class="page-title">Sales</h1>
        </div>
        <div class="" data-element="ordersContainer"></div>
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
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

    this.components.rangePicker = new RangePicker({ from, to });

    this.components.sortableTable = new SortableTable(header, {
      url: '/api/rest/orders'
    })

    this.updateSortableTable({from, to})

  }

  updateSortableTable({from, to}) {
    this.components.sortableTable.filterData({
      createdAt_gte: from.toISOString(),
      createdAt_lte: to.toISOString()
    })
  }

  initEventListeners () {
    const {rangePicker, sortableTable} = this.components;
    rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;
      this.updateSortableTable({from, to})
    });
  }

  async renderComponents() {

    const {rangePicker, sortableTable} = this.components;

    this.subElements.topPanel.append(rangePicker.element);
    this.subElements.ordersContainer.append(sortableTable.element);
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
