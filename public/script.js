async function fetchMovies() {
    try {
        const response = await fetch('/api/movies');
        const movies = await response.json();
        
        const movieList = document.getElementById("movie-list");
        movieList.innerHTML = '';

        movies.forEach(movie => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="/movie.html?id=${movie.id}">${movie.title}</a>`;
            movieList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

window.onload = fetchMovies;
