export default function fetchImages(name) {
  const API_KEY = `33764189-9b4498a919581aaa78e0499bc`;
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&per-page=40&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`;
  return fetch(`${BASE_URL}&page=${page}`);
}
