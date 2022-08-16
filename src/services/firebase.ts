// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAb9vNq9apSy79xNYWrLOjekyMEV4AaXbY",
    authDomain: "colombiapp-65e4e.firebaseapp.com",
    projectId: "colombiapp-65e4e",
    storageBucket: "colombiapp-65e4e.appspot.com",
    messagingSenderId: "241879079744",
    appId: "1:241879079744:web:b0a08f2c8f83a620d038a5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
