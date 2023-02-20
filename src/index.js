import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.getElementById(`search-form`);
const loadmoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

async function fetchImages(name) {
  const API_KEY = `33764189-9b4498a919581aaa78e0499bc`;
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  const response = await axios.get(BASE_URL);
  return response.data;
}
let query = ``;
let page = 1;

formEl.addEventListener('submit', getGallery);

async function getGallery(event) {
  event.preventDefault();
  const form = event.currentTarget;
  query = form.elements.searchQuery.value.trim();
  if (query === ``) {
    Notiflix.Notify.warning('Please,enter a request');
    return;
  }
  try {
    const images = await fetchImages(query);
    console.log(images);
    if (images.hits.length === 0) {
      loadmoreBtn.hidden = true;
      resetGallery();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      console.log(images);
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      createGalleryMarkup(images.hits);
      loadmoreBtn.hidden = false;
      if (images.total === images.totalHits) {
        loadmoreBtn.hidden = true;
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function createGalleryMarkup(arr) {
  const galleryMarkup = arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => {
        return `
        <div class="photo-card">
        <a class="gallery-item" href=${largeImageURL}>
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div> `;
      }
    )
    .join(``);
  gallery.innerHTML = galleryMarkup;
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function updateGalleryMarkup(arr) {
  const galleryMarkup = arr
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => {
        return `<div class="photo-card">
      <a class="gallery-item" href=${largeImageURL}>
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div> `;
      }
    )
    .join(``);
  gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function resetGallery() {
  gallery.innerHTML = '';
}

loadmoreBtn.addEventListener(`click`, loadMore);
async function loadMore() {
  page++;
  try {
    const newImages = await fetchImages(query);
    updateGalleryMarkup(newImages.hits);
  } catch (error) {
    console.log(error);
  }
}
