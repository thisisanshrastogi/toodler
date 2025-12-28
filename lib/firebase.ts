import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBZ42zPtGWC0jY0YELRgVKQDi1PiE8MBaM",
  authDomain: "toodler-37706.firebaseapp.com",
  projectId: "toodler-37706",
  storageBucket: "toodler-37706.firebasestorage.app",
  messagingSenderId: "126944125944",
  appId: "1:126944125944:web:48fb61209ba79d0b226c0d",
  measurementId: "G-67P3PC5H3L"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);
