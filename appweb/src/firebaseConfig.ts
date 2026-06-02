import { initializeApp } from 'firebase/app';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC84R8tmIAxFDPev3xdwn1ftikKjjIxGnQ',
  authDomain: 'mobile-2f62c.firebaseapp.com',
  projectId: 'mobile-2f62c',
  storageBucket: 'mobile-2f62c.firebasestorage.app',
  messagingSenderId: '1004747435202',
  appId: '1:1004747435202:web:3a62cbbc8dd13edfa19f5b',
  measurementId: 'G-FD3ZTEPR0N',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const isFirebaseConfigured = true;

let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error) => {
      console.warn('Firebase Analytics não disponível:', error);
    });
}

export { app, db, analytics };

