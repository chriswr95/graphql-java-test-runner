// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI9ZLSzeUuAfrcgsnQk2KY-dMTC9yOg4Q",
  authDomain: "test-runner-358517.firebaseapp.com",
  projectId: "test-runner-358517",
  storageBucket: "test-runner-358517.appspot.com",
  messagingSenderId: "225250511252",
  appId: "1:225250511252:web:1f000cccdf2cbb1cf1e781"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
