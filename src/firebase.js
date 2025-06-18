// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgbKd43zNTi8CQNC4xapq_N6YqLl9CkJI",
  authDomain: "solo-leveling-webapp.firebaseapp.com",
  projectId: "solo-leveling-webapp",
  storageBucket: "solo-leveling-webapp.firebasestorage.app",
  messagingSenderId: "847167394336",
  appId: "1:847167394336:web:2f782a20e41a296579a245",
  measurementId: "G-TXMECVFJF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//const analytics = getAnalytics(app);