const axios = require('axios');

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30100750-b02cb32f61256b4afede3508c';

export default class PicsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchPhoto() {
    const searchParams = new URLSearchParams({
      key: `${KEY}`,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    });
    const url = `${BASE_URL}?${searchParams}`;
    return await axios.get(url);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
