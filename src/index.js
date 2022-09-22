import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
var debounce = require('lodash.debounce');

const refs = {
  inputEl: document.querySelector('input[name="searchQuery"]'),
  btnEl: document.querySelector('button[type="submit"]'),
  galleryDivEl: document.querySelector('.gallery'),
};

refs.inputEl.addEventListener('input', debounce(onInputQuery, 300));
refs.btnEl.addEventListener('click', onBtnClick);

let query = '';

function onInputQuery(event) {
  query = event.target.value;
}

async function onBtnClick(event) {
  event.preventDefault();
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=30100750-b02cb32f61256b4afede3508c&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
    );
    const picsArray = await response.data.hits;
    refs.galleryDivEl.insertAdjacentHTML(
      'beforeend',
      makePicsMarkup(picsArray)
    );
  } catch (error) {
    console.log(error.message);
  }
  var lightbox = new SimpleLightbox('.gallery a', {});
  //   simpleLightbox();
}

function makePicsMarkup(picsArray) {
  return picsArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
<div class="photo-card">
  <a class="photo-card__link" href="${largeImageURL}">
  <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>
    `;
      }
    )
    .join('');
}

// function simpleLightbox() {
//   var lightbox = new SimpleLightbox('.gallery a', {});
//   lightbox.refresh();
// }
