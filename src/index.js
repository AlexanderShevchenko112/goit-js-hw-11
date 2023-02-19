import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const formEl = document.getElementById(`search-form`);
const loadmoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

function fetchImages(name) {
  const API_KEY = `33764189-9b4498a919581aaa78e0499bc`;
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  return fetch(BASE_URL);
}

let query = ``;
let page = 1;

formEl.addEventListener('submit', getGallery);

function getGallery(event) {
  event.preventDefault();
  const form = event.currentTarget;
  query = form.elements.searchQuery.value.trim();

  fetchImages(query)
    .then(response => {
      return response.json();
    })
    .then(images => {
      if (images.hits.length === 0) {
        resetGallery();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        console.log(images);
        createGalleryMarkup(images.hits);
        loadmoreBtn.hidden = false;
        if (images.total === images.totalHits) {
          loadmoreBtn.hidden = true;
          Notiflix.Notify.warning(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
}
function createGalleryMarkup(arr) {
  const galleryMarkup = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:${likes}</b>
          </p>
          <p class="info-item">
            <b>Views:${views}</b>
          </p>
          <p class="info-item">
            <b>Comments:${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads:${downloads}</b>
          </p>
        </div>
      </div> `;
    })
    .join(``);
  gallery.innerHTML = galleryMarkup;
}

function updateGalleryMarkup(arr) {
  const galleryMarkup = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:${likes}</b>
          </p>
          <p class="info-item">
            <b>Views:${views}</b>
          </p>
          <p class="info-item">
            <b>Comments:${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads:${downloads}</b>
          </p>
        </div>
      </div> `;
    })
    .join(``);
  gallery.insertAdjacentHTML('beforeend', galleryMarkup);
}

function resetGallery() {
  gallery.innerHTML = '';
}

loadmoreBtn.addEventListener(`click`, loadMore);
function loadMore() {
  page++;
  fetchImages(query)
    .then(response => {
      return response.json();
    })
    .then(images => {
      updateGalleryMarkup(images.hits);
    })
    .catch(error => {
      console.log(error);
    });
}
