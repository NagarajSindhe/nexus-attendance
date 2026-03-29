import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv_wvgYSA1C0gaVW_qRtoCKB7ET4a1E7c",
  authDomain: "nexus-attend-76c68.firebaseapp.com",
  projectId: "nexus-attend-76c68",
  storageBucket: "nexus-attend-76c68.firebasestorage.app",
  messagingSenderId: "275583928483",
  appId: "1:275583928483:web:909eb9e7711ff0b7119716",
  measurementId: "G-95GZ4V5DQ3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
