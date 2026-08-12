import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {  apiKey: "AIzaSyBbMJrfjqjk_9mRtoMi1lEQoTbRkeQyYlE",
  authDomain: "prompt-forge-5da75.firebaseapp.com",
  projectId: "prompt-forge-5da75",
  storageBucket: "prompt-forge-5da75.firebasestorage.app",
  messagingSenderId: "1037395691833",
  appId: "1:1037395691833:web:4f1d3e110fec1df9e280e8",
  measurementId: "G-GRTTJVWMJ3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);