// app.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseConfig } from "../models/commonModels.js";
import $ from "jquery";
import "popper.js";
import "bootstrap";

window.jQuery = window.$ = $;

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form elemanlarını yakala
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Giriş hatası: " + error.message);
  }
});

// Kullanıcı zaten giriş yaptıysa otomatik yönlendir
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Kullanıcı bilgileri bulunamadı!");
      return;
    }

    const userData = userSnap.data();
    const expireDate = userData.expireDate?.toDate
      ? userData.expireDate.toDate()
      : new Date(userData.expireDate);

    const currentDate = new Date();

    if (currentDate > expireDate) {
      alert("Hesabınızın süresi dolmuş. Lütfen yönetici ile iletişime geçin.");
      await signOut(auth);
      return;
    }

    window.location.href = "../livePrices/livePrices.html";
  }
});