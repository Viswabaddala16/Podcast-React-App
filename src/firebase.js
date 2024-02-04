// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQJQTe8v8Wn0XNFOwheH9cSA_BXHfaKJc",
  authDomain: "podcast-react-app-a3570.firebaseapp.com",
  projectId: "podcast-react-app-a3570",
  storageBucket: "podcast-react-app-a3570.appspot.com",
  messagingSenderId: "1060939020168",
  appId: "1:1060939020168:web:9b0a63e100ed8e5ddc6c3d",
  measurementId: "G-CES7NHNVSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {auth,db,storage};