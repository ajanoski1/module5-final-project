// API OMDB http://www.omdbapi.com/?apikey=9c4b24fc&






//

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const moviesGrid = document.querySelector('#moviesGrid');
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');

let movies = [];



searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const query = searchInput.value;
  showSkeletonLoadingState(10);
  fetchMovies(query);
});

function showSkeletonLoadingState(numberOfSkeletons) {
  moviesGrid.innerHTML = '';
  for (let i = 0; i < numberOfSkeletons; i++) {
    const skeletonCard = `
      <div class="movie-card--skeleton">
        <div class="movie-card__img--skeleton"></div>
        <div class="movie-card__title--skeleton"></div>
        <div class="movie-card__year--skeleton"></div>
      </div>
    `;
    moviesGrid.innerHTML += skeletonCard; 
  }
}

async function fetchMovies(query) {
  const apiKey = '9c4b24fc';
  const url = `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;  
  setTimeout(async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      movies = data.Search || [];
      displayMovies(movies); 
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }, 500); 
}
function displayMovies(movies) {

  moviesGrid.innerHTML = '';
  if (!movies || movies.length === 0) {
    resultsInfo.textContent = 'No results found.';
    return;
  }
  resultsInfo.innerHTML = `<span>Showing:</span> ${searchInput.value} results`;
  const movieCards = movies.map(movie => 
    `<div class="movie-card">
            <img class="movie-card__img" src="${movie.Poster !== 'N/A' ? movie.Poster : './path/to/placeholder-image.jpg'}" alt="${movie.Title}"/>
            <h2 class="movie-card__title">${movie.Title}</h2>
            <p class="movie-card__year">${movie.Year}</p>
        </div>
    `).join('');
  moviesGrid.innerHTML = movieCards;
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = searchInput.value;
    fetchMovies(query);
});

sortSelect.addEventListener('change', (event) => {
    const sortOrder = event.target.value;

    const getYear = (movie) => {
        const years = movie.Year.split(' to ');
        return parseInt(years[0], 10); 
    };

  if (sortOrder === 'a-z') {
        movies.sort((a, b) => a.Title.localeCompare(b.Title)); 
    } else if (sortOrder === 'z-a') {
        movies.sort((a, b) => b.Title.localeCompare(a.Title)); 
    } else if (sortOrder === 'newest') {
        movies.sort((a, b) => getYear(b) - getYear(a)); 
    } else if (sortOrder === 'oldest') {
        movies.sort((a, b) => getYear(a) - getYear(b)); 
    }

    displayMovies(movies);
});
