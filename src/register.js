document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form reload

        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Check if fields are empty
        if (!email || !username || !password) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3500/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();
            console.log("Server response:", data);

            if (response.ok) {
                alert("Registration successful! Redirecting...");

                // Store token (if needed)
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                // Redirect to movies page
                window.location.href = "movies.html";
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    });
});