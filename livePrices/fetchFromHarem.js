import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { checkUserIsExpired, setImage } from "./utils/userUtils.js";
import { getProfitsAndFillArray, fillPricesToExchangeTypes } from "../utils/priceUtils.js";
import { findElementAndFill } from "../utils/domUtils.js";

const EXCHANGE_TYPES = [
  {
    id: "HAS",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: true,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "BILEZIK22",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0,
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: false,
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
    format: true,
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
    format: true,
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
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis * 1000) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis * 1000) * this.satisMilyem + Number(this.satisKar);
    },
  },
];

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

// DB'den kârları oku.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const socket = io("https://socketweb.haremaltin.com", {
  transports: ["websocket"],
});

// Son fiyat güncelleme zamanını izle
let lastPriceUpdate = Date.now();
// Uyarı göstergesi kontrol süresi (ms)
const STALE_THRESHOLD_MS = 3000; // 3 saniye

function ensureStaleWarningElement() {
  let el = document.getElementById("staleWarning");
  if (!el) {
    el = document.createElement("div");
    el.id = "staleWarning";
    el.innerText = "GÜNCEL FİYAT OKUNAMADI !";
    el.style.position = "fixed";
    el.style.right = "10px";
    el.style.zIndex = "9999";
    el.style.background = "#f00";
    el.style.color = "#fff";
    el.style.padding = "10px 10px";
    el.style.borderRadius = "6px";
    el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
    el.style.fontWeight = "600";
    el.style.opacity = "0.9";
    el.style.display = "none";
    document.body.appendChild(el);
  }
  return el;
}

function showStaleWarning() {
  const el = ensureStaleWarningElement();
  el.style.display = "block";
}

function hideStaleWarning() {
  const el = document.getElementById("staleWarning");
  if (el) el.style.display = "none";
}

const manageSocketConnection = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 0 && currentHour < 6) {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket bağlantısı kapatıldı (Gece 12 - Sabah 6 arası).");
    }
  } else {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket bağlantısı tekrar açıldı (Sabah 6 sonrası).");
    }
  }
};

// Ürünlerin alış - satış fiyatlarını hesapla ve ekrana yansıt.
const calculateAndDisplayPrices = () => {
  EXCHANGE_TYPES.forEach((type) => {
    // Alış ve satış fiyatlarını hesapla.
    const totalAlis = type.alisHesap();
    const totalSatis = type.satisHesap();

    // Ekrana yansıt.
    findElementAndFill(type.id, totalAlis, totalSatis, type.format);
  });
}

/**
 * Girişi dinler, expire kontrolü yapar ve logoları yükler.
 */
onAuthStateChanged(auth, async (user) => {
  /** Tarayıcıdan yetkisiz girişleri engellemek için gerekli. */
  if (!user) {
    window.location.href = "../index.html";
    return;
  }
  await checkUserIsExpired(user.uid, db, auth);
  await setImage(user.uid);
});

/**
 * Ana metot, haremden güncel fiyatları alır.
 */
socket.on("price_changed", async (data) => {
  const items = Object.values(data);
  const haremData = Object.values(items[1]);

  // Haremden getirilen verilerle haremAlis - haremSatis alanlarını doldur.
  fillPricesToExchangeTypes(haremData, EXCHANGE_TYPES);
  await getProfitsAndFillArray(auth.currentUser.uid, db, EXCHANGE_TYPES);
  calculateAndDisplayPrices();

  //Has alış - satış fiyatlarını ekrana yaz.
  document.getElementById("has-alis").innerText = formatNumber(EXCHANGE_TYPES[0].haremAlis, 2);
  document.getElementById("has-satis").innerText = formatNumber(EXCHANGE_TYPES[0].haremSatis, 2);

  // Gelen her fiyat değişiminde zaman damgasını güncelle
  lastPriceUpdate = Date.now();
  // Eğer daha önce uyarı görünüyorsa gizle
  hideStaleWarning();
});

// Socket bağlantı durum olayları
socket.on("connect", () => {
  // Bağlandıktan sonra son güncellemeden uzun süre geçtiyse uyarıyı kontrol et
  if (Date.now() - lastPriceUpdate <= STALE_THRESHOLD_MS) hideStaleWarning();
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
  showStaleWarning();
});

socket.on("connect_error", (err) => {
  console.error("Socket connect_error:", err);
  showStaleWarning();
});

socket.on("reconnect", (attempt) => {
  console.log("Socket reconnected, attempt:", attempt);
  // yeniden bağlandığında uyarıyı gizle; gerçek fiyat güncellemesi gelince de gizlenecek
  hideStaleWarning();
});

// Saat kontrolü için interval
setInterval(manageSocketConnection, 3000);

// Periyodik kontrol: eğer son güncelleme STALE_THRESHOLD_MS'den uzun ise uyarı göster
setInterval(() => {
  const now = Date.now();
  if (!socket.connected || now - lastPriceUpdate > STALE_THRESHOLD_MS) {
    showStaleWarning();
  } else {
    hideStaleWarning();
  }
}, 1000);