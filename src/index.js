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
buttonLoad.addEventListener('click', onClick);

async function getUser(event) {
  event.preventDefault();
  const input = form.querySelector('input[name="searchQuery"]');
  console.log(input.value);

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=1`
    );
    console.log();
    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    renderImage(response);
    buttonLoad.style.display = 'block';
    // return response;
  } catch (error) {
    console.error(error);
    errorMesage();
    // return error;
  }
}
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

  gallery.innerHTML = marcup;

  let lightbox = new SimpleLightbox('.gallery__link', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
