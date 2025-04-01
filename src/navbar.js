document.addEventListener("DOMContentLoaded", async () => {
    const navbar = document.getElementById("navbar");
    const profileSection = document.querySelector("#profile-section");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (token && username) {
        try {
            const response = await fetch("/user-info", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });

            const userData = await response.json();
            if (response.ok) {
                // Display user information in the navbar
                profileSection.innerHTML = `
                    <div class="dropdown">
                        <button class="dropbtn">${username} (${role}) ▼</button>
                        <div class="dropdown-content">
                            <a href="/settings.html">⚙️ Settings</a>
                            <a id="logout">🚪 Logout</a>
                        </div>
                    </div>
                `;

                // Logout Event Listener
                document.querySelector("#logout").addEventListener("click", () => {
                    localStorage.clear();
                    window.location.href = "/";
                });

            } else {
                // If the token is invalid or expired, force logout
                localStorage.clear();
                navbar.innerHTML = `<a href="login.html">Sign In</a>`;
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            navbar.innerHTML = `<a href="login.html">Sign In</a>`;
        }
    } else {
        // Show Sign In if no token is found
        navbar.innerHTML = `<a href="login.html">Sign In</a>`;
    }
});