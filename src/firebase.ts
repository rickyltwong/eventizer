import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyDdMox05cOw94pFUZi95ok5I5YPFXrqY-o',
  authDomain: 'eventizer-dev.firebaseapp.com',
  projectId: 'eventizer-dev',
  storageBucket: 'eventizer-dev.appspot.com',
  messagingSenderId: '956030114851',
  appId: '1:956030114851:web:db6f54719d41ca70e06596',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };
