import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { checkUserIsExpired, setImage, subscribeToImageChanges } from "../utils/userUtils.js";
import { getProfitsAndFillArray, fillPricesToExchangeTypes, listenProfitsAndRefreshLivePrices } from "../utils/priceUtils.js";
import { findElementAndFill, formatNumber } from "../utils/domUtils.js";
import { EXCHANGE_TYPES, firebaseConfig } from "../models/commonModels.js";
import $ from "jquery";
import "popper.js";
import "bootstrap";

window.jQuery = window.$ = $;

// DB'den kârları oku.
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


/**
 * Ana metot, haremden güncel fiyatları alır.
 */
const getDataFromAPI = async () => {
  try {
    let data;

    // ✅ Önce XHR dene (Smart TV safe)
    try {
      data = await getDataViaXHR();
    } catch (xhrError) {
      console.warn("XHR başarısız, fetch deneniyor:", xhrError.message);

      // Fetch varsa dene
      if (typeof fetch !== "undefined") {
        const response = await fetch("https://kuyumcufiyatekrani-api.com.tr");
        data = await response.json();
      } else {
        throw new Error("XHR ve Fetch başarısız");
      }
    }

    if (!data) {
      console.error("Veri alınamadı");
      return;
    }

    // Kullanıcı henüz giriş yapmadıysa işlemi atla
    if (!auth.currentUser) {
      return;
    }

    const items = Object.values(data);
    const haremData = Object.values(items[2]);

    fillPricesToExchangeTypes(haremData, EXCHANGE_TYPES);
    await getProfitsAndFillArray(auth.currentUser.uid, db, EXCHANGE_TYPES);
    calculateAndDisplayPrices();

    document.getElementById("has-alis").innerText =
      formatNumber(EXCHANGE_TYPES[0].haremAlis, 2);
    document.getElementById("has-satis").innerText =
      formatNumber(EXCHANGE_TYPES[0].haremSatis, 2);

    lastPriceUpdate = Date.now();
    hideStaleWarning();
  } catch (error) {
    console.error("getDataFromAPI hatası:", error.message);
  }
};


/**
 * XMLHttpRequest kullanarak veri al (eski cihazlar için fallback)
 */
const getDataViaXHR = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://kuyumcufiyatekrani-api.com.tr", true);
    xhr.timeout = 10000; // 10 saniye timeout
    
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (parseError) {
          const parseErrorMsg = "JSON parse hatası: " + parseError.message;
          console.error(parseErrorMsg);
          alert(parseErrorMsg);
          reject(new Error(parseErrorMsg));
        }
      } else {
        const statusErrorMsg = "HTTP Hatası: " + xhr.status;
        console.error(statusErrorMsg);
        alert(statusErrorMsg);
        reject(new Error(statusErrorMsg));
      }
    };
    
    xhr.onerror = () => {
      const networkErrorMsg = "Ağ hatası";
      console.error(networkErrorMsg);
      alert(networkErrorMsg);
      reject(new Error(networkErrorMsg));
    };
    
    xhr.ontimeout = () => {
      const timeoutErrorMsg = "İstek timeout";
      console.error(timeoutErrorMsg);
      alert(timeoutErrorMsg);
      reject(new Error(timeoutErrorMsg));
    };
    
    xhr.send();
  });
}

// Son fiyat güncelleme zamanını izle
let lastPriceUpdate = Date.now();
// Uyarı göstergesi kontrol süresi (ms)
const STALE_THRESHOLD_MS = 1500; // 3 saniye

function ensureStaleWarningElement() {
  let el = document.getElementById("staleWarning");
  if (!el) {
    el = document.createElement("div");
    el.id = "staleWarning";
    el.innerText = "!";
    el.style.position = "fixed";
    el.style.right = "28%";
    el.style.top = "0px";
    el.style.zIndex = "9999";
    el.style.background = "#f00";
    el.style.color = "#fff";
    el.style.padding = "15px 30px";
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

// Ürünlerin alış - satış fiyatlarını hesapla ve ekrana yansıt.
const calculateAndDisplayPrices = () => {
  EXCHANGE_TYPES.forEach((type) => {
    if (type.haremAlis === 0 || type.haremSatis === 0) {
      return;
    }
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

  // Supabase Realtime ile resim değişikliklerini dinle
  subscribeToImageChanges(user.uid);
});

// Saat kontrolü için interval
setInterval(getDataFromAPI, 1500);

// Periyodik kontrol: eğer son güncelleme STALE_THRESHOLD_MS'den uzun ise uyarı göster
setInterval(() => {
  const now = Date.now();
  if (now - lastPriceUpdate > STALE_THRESHOLD_MS) {
    showStaleWarning();
  } else {
    hideStaleWarning();
  }
}, 1000);

setInterval(async () => {
  // Kullanıcı giriş yapmışsa expire kontrolü yap
  if (auth.currentUser) {
    await checkUserIsExpired(auth.currentUser.uid, db, auth);
  }
}, 5 * 60 * 1000);