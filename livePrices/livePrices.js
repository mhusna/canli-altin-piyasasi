import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { checkUserIsExpired, setImage } from "../utils/userUtils.js";
import { getProfitsAndFillArray, fillPricesToExchangeTypes, listenProfitsAndRefreshLivePrices } from "../utils/priceUtils.js";
import { findElementAndFill, formatNumber } from "../utils/domUtils.js";
import { EXCHANGE_TYPES, firebaseConfig } from "../models/commonModels.js";

// DB'den kârları oku.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// const socket = io("https://socketweb.haremaltin.com", {
//   transports: ["websocket"],
// });
const socket = io("https://hrmsocketonly.haremaltin.com", {
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
  await listenProfitsAndRefreshLivePrices(user.uid, db, EXCHANGE_TYPES);

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

setInterval(async () => {
  await checkUserIsExpired(uid, db, auth);
}, 5 * 60 * 1000);