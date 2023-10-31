// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-marketplace-3f6a9.firebaseapp.com",
  projectId: "mern-marketplace-3f6a9",
  storageBucket: "mern-marketplace-3f6a9.appspot.com",
  messagingSenderId: "624262366497",
  appId: "1:624262366497:web:f5c942a75efc6007e1aa60"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);