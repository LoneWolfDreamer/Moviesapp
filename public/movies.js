async function fetchMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    try {
        const response = await fetch(`/api/movies/${movieId}`);
        const data = await response.json();

        document.getElementById("movie-title").textContent = data.movie.title;
        document.getElementById("movie-description").textContent = data.movie.description;
        const videoElement = document.getElementById("movie-player");
        videoElement.src = `/videos/${data.movie.video_file}`; // Adjust the video path

        const actorList = document.getElementById("actor-list");
        actorList.innerHTML = data.movie.actors.split(", ").map(actor => `<li>${actor}</li>`).join("");

        const reviewList = document.getElementById("review-list");
        reviewList.innerHTML = data.reviews.map(review => `<li>${review.comment}</li>`).join("");

        const form = document.getElementById("review-form");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const reviewInput = document.getElementById("review-input").value;
            await fetch(`/api/movies/${movieId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: reviewInput })
            });
            fetchMovieDetails(); // Refresh reviews
        });

    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

window.onload = fetchMovieDetails;