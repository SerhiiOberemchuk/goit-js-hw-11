import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '40336421-a348c8518e766dd2004df0c10';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
// Notify.success('Sol lucet omnibus');

function errorMesage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
      timeout: 5000,
      width: '400px',
      fontSize: '24px',
    }
  );
}
const form = document.querySelector('.search-form');
form.addEventListener('submit', getUser);
const gallery = document.querySelector('.gallery');
const buttonLoad = document.querySelector('.load-more');

async function getUser(event) {
  event.preventDefault();
  const input = form.querySelector('input[name="searchQuery"]');
  buttonLoad.style.display = 'none';
  // console.log(input.value);
  gallery.innerHTML = '';
  let pages = 1;
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pages}`
    );
    console.log(response);

    if (response.data.totalHits === 0) {
      errorMesage();
      return;
    }
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    renderImage(response);

    buttonLoad.style.display = 'block';
    buttonLoad.addEventListener('click', onClick);
    async function onClick(event) {
      pages += 1;
      console.log(pages);
      const response = await axios.get(
        `https://pixabay.com/api/?key=${apiKey}&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pages}`
      );

      console.log(response);
      if (response.data.hits.length === 0) {
        Notify.info(
          "We're sorry, but you've reached the end of search results.",
          {
            position: 'center-center',
            timeout: 1000,
            width: '400px',
            fontSize: '24px',
          }
        );
        buttonLoad.style.display = 'none';
        return;
      }
      renderImage(response);
    }
    // return response;
  } catch (error) {
    console.error(error);
    errorMesage();
    // return error;
  }
}
// function getResponse(params) {}

function renderImage(dataGet) {
  const arrayData = dataGet.data.hits;

  const marcup = arrayData
    .map(
      item => `<div class="photo-card">
      <a class="gallery__link" href="${item.largeImageURL}">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" class="gallery__image" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${item.likes}
      </p>
      <p class="info-item">
        <b>Views </b>${item.views}
      </p>
      <p class="info-item">
        <b>Comments </b>${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads </b>${item.downloads}
      </p>
    </div> 
   </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', marcup);

  let lightbox = new SimpleLightbox('.gallery__link', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
