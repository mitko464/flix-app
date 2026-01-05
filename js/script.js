const global = {
    currentPage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 0,
        totalResults: 39
    },
    api: {
        apiKey: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMzI3ZTIxYzczYWU1ODlmZGEzZDBkYWIwOTFkNzZjOSIsIm5iZiI6MTc2NzU0Nzk5Ny4zMTMsInN1YiI6IjY5NWFhNDVkMTljY2MyZjU5MjNiZTE5ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0rq2eNwfxya9GfSVl70WZKL2W7oqX0kYQc6_iXdXazo',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
}

// Fetch data from TMDB API
async function fetchAPIdata(endpoint) {
    const API_TOKEN = global.api.apiKey;
    const API_URL = global.api.apiUrl;

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

// Make request to Search API
async function searchAPIData() {
    const API_TOKEN = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    }

    showSpinner();

    const response = await fetch(`${API_URL}search/${global.search.type}?language=en-US&query=${global.search.term}&page=${global.search.page}`, options);
    const data = await response.json();

    hideSpinner();

    return data;
}

// Search movies/shows
async function search() {
    const queryString = window.location.search

    const urlParams = new URLSearchParams(queryString);

    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');


    if (global.search.term !== '' && global.search.term !== null) {
        const { results, total_results, total_pages, page } = await searchAPIData();

        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;

        if (results.length === 0) {
            showAlert('No search results', 'error')
        } else {
            displaySearchResults(results);
        }
    } else {
        showAlert('Please enter a search term');
    }
}

// Display pagination
function displayPagination() {
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');
    pagination.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `;

    document.querySelector('#pagination').appendChild(pagination);

    if (global.search.page === 1) {
        document.querySelector('#prev').disabled = true;
    }

    if (global.search.page === global.search.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    document.querySelector('#prev').addEventListener('click', async () => {
        global.search.page--;
        const { results } = await searchAPIData();
        displaySearchResults(results);
    });

    document.querySelector('#next').addEventListener('click', async () => {
        global.search.page++;
        const { results } = await searchAPIData();
        displaySearchResults(results);
    });
}


function showAlert(message, className = "error") {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', className);
    alertEl.appendChild(document.createTextNode(message))

    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => {
        alertEl.remove();
    }, 3000)
}

// Display Search Results
function displaySearchResults(results) {
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#search-results-heading').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';

    results.forEach(result => {
        const moviePoster = result.poster_path !== null ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : '../images/no-image.jpg';
        const movieElement = document.createElement('div');
        const resultType = global.search.type;

        movieElement.classList.add('card');
        movieElement.innerHTML = `
            <a href="${resultType}-details.html?id=${result.id}">
                <img
                    src="${moviePoster}"
                    class="card-img-top"
                    alt="${resultType === "movie" ? result.title : result.name}"
                />
            </a>
            <div class="card-body">
                <h5 class="card-title">${resultType === "movie" ? result.title : result.name}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${resultType === "movie" ? result.release_date : result.first_air_date}</small>
                </p>
            </div>
        `;

        document.querySelector('#search-results').appendChild(movieElement);
    });

    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
    `;

    displayPagination();


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

// Display movie details
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];

    const movie = await fetchAPIdata(`movie/${movieId}`);
    const moviePoster = movie.poster_path !== null ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '../images/no-image.jpg';

    displayBackdropImage('movie', movie.backdrop_path);

    const movieDetailsElement = document.createElement('div');

    movieDetailsElement.innerHTML = `
        <div class="details-top">
            <div>
                <img
                    src="${moviePoster}"
                    class="card-img-top"
                    alt="${movie.title}"
                />
            </div>
            <div>
                <h2>${movie.title}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${movie.vote_average.toFixed(1)}
                </p>
                <p class="text-muted">Release Date: ${movie.release_date}</p>
                <p>${movie.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${movie.genres.map(genre => `<li>${genre.name}</li>`).join("")}
                </ul>
                <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Budget:</span> $${addCommasToNuber(movie.budget)}</li>
                <li><span class="text-secondary">Revenue:</span> $${addCommasToNuber(movie.revenue)}</li>
                <li><span class="text-secondary">Runtime:</span> ${movie.runtime}</li>
                <li><span class="text-secondary">Status:</span> ${movie.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
                ${movie.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
            </div>
        </div>
    `;

    document.querySelector('#movie-details').appendChild(movieDetailsElement);
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

// Display show details
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];

    const show = await fetchAPIdata(`tv/${showId}`);
    const showPoster = `https://image.tmdb.org/t/p/w500/${show.poster_path}` || '../images/no-image.jpg';
    console.log(show)

    displayBackdropImage('tv', show.backdrop_path);

    const showDetailsElement = document.createElement('div');

    showDetailsElement.innerHTML = `
        <div class="details-top">
            <div>
                <img
                    src="${showPoster}"
                    class="card-img-top"
                    alt="${show.name}"
                />
            </div>
            <div>
                <h2>${show.name}</h2>
                <p>
                    <i class="fas fa-star text-primary"></i>
                    ${show.vote_average.toFixed(1)}
                </p>
                <p class="text-muted">First Air Date: ${show.first_air_date}</p>
                <p>${show.overview}</p>
                <h5>Genres</h5>
                <ul class="list-group">
                    ${show.genres.map(genre => `<li>${genre.name}</li>`).join("")}
                </ul>
                <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
        </div>
        <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
                <li><span class="text-secondary">Last Air Date:</span> ${show.last_air_date}</li>
                <li><span class="text-secondary">Last Episode On Air:</span> ${show.last_episode_to_air.name}</li>
                <li><span class="text-secondary">Runtime:</span> ${show.runtime || 'N/A'} </li>
                <li><span class="text-secondary">Status:</span> ${show.status}</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">
                ${show.production_companies.map(company => `<span>${company.name}</span>`).join(', ')}
            </div>
        </div>
    `;

    document.querySelector('#show-details').appendChild(showDetailsElement);
}

// Display slider
async function displaySlider() {
    const { results } = await fetchAPIdata('movie/now_playing');

    results.forEach(movie => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');

        slide.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
            </h4>
        `;

        document.querySelector('.swiper-wrapper').appendChild(slide);
    });

    new Swiper('.swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 3000,
        },
        breakpoints: {
            400: {
                slidesPerView: 1,
            },
            500: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1000: {
                slidesPerView: 4,
            }
        }
    });
}

// Highlight active link
function highlightActiveLink() {
    const links = document.querySelectorAll(".nav-link");
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });
}

// Show/hde spinner
function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

// Add commas to number
function addCommasToNuber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Display backdropImage
function displayBackdropImage(type, imgUrl) {
    const overlayImage = document.createElement('div');
    overlayImage.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${imgUrl})`;
    overlayImage.style.backgroundSize = "cover";
    overlayImage.style.backgroundPosition = "center";
    overlayImage.style.backgroundRepeat = "no-repeat";
    overlayImage.style.height = "100vh";
    overlayImage.style.width = "100vw";
    overlayImage.style.position = "absolute";
    overlayImage.style.top = "0";
    overlayImage.style.left = "0";
    overlayImage.style.zIndex = "-1";
    overlayImage.style.opacity = "0.1";

    if (type === 'movie') {
        document.querySelector("#movie-details").appendChild(overlayImage)
    } else {
        document.querySelector("#show-details").appendChild(overlayImage)
    }
}

// App init
function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displayPopularMovies();
            displaySlider();
            break;
        case "/shows.html":
            displayPopularShows();
            break;
        case "/tv-details.html":
            displayShowDetails();
            break;
        case "/movie-details.html":
            displayMovieDetails();
            break;
        case "/search.html":
            search();
            break;
        default:
            console.log("404 Page Not Found");
            break;
    }

    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
