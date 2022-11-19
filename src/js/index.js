import '../css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './refs';
import { ImageService } from './imageService';
import { imagesMarkup } from './render';

const imageService = new ImageService();

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.searchQuery.value.trim().toLowerCase();

  if (!searchQuery) {
    Notiflix.Notify.info(`Please enter your request`);
    return;
  }

  imageService.searchQuery = searchQuery;
  clearGalleryContainer();

  try {
    const { hits, total, totalHits } = await imageService.getImage();
    console.log(totalHits);

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        `Sorry, there are no images matching for your ${searchQuery}. Please try again.`
      );
      return;
    } else if (totalHits <= 40 && totalHits > 0) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const markup = imagesMarkup(hits);
    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);

    imageService.calculateTotalPages(total);

    Notiflix.Notify.success(`Hooray! We found ${total} images`);
    refs.searchForm.reset();
    lightbox.refresh();

    if (imageService.isShowLoadMore) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure('Somethings bad!!!');
    clearGalleryContainer();
  }
}

async function onLoadMore() {
  imageService.incrementPage();

  if (!imageService.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  try {
    const { hits } = await imageService.getImage();

    const markup = imagesMarkup(hits);
    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notiflix.Notify.failure('Somethings bad!!!');
    clearGalleryContainer();
  }
}

function clearGalleryContainer() {
  imageService.resetPage();
  refs.galleryContainer.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
