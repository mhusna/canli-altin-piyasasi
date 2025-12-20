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
  storageBucket: "canli-altin-app.appspot.com", // 🔧 düzeltildi
  messagingSenderId: "675863034125",
  appId: "1:675863034125:web:301006180c35a5f0549844",
  measurementId: "G-V3YHGPSB8M",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ------------------- ÜRÜN TANIMLARI -------------------
const EXCHANGE_TYPES = [
  { id: "BILEZIK22", haremId: "ALTIN", alisMilyem: 0.912, satisMilyem: 0.93 },
  { id: "AYAR8", haremId: "ALTIN", alisMilyem: 0.32, satisMilyem: 0 },
  { id: "AYAR14", haremId: "ALTIN", alisMilyem: 0.575, satisMilyem: 0 },
  { id: "AYAR18", haremId: "ALTIN", alisMilyem: 0.7, satisMilyem: 0 },
  { id: "AYAR22", haremId: "ALTIN", alisMilyem: 0.912, satisMilyem: 0.93 },
  { id: "AYAR24", haremId: "ALTIN", alisMilyem: 0.995, satisMilyem: 1 },
  { id: "CEYREK_YENI", haremId: "CEYREK_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "CEYREK_ESKI", haremId: "CEYREK_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "YARIM_YENI", haremId: "YARIM_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "YARIM_ESKI", haremId: "YARIM_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "TEK_YENI", haremId: "TEK_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "TEK_ESKI", haremId: "TEK_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "ATA_YENI", haremId: "ATA_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "RESAT", haremId: "ATA_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "GRAMESE_YENI", haremId: "CEYREK_YENI", alisMilyem: 1, satisMilyem: 1 },
  { id: "GRAMESE_ESKI", haremId: "CEYREK_ESKI", alisMilyem: 1, satisMilyem: 1 },
  { id: "USDTRY", haremId: "USDTRY", alisMilyem: 1, satisMilyem: 1 },
  { id: "EURTRY", haremId: "EURTRY", alisMilyem: 1, satisMilyem: 1 },
  { id: "GUMUSTRY", haremId: "GUMUSTRY", alisMilyem: 1000, satisMilyem: 1000 },
];

// ------------------- TABLOYA VERİ EKLE -------------------
function fillTableWithData(data = {}) {
  EXCHANGE_TYPES.forEach((item) => {
    const row = document.getElementById(item.id);
    if (!row) return;

    const alisEl = row.querySelector(".alis");
    const satisEl = row.querySelector(".satis");

    const alisVal = data[item.id]?.alis || 0;
    const satisVal = data[item.id]?.satis || 0;

    alisEl.innerHTML = `
      <input type="number" class="form-control" id="alis_${item.id}" value="${alisVal}" placeholder="${item.alisMilyem}" max="0">
    `;
    satisEl.innerHTML = `
      <input type="number" class="form-control" id="satis_${item.id}" value="${satisVal}" placeholder="${item.satisMilyem}">
    `;

    const input = document.getElementById(`alis_${item.id}`);
    input.addEventListener("input", function () {
      let val = this.value;
      if (val === "" || val === "-") {
        this.value = "-";
        return;
      }
      if (!val.startsWith("-")) {
        this.value = "-" + val.replace(/-/g, "");
      }
    });
  });
}

// ------------------- FİYATLARI FIRESTORE’A KAYDET -------------------
async function savePrices(uid) {
  try {
    for (const item of EXCHANGE_TYPES) {
      const alis = parseFloat(document.getElementById(`alis_${item.id}`).value || 0);
      const satis = parseFloat(document.getElementById(`satis_${item.id}`).value || 0);

      const ref = doc(db, "users", uid, "prices", item.id);
      await setDoc(ref, { alis, satis }, { merge: true });
    }
    alert("✅ Fiyatlar başarıyla kaydedildi!");
  } catch (error) {
    console.error("❌ Fiyat kaydı hatası:", error);
    alert("Hata oluştu: " + error.message);
  }
}

// ------------------- FIRESTORE’DAN FİYATLARI OKU -------------------
async function loadPrices(uid) {
  const pricesData = {};
  try {
    for (const item of EXCHANGE_TYPES) {
      const ref = doc(db, "users", uid, "prices", item.id);
      const snap = await getDoc(ref);
      if (snap.exists()) pricesData[item.id] = snap.data();
      else pricesData[item.id] = { alis: 0, satis: 0 };
    }
    fillTableWithData(pricesData);
  } catch (error) {
    console.error("❌ Fiyat okuma hatası:", error);
    alert("Fiyatlar yüklenemedi: " + error.message);
  }
}

// ------------------- AUTH DURUMUNU KONTROL ET -------------------
const saveBtn = document.getElementById("saveBtn");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    console.warn("Kullanıcı oturum açmamış, yönlendiriliyor...");
    window.location.href = "../index.html";
    return;
  }

  debugger
  console.log("Aktif kullanıcı UID:", user.uid);

  // 🔹 Admin kontrolü
  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);

  const topButtons = document.getElementById("topButtons");

  if (adminSnap.exists()) {
    topButtons.innerHTML = topButtons.innerHTML.concat(`
      <button id="adminPanelBtn" class="newUserBtn backgroundColor">Admin Paneli</button>
      <button id="homeBtn" class="homeBtn backgroundColor">🏠 Ana Sayfa</button>
      <button id="addImage" class="addImage backgroundColor">Logo Yükle</button>
      <button id="logoutBtn" class="logoutBtn backgroundColor">🔒 Çıkış Yap</button>
    `);
  } else {
    topButtons.innerHTML = topButtons.innerHTML.concat(`
      <button id="homeBtn" class="homeBtn backgroundColor">🏠 Ana Sayfa</button>
      <button id="addImage" class="addImage backgroundColor">Logo Yükle</button>
      <button id="logoutBtn" class="logoutBtn backgroundColor">🔒 Çıkış Yap</button>
    `);
  }

  // 🔹 Buton event'leri
  document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth)
      .then(() => (window.location.href = "../index.html"))
      .catch((error) => alert("Çıkış hatası: " + error.message));
  });

  if (document.getElementById("adminPanelBtn")) {
    document.getElementById("adminPanelBtn").addEventListener("click", () => {
      window.location.href = "../adminPanel/adminPanel.html";
    });
  }

  document.getElementById("addImage").addEventListener("click", () => {
    window.location.href = "../uploadLogos/uploadLogos.html";
  });

  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "../livePrices/livePrices.html";
  });

  // 🔹 Fiyatları yükle ve kaydet
  await loadPrices(user.uid);
  saveBtn.onclick = () => savePrices(user.uid);
});
