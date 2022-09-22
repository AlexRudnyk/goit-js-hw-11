import { makePicsMarkup } from './makePicsMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
var debounce = require('lodash.debounce');

const refs = {
  inputEl: document.querySelector('input[name="searchQuery"]'),
  btnEl: document.querySelector('button[type="submit"]'),
  galleryDivEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
};

refs.inputEl.addEventListener('input', debounce(onInputQuery, 300));
refs.btnEl.addEventListener('click', onBtnClick);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

let query = '';

function onInputQuery(event) {
  query = event.target.value;
}

async function onBtnClick(event) {
  event.preventDefault();
  refs.galleryDivEl.innerHTML = '';
  //   let page = 1;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=30100750-b02cb32f61256b4afede3508c&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
    );
    const picsArray = await response.data.hits;
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
  //   simpleLightbox();
}

function onLoadMoreBtnClick() {}

// function simpleLightbox() {
//   var lightbox = new SimpleLightbox('.gallery a', {});
//   lightbox.refresh();
// }
