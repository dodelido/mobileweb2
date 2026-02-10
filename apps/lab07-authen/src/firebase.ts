// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzQSU1uXHP81ibTJznItKlZmWMumP4qx4",
  authDomain: "lab6webapp.firebaseapp.com",
  projectId: "lab6webapp",
  storageBucket: "lab6webapp.firebasestorage.app",
  messagingSenderId: "682699492471",
  appId: "1:682699492471:web:11aecdb5efd1d624acca72",
  measurementId: "G-WLN1CEEHS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);