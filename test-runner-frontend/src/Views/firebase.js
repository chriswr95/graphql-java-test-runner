// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhLmZcbFGKQdQHf0tDKQb-yW4qdpY0UUk",
  authDomain: "tokyo-baton-355421.firebaseapp.com",
  projectId: "tokyo-baton-355421",
  storageBucket: "tokyo-baton-355421.appspot.com",
  messagingSenderId: "28501314759",
  appId: "1:28501314759:web:b70f8098ece8df266102e2",
  measurementId: "G-XF6D9VDJTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();