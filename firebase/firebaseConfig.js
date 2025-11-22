// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA74o5G7W2Ws3j2gM_gxlp0SdQs0bVZuNY",
  authDomain: "eldenring-90738.firebaseapp.com",
  projectId: "eldenring-90738",
  storageBucket: "eldenring-90738.firebasestorage.app",
  messagingSenderId:"535724115078" ,
  appId: "1:535724115078:web:e955f90413b2db676cfd07"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
