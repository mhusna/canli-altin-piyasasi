// scripts/prices.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
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

const form = document.getElementById("priceForm");
const statusMessage = document.getElementById("statusMessage");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prices = {
      BILEZIK22: {
        alis: parseFloat(document.getElementById("BILEZIK22_alis").value) || 0,
        satis:
          parseFloat(document.getElementById("BILEZIK22_satis").value) || 0,
      },
      CEYREK_YENI: {
        alis:
          parseFloat(document.getElementById("CEYREK_YENI_alis").value) || 0,
        satis:
          parseFloat(document.getElementById("CEYREK_YENI_satis").value) || 0,
      },
      AYAR24: {
        alis: parseFloat(document.getElementById("AYAR24_alis").value) || 0,
        satis: parseFloat(document.getElementById("AYAR24_satis").value) || 0,
      },
    };

    try {
      // Her ürün için ayrı doküman olarak kaydet
      for (const [key, value] of Object.entries(prices)) {
        await setDoc(doc(db, "users", uid, "prices", key), value);
      }

      statusMessage.innerHTML = `<div class="alert alert-success">Fiyatlar başarıyla kaydedildi!</div>`;
    } catch (error) {
      console.error("Hata:", error);
      statusMessage.innerHTML = `<div class="alert alert-danger">Kaydetme hatası: ${error.message}</div>`;
    }
  });
});
