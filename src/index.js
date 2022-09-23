import makePicsMarkup from './makePicsMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
  if (event.target.elements.searchQuery.value !== '') {
    event.preventDefault();
    picsApiService.query = event.target.elements.searchQuery.value;
    picsApiService.resetPage();
    refs.galleryEl.innerHTML = '';
    fetchPics();
  }
}

async function fetchPics() {
  try {
    if (picsApiService.query !== '') {
      const photoCard = await picsApiService.fetchPhoto();
      if (photoCard.data.hits.length !== 0) {
        if (picsApiService.page === 1) {
          Notify.success(
            `Hooray! We found ${photoCard.data.totalHits} images.`
          );
        }
        refs.galleryEl.insertAdjacentHTML(
          'beforeend',
          makePicsMarkup(photoCard.data.hits)
        );
        refs.loadMoreBtn.classList.remove('load-more');
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      picsApiService.incrementPage();
      refs.loadMoreBtn.disabled = false;
    }
  } catch (error) {
    console.log(error.message);
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.classList.add('load-more');
  }
  var lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function onLoadMoreBtnClick() {
  refs.loadMoreBtn.disabled = true;
  fetchPics();
}
