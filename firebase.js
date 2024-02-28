
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyByV2Qm3RIcUatN0RrLXt3Qj9TvlU6OnIc",
  authDomain: "reactnotes-e2a0b.firebaseapp.com",
  projectId: "reactnotes-e2a0b",
  storageBucket: "reactnotes-e2a0b.appspot.com",
  messagingSenderId: "865486283555",
  appId: "1:865486283555:web:01a5c4f45db73aa6b46296"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
