import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// A mock config is fine for the emulators
const firebaseConfig = {
  apiKey: 'AIza-fake-key',
  authDomain: 'campus-overflow-dev.firebaseapp.com',
  projectId: 'campus-overflow-dev',
  storageBucket: 'campus-overflow-dev.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abcdef123456',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// In a development environment, connect to the emulators
// Note: The `process.env.NODE_ENV` check is crucial for production builds
if (process.env.NODE_ENV === 'development') {
    try {
        console.log("Connecting to Firebase emulators");
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099');
    } catch (e) {
        console.warn("Could not connect to Firebase emulators. If you are not running them, this is expected.");
    }
}

export { db, auth };
