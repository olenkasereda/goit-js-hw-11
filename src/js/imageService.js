import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export class ImageService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = 0;
    this.perPage = 40;
    this.params = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };
  }

  async getImage() {
    const API_KEY = '31255242-50a56ca895b91ac33e828d5f7';
    const url = `?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=40`;

    const { data } = await axios.get(url, this.params);
    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  calculateTotalPages(total) {
    this.totalPages = Math.ceil(total / this.perPage);
  }

  get isShowLoadMore() {
    return this.page < this.totalPages;
  }
}
