// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBMNQZc5BL5RSYitXrwAIHfvz6gu1v7DFw",
  authDomain: "hospital-ed68d.firebaseapp.com",
  databaseURL: "https://hospital-ed68d-default-rtdb.firebaseio.com",
  projectId: "hospital-ed68d",
  storageBucket: "hospital-ed68d.firebasestorage.app",
  messagingSenderId: "1024658380909",
  appId: "1:1024658380909:web:caff97848dedd1d2830764",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app); // export db as realtime database here
