import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ you're using Auth
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgbKd43zNTi8CQNC4xapq_N6YqLl9CkJI",
  authDomain: "solo-leveling-webapp.firebaseapp.com",
  projectId: "solo-leveling-webapp",
  storageBucket: "solo-leveling-webapp.appspot.com",
  messagingSenderId: "847167394336",
  appId: "1:847167394336:web:2f782a20e41a296579a245",
  measurementId: "G-TXMECVFJF7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ only keep this
export const db = getFirestore(app);
