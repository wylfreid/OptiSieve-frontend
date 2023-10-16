import { initializeApp } from "firebase/app";

import {getAuth} from 'firebase/auth'

import {getFirestore} from 'firebase/firestore'

import {getStorage} from 'firebase/storage'

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAiK4_SRNDg7LgyN4q-xbsecMn52Q6dIo8",
  authDomain: "optisieve.firebaseapp.com",
  projectId: "optisieve",
  storageBucket: "optisieve.appspot.com",
  messagingSenderId: "621679889807",
  appId: "1:621679889807:web:ae5338a4e27307f8ddcffa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
