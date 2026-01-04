const global = {
    currentPage: window.location.pathname
}


// Highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    });
}

// Show spinner
function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}
// Hide spinner
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

// Fetch data from TMDB API
async function fetchAPIdata(endpoint) {
    const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzI3ZTIxYzczYWU1ODlmZGEzZDBkYWIwOTFkNzZjOSIsIm5iZiI6MTc2NzU0Nzk5Ny4zMTMsInN1YiI6IjY5NWFhNDVkMTljY2MyZjU5MjNiZTE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0rq2eNwfxya9GfSVl70WZKL2W7oqX0kYQc6_iXdXazo';
    const API_URL = 'https://api.themoviedb.org/3/'

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?language=en-US`, options);
    const data = await response.json();

    hideSpinner();

    return data;
}

// Display popular movies
async function displayPopularMovies() {
    const { results } = await fetchAPIdata('movie/popular');

    results.forEach(movie => {
        const moviePoster = `https://image.tmdb.org/t/p/w500/${movie.poster_path}` || '../images/no-image.jpg';
        const movieElement = document.createElement('div');

        movieElement.classList.add('card');
        movieElement.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                <img
                src="${moviePoster}"
                class="card-img-top"
                alt="${movie.title}"
                />
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>
        `;

        document.querySelector('#popular-movies').appendChild(movieElement);
    })
}

// Display popular shows
async function displayPopularShows() {
    const { results } = await fetchAPIdata('tv/popular');

    results.forEach(show => {
        const showPoster = `https://image.tmdb.org/t/p/w500/${show.poster_path}` || '../images/no-image.jpg';
        const showElement = document.createElement('div');

        showElement.classList.add('card');
        showElement.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
                <img
                src="${showPoster}"
                class="card-img-top"
                alt="${show.name}"
                />
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">First Air: ${show.first_air_date}</small>
                </p>
            </div>
        `;

        document.querySelector('#popular-shows').appendChild(showElement);
    })
}

// App init
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displayPopularMovies();
            break;
        case "/shows.html":
            displayPopularShows();
            break;
        case "/tv-details.html":
            console.log("TV Details page");
            break;
        case "/movie-details.html":
            console.log("Movie Details page");
            break;
        case "/search.html":
            console.log("Search page");
            break;
        default:
            console.log("404 Page Not Found");
            break;
    }

    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
