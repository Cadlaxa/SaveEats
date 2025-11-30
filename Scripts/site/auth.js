document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const submitModal = document.getElementById("submit-modal");
  const errorModal = document.getElementById("error-modal");
  const errorMessageBox = errorModal.querySelector(".error-message");
  const closeButtons = document.querySelectorAll(".close-btn");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  // ---------------------------
  // Firebase Config
  // ---------------------------
  const firebaseConfig = {
    apiKey: "AIzaSyAZKYQvVJihtvRz7QHrXHNullNNadyQVMc",
    authDomain: "saveeats-395fd.firebaseapp.com",
    projectId: "saveeats-395fd",
    storageBucket: "saveeats-395fd.firebasestorage.app",
    messagingSenderId: "1070958395954",
    appId: "1:1070958395954:web:41c17d243770545c58f22b",
    measurementId: "G-6QZMSPQEM9"
  };

  // Initialize Firebase (compat)
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // ---------------------------
  // Email/password login
  // ---------------------------
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login successful → show submit modal
        submitModal.classList.add("visible");
        navigator.vibrate?.([50, 150, 50]);
        loginForm.reset();
      })
      .catch((error) => {
        // No match → show error modal
        showError(error.message);
      });
  });

  // ---------------------------
  // Google login
  // ---------------------------
  googleLoginBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        submitModal.classList.add("visible");
        navigator.vibrate?.([50, 150, 50]);
      })
      .catch((error) => {
        showError(error.message);
      });
  });

  // ---------------------------
  // Show error modal
  // ---------------------------
  function showError(message) {
    errorMessageBox.textContent = message;
    errorModal.classList.add("visible");
    navigator.vibrate?.([50, 150, 50]);
  }

  // ---------------------------
  // Close modals
  // ---------------------------
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-container").classList.remove("visible");
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === submitModal || e.target === errorModal) {
      e.target.classList.remove("visible");
    }
  });
});
