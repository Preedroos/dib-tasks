import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if critical variables are present
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('Firebase configuration variables are missing or incomplete in environment.');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicializa uma instância secundária para criação de novos usuários pelo administrador
// sem fazer com que o administrador seja deslogado no cliente
const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
export const secondaryAuth = getAuth(secondaryApp);
