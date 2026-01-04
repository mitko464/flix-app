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

function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            console.log("Homepage");
            break;
        case "/shows.html":
            console.log("Shows page");
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
    }

    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);
