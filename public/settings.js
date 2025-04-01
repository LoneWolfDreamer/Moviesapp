document.addEventListener("DOMContentLoaded", async () => {
    const settingsForm = document.getElementById("settings-form");
    const roleSpan = document.getElementById("role");
    const usernameField = document.querySelector("#username");
    const backToDashboard = document.getElementById("back-to-dashboard");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You need to log in first!");
        window.location.href = "/login.html";
        return;
    }

    // ✅ Load User Info on Page Load
    try {
        const response = await fetch("/user-info", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            // Display username and role
            usernameField.value = data.username;
            roleSpan.textContent = data.role;
        } else {
            alert("Failed to load user information.");
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        alert("Error loading user data.");
    }

    // ✅ Update Username and Password
    settingsForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const newUsername = document.getElementById("new-username").value.trim();
        const newPassword = document.getElementById("new-password").value.trim();

        if (!newUsername && !newPassword) {
            alert("Please enter a new username or password.");
            return;
        }

        try {
            const response = await fetch("/update-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Profile updated successfully!");
                // Update localStorage if username changed
                if (newUsername) localStorage.setItem("username", newUsername);
                window.location.href = "/dashboard.html";
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Update failed.");
        }
    });

    // ✅ Go back to the dashboard
    backToDashboard.addEventListener("click", () => {
        window.location.href = "/dashboard.html";
    });
});