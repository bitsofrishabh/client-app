import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCZ_GK7YMg1KtaSP7vkRftEI8EaHZpzyqM",
  authDomain: "coach-app-55bd8.firebaseapp.com",
  projectId: "coach-app-55bd8",
  storageBucket: "coach-app-55bd8.firebasestorage.app",
  messagingSenderId: "847569728168",
  appId: "1:847569728168:web:eb0da2e6844df04e0ec89d",
  measurementId: "G-4CNZQ66JEW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;