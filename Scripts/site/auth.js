import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signUpForm = document.getElementById("SignUpForm");
  const restoBtn = document.getElementById("restoAcc");

  const submitModal = document.getElementById("submit-modal");
  const errorModal = document.getElementById("error-modal");
  const errorMessageBox = errorModal.querySelector(".error-message");
  const closeButtons = document.querySelectorAll(".close-btn");
  const googleLoginBtn = document.getElementById("googleLoginBtn");

  let accountType = "user";

  const firebaseConfig = {
    apiKey: "AIzaSyAZKYQvVJihtvRz7QHrXHNullNNadyQVMc",
    authDomain: "saveeats-395fd.firebaseapp.com",
    projectId: "saveeats-395fd",
    storageBucket: "saveeats-395fd.appspot.com",
    messagingSenderId: "1070958395954",
    appId: "1:1070958395954:web:41c17d243770545c58f22b",
    measurementId: "G-6QZMSPQEM9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // ---------------------------
  // MODALS
  // ---------------------------
  function showError(message) {
    errorMessageBox.textContent = message;
    errorModal?.classList.add("visible");
    navigator.vibrate?.([50, 150, 50]);
  }

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".modal-container")?.classList.remove("visible");
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === submitModal || e.target === errorModal) {
      e.target.classList.remove("visible");
    }
  });

  function showSubmitModalAndRedirect(userType) {
    submitModal?.classList.add("visible");
    navigator.vibrate?.([50, 150, 50]);

    setTimeout(() => {
      if (userType === "restaurant") {
        window.location.href = "restaurant_home.html";
      } else {
        window.location.href = "home-user.html";
      }
    }, 1000);
  }

  // ---------------------------
  // LOGIN
  // ---------------------------
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists()) throw new Error("User data not found.");

      const userType = docSnap.data().type || "user";
      showSubmitModalAndRedirect(userType);

      loginForm.reset();
    } catch (error) {
      showError(error.message);
    }
  });

  // ---------------------------
  // GOOGLE LOGIN
  // ---------------------------
  googleLoginBtn?.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      const userType = docSnap.exists ? docSnap.data().type || "user" : "user";

      showSubmitModalAndRedirect(userType);
    } catch (error) {
      showError(error.message);
    }
  });

  // ---------------------------
  // SIGN UP
  // ---------------------------
  restoBtn?.addEventListener("click", () => {
    accountType = "restaurant";
    signUpForm.requestSubmit();
  });

  signUpForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const passwordRep = document.getElementById("password_rep").value;

    if (password !== passwordRep) {
      showError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        type: accountType,
        createdAt: new Date()
      });

      const redirectType = accountType;
      accountType = "user";
      signUpForm.reset();

      showSubmitModalAndRedirect(redirectType);
    } catch (error) {
      showError(error.message);
    }
  });
});