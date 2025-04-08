// document.addEventListener("DOMContentLoaded", () => {
//     const loginForm = document.querySelector("form");
//     const emailInput = document.getElementById("email");
//     const passwordInput = document.getElementById("password");
//     const rememberMeCheckbox = document.getElementById("remember");

//     // Load saved email from localStorage
//     if (localStorage.getItem("rememberMe") === "true") {
//         emailInput.value = localStorage.getItem("savedEmail");
//         rememberMeCheckbox.checked = true;
//     }

//     // Handle form submission
//     loginForm.addEventListener("submit", (event) => {
//         event.preventDefault(); // Prevent default form submission

//         const email = emailInput.value.trim();
//         const password = passwordInput.value.trim();
//         const rememberMe = rememberMeCheckbox.checked;

//         if (!email || !password) {
//             alert("Please enter both email and password!");
//             return;
//         }

//         // Save email if "Remember Me" is checked
//         if (rememberMe) {
//             localStorage.setItem("rememberMe", "true");
//             localStorage.setItem("savedEmail", email);
//         } else {
//             localStorage.removeItem("rememberMe");
//             localStorage.removeItem("savedEmail");
//         }

//         // Submit form data to server
//         loginForm.submit();
//     });
// });
