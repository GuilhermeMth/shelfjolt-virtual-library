import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUIV-oeXJKkrDCLvIfgyj2pMOz9XzXwyg",
  authDomain: "shelf-jolt.firebaseapp.com",
  projectId: "shelf-jolt",
  storageBucket: "shelf-jolt.firebasestorage.app",
  messagingSenderId: "579097190843",
  appId: "1:579097190843:web:39a3676741db1fc16b249e",
  measurementId: "G-012GFYHNY3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();