import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzQSU1uXHP81ibTJznItKlZmWMumP4qx4",
  authDomain: "lab6webapp.firebaseapp.com",
  projectId: "lab6webapp",
  storageBucket: "lab6webapp.firebasestorage.app",
  messagingSenderId: "682699492471",
  appId: "1:682699492471:web:11aecdb5efd1d624acca72",
};

const app = initializeApp(firebaseConfig);

// ⭐ จุดสำคัญที่สุด
export const db = getFirestore(app);
