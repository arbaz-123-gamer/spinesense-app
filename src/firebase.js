import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAl25czbWGgjahJGuZbROS912k84_xBN7w",
  authDomain: "spinesense-88e87.firebaseapp.com",
  databaseURL: "https://spinesense-88e87-default-rtdb.firebaseio.com",
  projectId: "spinesense-88e87",
  storageBucket: "spinesense-88e87.firebasestorage.app",
  messagingSenderId: "991213743624",
  appId: "1:991213743624:web:deb6302e7ca008c3412bbd"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);