const header = [
  {
    id: 'id',
    title: 'id',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'user',
    title: 'user',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: 'createdAt',
    sortable: true,
    template: data => {
      return `
          <div class="sortable-table__cell">${new Date(data).toLocaleString("default", { dateStyle: "medium" })}</div>`;
    }
  },
  {
    id: 'totalCost',
    title: 'totalCost',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'delivery',
    title: 'delivery',
    sortable: true,
    sortType: 'string'
  },
];

export default header;
