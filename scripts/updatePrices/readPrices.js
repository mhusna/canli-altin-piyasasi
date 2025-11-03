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
  {
    id: "BILEZIK22",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR8",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.32,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR14",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.575,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR18",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.7,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR22",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR24",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.995,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "CEYREK_YENI",
    haremId: "CEYREK_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "CEYREK_ESKI",
    haremId: "CEYREK_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "YARIM_YENI",
    haremId: "YARIM_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "YARIM_ESKI",
    haremId: "YARIM_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "TEK_ESKI",
    haremId: "TEK_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "TEK_YENI",
    haremId: "TEK_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "ATA_YENI",
    haremId: "ATA_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "RESAT",
    haremId: "ATA_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "GRAMESE_YENI",
    haremId: "CEYREK_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremAlis) * 10) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremSatis) * 10) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "GRAMESE_ESKI",
    haremId: "CEYREK_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremAlis) * 10) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremSatis) * 10) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "USDTRY",
    haremId: "USDTRY",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "EURTRY",
    haremId: "EURTRY",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "GUMUSTRY",
    haremId: "GUMUSTRY",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1000,
    satisMilyem: 1000,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
];

const saveBtn = document.getElementById("saveBtn");

// --- Ürünleri tabloya ekle ---
function fillTableWithData(data = {}) {
  EXCHANGE_TYPES.forEach((item) => {
    const urunSatir = document.getElementById(item.id);
    if (!urunSatir) return;

    const alisElement = urunSatir.querySelector(".alis");
    const satisElement = urunSatir.querySelector(".satis");

    alisElement.innerHTML += `
      <input 
        type="number"
        class="form-control"
        id="alis_${item.id}" 
        value="${data[item.id].alis > 0 ? data[item.id].alis : ""}"
        placeholder="${item.alisMilyem}"
      >
    `;

    satisElement.innerHTML += `
      <input 
        type="number"
        class="form-control"
        id="satis_${item.id}" 
        value="${data[item.id].satis > 0 ? data[item.id].satis : ""}"
        placeholder="${item.satisMilyem}"
      >
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
  const pricesData = {};
  for (const item of EXCHANGE_TYPES) {
    const ref = doc(db, "users", uid, "prices", item.id);
    const snap = await getDoc(ref);
    if (snap.exists()) pricesData[item.id] = snap.data();
    else pricesData[item.id] = { alis: 0, satis: 0};
  }

  fillTableWithData(pricesData);
}

// --- Kullanıcı girişi kontrolü ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const tokenResult = await user.getIdTokenResult(true);
    const topButtons = document.getElementById('topButtons');
    
    if (tokenResult.claims.admin) {
      topButtons.innerHTML = `
        <button id="newUserBtn" class="newUserBtn backgroundColor">
          ➕ Yeni Kullanıcı Ekle
        </button>
        <button id="homeBtn" class="homeBtn backgroundColor">
          🏠 Ana Sayfa
        </button>
        <button id="logoutBtn" class="logoutBtn backgroundColor">
          🔒 Çıkış Yap
        </button>
      `;
    }
    else {
      topButtons.innerHTML = `
        <button id="homeBtn" class="homeBtn backgroundColor">
          🏠 Ana Sayfa
        </button>
        <button id="logoutBtn" class="logoutBtn backgroundColor">
          🔒 Çıkış Yap
        </button>
      `;
    }

    if(document.getElementById("newUserBtn")) {
      document.getElementById("newUserBtn").addEventListener("click", () => {
        window.location.href = "/register.html";
      });
    }
    document.getElementById("homeBtn").addEventListener("click", () => {
      window.location.href = "/livePrices.html"; // Ana sayfa linki
    });

    document.getElementById("logoutBtn").addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          window.location.href = "/index.html"; // Çıkış sonrası yönlendirme
        })
        .catch((error) => {
          console.error("Çıkış yapılamadı:", error);
          alert("Çıkış sırasında bir hata oluştu!");
        });
    });

    await loadPrices(user.uid);
    saveBtn.onclick = () => savePrices(user.uid);
  } else {
    window.location.href = "index.html"; // giriş yoksa login sayfasına yönlendir
  }
});