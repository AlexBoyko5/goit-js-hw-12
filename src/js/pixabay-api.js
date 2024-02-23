import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import axios from 'axios';
import { createGalleryMarkup } from './render-functions.js';
import { lightbox } from '../main.js';

const API_KEY = '42334631-07f239856d3b6a49db441bfb9';
let totalHits = 0;
let imagesShown = 0;

export async function fetchImages(query, page, clearGallery = true) {
    const gallery = querySelector('.gallery')
    const loader = document.querySelector('.loader');
    const loadMoreButton = document.querySelector('#load-more');
    loader.classList.remove('is-hidden');
    loadMoreButton.classList.add('is-hidden');
    try {
        const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=15&page=${page}`); // Добавлены параметры per_page и page
        totalHits = response.data.totalHits;
        imagesShown += response.data.hits.length;
        console.log(response.data);
        loader.classList.add('is-hidden');
        if (response.data.hits.length === 0) {
            if (imagesShown >= totalHits) {
                iziToast.info({
                    title: 'Info',
                    message: 'We are sorry, but you have reached the end of search results.'
                });
            } else {
                iziToast.info({
                    title: 'Info',
                    message: 'Sorry, there are no images matching your search query. Please try again!'
                });
            }
        } else {
            createGalleryMarkup(response.data.hits, clearGallery);
            lightbox.refresh();
            setTimeout(() => {
                const galleryCard = document.querySelector('.photo-card');
                const cardHeight = galleryCard.getBoundingClientRect().height;
                window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
            }, 100);
            loadMoreButton.classList.remove('is-hidden'); // Показываем кнопку Load more после загрузки
        }
    } catch (error) {
        console.error('Error fetching images:', error);
        loader.style.display = 'none';
        iziToast.error({
            title: 'Error',
            message: 'Failed to fetch images. Please try again later.'
        });
    }
}

