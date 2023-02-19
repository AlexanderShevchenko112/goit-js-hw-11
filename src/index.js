import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import fetchImages from './fetch-images.js';

const formEl = document.getElementById('search-form');
const searchBtn = document.querySelector(`button`);
const loadmoreBtn = document.querySelector(`.load-more`);
const gallery = document.querySelector(`.gallery`);

let searchQuery = ``;

formEl.addEventListener(`submit`, getGallery);

function getGallery(event) {
  event.preventDeafault();
  const form = event.currentTarget;
  searchQuery = form.elements.searchQuery.value.trim();
  console.log(searchQuery);

  fetchImages(searchQuery)
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
  gallery.innerHTML = galleryMarkup;
}

function resetGallery() {
  gallery.innerHTML = '';
}
