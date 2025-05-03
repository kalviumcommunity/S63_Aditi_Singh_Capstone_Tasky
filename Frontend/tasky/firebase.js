// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCz00Z2nVKRMw-f9BpAMuyv8m4fB7yTcAs",
  authDomain: "task-manager-327cf.firebaseapp.com",
  projectId: "task-manager-327cf",
  storageBucket: "task-manager-327cf.firebasestorage.app",
  messagingSenderId: "276860755908",
  appId: "1:276860755908:web:36feeea54f0cfe2018ce91",
  measurementId: "G-M8M8FD2PNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Add these for Google Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();