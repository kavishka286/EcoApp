import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage

const firebaseConfig = {
  apiKey: "AIzaSyBuOX-pR5TOCsB3TfuxVH4FaAqBfefgt1s",
  authDomain: "ecogrow-9582e.firebaseapp.com",
  projectId: "ecogrow-9582e",
  storageBucket: "ecogrow-9582e.appspot.com",
  messagingSenderId: "318640273559",
  appId: "1:318640273559:web:ab9b06ee2c8c7df43551d2",
  measurementId: "G-YX5HQQQXHX"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage }; // Export storage as wel