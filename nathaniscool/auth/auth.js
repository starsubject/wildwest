// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- Config
const firebaseConfig = {
  apiKey: "AIzaSyAKPtgwjllQOqB9RNmRcCzgeYvnkHEMavE",
  authDomain: "runora-auth.firebaseapp.com",
  projectId: "runora-auth",
  storageBucket: "runora-auth.firebasestorage.app",
  messagingSenderId: "367293618403",
  appId: "1:367293618403:web:a9bd8c9f267e8c2aa74dd6",
  measurementId: "G-X788CHRJTJ"
};

// --- Init
const authApp = initializeApp(firebaseConfig, "authApp");
const analytics = getAnalytics(authApp);
const auth = getAuth(authApp);
const db = getFirestore(authApp);

// --- DOM
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const authForm = document.getElementById("authForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const status = document.getElementById("status");

let mode = "login";

// --- Tab Switch
loginTab.onclick = () => {
  mode = "login";
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  submitBtn.textContent = "Login";
  status.textContent = "";
};

registerTab.onclick = () => {
  mode = "register";
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  submitBtn.textContent = "Register";
  status.textContent = "";
};

// --- Form Handler
authForm.onsubmit = async (e) => {
  e.preventDefault();
  status.textContent = "";

  const username = usernameInput.value.trim().toLowerCase();
  const email = `${username}@gigachad.chat`;
  const password = passwordInput.value;

  try {
    if (mode === "login") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        displayName: username,
        rank: ""
      });
    }
  } catch (err) {
    status.textContent = err.message;
  }
};

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  // Make sure user doc exists
  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    await setDoc(docRef, {
      displayName: "unknown",
      rank: ""
    });
  }

  // Optionally show a message like "Signed in as [name]"
  status.textContent = `Signed in as ${snap.data()?.displayName || "unknown"}. You can log out to switch accounts.`;
});