import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// --- Firebase Config ---
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
const auth = getAuth(app);
const db = getFirestore(app);

// --- Ürün listesi ---
const EXCHANGE_TYPES = [
  { id: "BILEZIK22", alisMilyem: 0.912, satisMilyem: 0.93 },
  { id: "AYAR22", alisMilyem: 0.912, satisMilyem: 0.93 },
  { id: "AYAR8", alisMilyem: 0.32, satisMilyem: 0 },
  { id: "AYAR14", alisMilyem: 0.575, satisMilyem: 0 },
  { id: "AYAR18", alisMilyem: 0.7, satisMilyem: 0 },
  { id: "AYAR24", alisMilyem: 0.995, satisMilyem: 1.1 },
  { id: "CEYREK_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "CEYREK_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "YARIM_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "YARIM_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "TEK_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "TEK_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "ATA_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "RESAT", alisMilyem: 1, satisMilyem: 1 },
  { id: "GRAMESE_YENI", alisMilyem: 10, satisMilyem: 10 },
  { id: "GRAMESE_ESKI", alisMilyem: 10, satisMilyem: 10 },
  { id: "USDTRY", alisMilyem: 1, satisMilyem: 1 },
  { id: "EURTRY", alisMilyem: 1, satisMilyem: 1 },
  { id: "GUMUSTRY", alisMilyem: 1, satisMilyem: 1 },
];

const tableBody = document.getElementById("priceTable");
const saveBtn = document.getElementById("saveBtn");
const loadingMessage = document.getElementById("loadingMessage");
const priceCard = document.getElementById("priceCard");

// --- Ürünleri tabloya ekle ---
function renderTable(data = {}) {
  tableBody.innerHTML = "";
  EXCHANGE_TYPES.forEach((item) => {
    const existing = data[item.id] || {};
    tableBody.innerHTML += `
      <tr>
        <td class="fw-semibold">${item.id}</td>
        <td><input type="number" class="form-control" id="alis_${item.id}" 
          value="${existing.alis ?? ""}" placeholder="${item.alisMilyem}"></td>
        <td><input type="number" class="form-control" id="satis_${item.id}" 
          value="${existing.satis ?? ""}" placeholder="${item.satisMilyem}"></td>
      </tr>
    `;
  });
}

// --- Fiyatları Firestore'a kaydet ---
async function savePrices(uid) {
  for (const item of EXCHANGE_TYPES) {
    const alis = parseFloat(
      document.getElementById(`alis_${item.id}`).value || 0
    );
    const satis = parseFloat(
      document.getElementById(`satis_${item.id}`).value || 0
    );
    await setDoc(doc(db, "users", uid, "prices", item.id), { alis, satis });
  }
  alert("✅ Fiyatlar kaydedildi!");
}

// --- Firestore'dan mevcut fiyatları oku ---
async function loadPrices(uid) {
  // Spinner'ı göster, tabloyu gizle
  loadingMessage.style.display = "block";
  priceCard.style.display = "none";
  priceCard.classList.remove("show");

  const pricesData = {};
  for (const item of EXCHANGE_TYPES) {
    const ref = doc(db, "users", uid, "prices", item.id);
    const snap = await getDoc(ref);
    if (snap.exists()) pricesData[item.id] = snap.data();
  }

  renderTable(pricesData);

  // Spinner'ı gizle, tabloyu göster (fade-in ile)
  loadingMessage.style.display = "none";
  priceCard.style.display = "block";
  setTimeout(() => priceCard.classList.add("show"), 10);
}

// --- Kullanıcı girişi kontrolü ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await loadPrices(user.uid);
    saveBtn.onclick = () => savePrices(user.uid);
  } else {
    window.location.href = "index.html"; // giriş yoksa login sayfasına yönlendir
  }
});


document.getElementById("newUserBtn").addEventListener("click", () => {
  window.location.href = "/register.html";
});

document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "/index.html"; // Ana sayfa linki
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      alert("Başarıyla çıkış yaptınız!");
      window.location.href = "/login.html"; // Çıkış sonrası yönlendirme
    })
    .catch((error) => {
      console.error("Çıkış yapılamadı:", error);
      alert("Çıkış sırasında bir hata oluştu!");
    });
});