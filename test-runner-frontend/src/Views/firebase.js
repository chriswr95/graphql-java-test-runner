// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAVLG-1xp12A0oo2g7AxSB3wk2MNHyBzhs',
  authDomain: 'solid-study-357016.firebaseapp.com',
  projectId: 'solid-study-357016',
  storageBucket: 'solid-study-357016.appspot.com',
  messagingSenderId: '273044781403',
  appId: '1:273044781403:web:d54acebb09cfa690a9427e',
  measurementId: 'G-9RJZ1FXQ46',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export default getFirestore();
