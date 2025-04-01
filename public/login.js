document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful!");
            localStorage.setItem("token", data.token);       // Store token
            localStorage.setItem("username", data.username);  // Store username
            localStorage.setItem("role", data.role);          // Store role
            window.location.href = "/dashboard.html";         // Redirect to dashboard
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
});