import makePicsMarkup from './makePicsMarkup';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import PicsApiService from './pics-api-service';
import { Notify } from 'notiflix';
import PicsApiService from './pics-api-service';

const picsApiService = new PicsApiService();

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearch(event) {
  event.preventDefault();
  picsApiService.query = event.target.elements.searchQuery.value;
  fetchPics();
}

async function fetchPics() {
  try {
    if (picsApiService.query !== '') {
      const photoCard = await picsApiService.fetchPhoto();
      if (photoCard.data.hits.length !== 0) {
        Notify.success(`Hooray! We found ${photoCard.data.totalHits} images.`);
        refs.galleryEl.insertAdjacentHTML(
          'beforeend',
          makePicsMarkup(photoCard.data.hits)
        );
        picsApiService.incrementPage();
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

function onLoadMoreBtnClick() {
  fetchPics();
}
