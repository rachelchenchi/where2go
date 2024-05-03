// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyR1_BTUR3Ml8kFagIkistE8XJLPe3FPo",
    authDomain: "cs5356-where2go.firebaseapp.com",
    projectId: "cs5356-where2go",
    storageBucket: "cs5356-where2go.appspot.com",
    messagingSenderId: "867159952646",
    appId: "1:867159952646:web:c3aab8840f229b9e95e287"
};

let firebaseApp
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

export default firebaseApp;