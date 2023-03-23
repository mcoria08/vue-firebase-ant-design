// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMwqnUp8ltB7zgjGJrIM6OQ5m6aXE4gms",
  authDomain: "vue3-2023-course.firebaseapp.com",
  projectId: "vue3-2023-course",
  storageBucket: "vue3-2023-course.appspot.com",
  messagingSenderId: "595594010903",
  appId: "1:595594010903:web:43dbcf04550659b1d09752"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

const storage = getStorage(firebaseApp);

export { auth, db, storage };