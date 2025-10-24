// scripts/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIGME8_6gN9bI1SCadrsx93QhQRCfC-dM",
  authDomain: "canli-altin-app.firebaseapp.com",
  databaseURL:
    "https://canli-altin-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "canli-altin-app",
  storageBucket: "canli-altin-app.firebasestorage.app",
  messagingSenderId: "675863034125",
  appId: "1:675863034125:web:301006180c35a5f0549844",
  measurementId: "G-V3YHGPSB8M",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Kullanıcı giriş yaptıysa, fiyatlarını getir
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  const pricesCol = collection(db, "users", uid, "prices");
  const snapshot = await getDocs(pricesCol);

  snapshot.forEach((doc) => {
    const data = doc.data();
    const productId = doc.id; // Örn: "BILEZIK22"
    const row = document.getElementById(productId);
    if (row) {
      row.querySelector(".alis").textContent = data.alis.toFixed(2);
      row.querySelector(".satis").textContent = data.satis.toFixed(2);
    }
  });
});
