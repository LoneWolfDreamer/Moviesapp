document.addEventListener("DOMContentLoaded", function () {
  // Handle Navbar Toggle and Shadow Effect on Scroll
  let header = document.querySelector("header");
  let menu = document.querySelector("#menu-icon");
  let navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow", window.scrollY > 0);
  });

  menu.onclick = () => {
    menu.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  };

  window.onscroll = () => {
    menu.classList.remove("bx-x");
    navbar.classList.remove("active");
  };

  // ✅ Ensure Swiper is loaded before initializing
  if (typeof Swiper !== "undefined") {
    // Initialize Swiper for Home Section
    new Swiper(".home", {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    // Initialize Swiper for Coming Soon Section
    new Swiper(".coming-container.swiper", {
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 1500, // Slightly slower transition for better visibility
        disableOnInteraction: false,
      },
      centeredSlides: true,
      breakpoints: {
        0: { slidesPerView: 2 },
        568: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        968: { slidesPerView: 5 },
      },
    });
  } else {
    console.error("Swiper is not defined. Make sure Swiper JS is loaded before main.js");
  }

  // Check if user is logged in and enable/disable comment box accordingly
  const token = localStorage.getItem("token");
  const commentBox = document.getElementById("comment-box");
  const postCommentBtn = document.getElementById("post-comment");

  if (commentBox && postCommentBtn) {
    commentBox.disabled = !token;
    postCommentBtn.disabled = !token;
  }

  fetchComments(); // Load existing comments when page loads

  if (postCommentBtn) {
    postCommentBtn.addEventListener("click", postComment);
  }
});

// Function to Fetch Comments
async function fetchComments() {
  try {
    const response = await fetch("http://localhost:3500/comments", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const comments = await response.json();
    const commentSection = document.getElementById("comments");

    if (commentSection) {
      commentSection.innerHTML = comments
        .map((comment) => `<p>${comment.comment} - User ID: ${comment.user_id}</p>`)
        .join("");
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

// Function to Post a Comment
async function postComment() {
  const commentInput = document.getElementById("comment-box");
  if (!commentInput) return;

  const commentText = commentInput.value.trim();
  if (!commentText) {
    alert("Please enter a comment.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3500/post-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ comment: commentText }),
    });

    const data = await response.json();
    alert(data.message);
    commentInput.value = ""; // Clear input field
    fetchComments(); // Refresh comments
  } catch (error) {
    console.error("Error posting comment:", error);
  }
}
// ✅ Function to Register a New User
async function registerUser(email, password) {
  try {
    const response = await fetch("http://localhost:3500/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Registration failed:", error);
  }
}

// ✅ Function to Log In
async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:3500/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.reload(); // Refresh page after login
    } else {
      alert("Invalid email or password.");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
}

// ✅ Function to Log Out
function logoutUser() {
  localStorage.removeItem("token");
  alert("Logged out!");
  window.location.reload();
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    loginUser(email, password);
  });

  document.getElementById("register-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    registerUser(email, password);
  });

  document.getElementById("logout-btn").addEventListener("click", logoutUser);
});