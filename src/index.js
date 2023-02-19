import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const formEl = document.getElementById(`search-form`);
const searchBtn = document.querySelector('button');
const loadmoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

function fetchImages(name) {
  const API_KEY = `33764189-9b4498a919581aaa78e0499bc`;
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&per-page=40&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`;
  return fetch(`${BASE_URL}&page=${page}`);
}

let query = ``;
let page = 1;

formEl.addEventListener('submit', getGallery);

function getGallery(event) {
  event.preventDeafault();
  const form = event.currentTarget;
  query = form.elements.searchQuery.value.trim();
  console.log(query);

  fetchImages(query)
    .then(response => {
      return response.json();
    })
    .then(images => {
      if (images.length === 0) {
        resetGallery();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createGalleryMarkup(images);
        console.log(images);
      }
    })
    .catch(error => {
      console.log(error);
    });
}
function createGalleryMarkup(images) {
  const galleryMarkup = images
    .map(image => {
      return `<div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:${image.likes}</b>
          </p>
          <p class="info-item">
            <b>Views:${image.views}</b>
          </p>
          <p class="info-item">
            <b>Comments:${image.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads:${image.downloads}</b>
          </p>
        </div>
      </div> `;
    })
    .join(``);
  gallery.insertAdjacentHTML = galleryMarkup;
}

function resetGallery() {
  gallery.innerHTML = '';
}
