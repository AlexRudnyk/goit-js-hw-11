import makePicsMarkup from './makePicsMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryDivEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

let query = '';
let page = 1;

async function onSearch(event) {
  event.preventDefault();
  refs.galleryDivEl.innerHTML = '';
  query = event.target.elements.searchQuery.value;
  const url = `https://pixabay.com/api/?key=30100750-b02cb32f61256b4afede3508c&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  try {
    const response = await axios.get(url);
    const picsArray = await response.data.hits;
    const totalHits = await response.data.totalHits;
    if (picsArray.length !== 0) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
      refs.galleryDivEl.insertAdjacentHTML(
        'beforeend',
        makePicsMarkup(picsArray)
      );
      page = +1;
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
  var lightbox = new SimpleLightbox('.gallery a', {});
  //   simpleLightbox();
}

async function onLoadMoreBtnClick() {
  const url = `https://pixabay.com/api/?key=30100750-b02cb32f61256b4afede3508c&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  try {
    const response = await axios.get(url);
    const picsArray = await response.data.hits;
    const totalHits = await response.data.totalHits;
    Notify.success(`Hooray! We found ${totalHits} images.`);
    if (picsArray.length !== 0) {
      refs.galleryDivEl.insertAdjacentHTML(
        'beforeend',
        makePicsMarkup(picsArray)
      );
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
  var lightbox = new SimpleLightbox('.gallery a', {});
}

// function simpleLightbox() {
//   var lightbox = new SimpleLightbox('.gallery a', {});
//   lightbox.refresh();
// }
