import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

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
      return (Number(this.haremSatis) * 10)* this.satisMilyem + Number(this.satisKar);
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
      return (Number(this.haremSatis) * 10)* this.satisMilyem + Number(this.satisKar);
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

    EXCHANGE_TYPES.find((type) => {
      if (type.id === productId) {
        type.satisKar = data.satis.toFixed(2);
        type.alisKar = data.alis.toFixed(2);
      }
    });
  });
});

const socket = io("https://socketweb.haremaltin.com", {
  transports: ["websocket"],
});

const manageSocketConnection = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 0 && currentHour < 10) {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket bağlantısı kapatıldı (Gece 12 - Sabah 10 arası).");
    }
  } else {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket bağlantısı tekrar açıldı (Sabah 10 sonrası).");
    }
  }
};

// Socket olayları
socket.on("price_changed", (data) => {
  const items = Object.values(data);
  const firstItem = Object.values(items[1]);
  
  // Ürünleri haremden oku ve haremAlis - haremSatis alanlarını doldur.
  firstItem.forEach((item) => {
    EXCHANGE_TYPES.forEach((type) => {
      if(item.code === type.haremId) {
        type.haremAlis = item.alis;
        type.haremSatis = item.satis;
      }
    });
  });

  //#region Has alış - satış fiyatlarını ekrana yaz.
  const hasAlisElement = document.getElementById("has-alis");
  const hasSatisElement = document.getElementById("has-satis");

  hasAlisElement.innerText = formatNumber(EXCHANGE_TYPES[0].haremAlis);
  hasSatisElement.innerText = formatNumber(EXCHANGE_TYPES[0].haremSatis);
  //#endregion

  //#region Ürünlerin alış - satış fiyatlarını hesapla ve ekrana yansıt.
  EXCHANGE_TYPES.forEach((type) => {

    // Alış ve satış fiyatlarını hesapla.
    const totalAlis = type.alisHesap();
    const totalSatis = type.satisHesap();

    // Ekrana yansıt.
    findElementAndFill(type.id, totalAlis, totalSatis);
  });
  //#endregion
});

// helper: locale-aware format (2 ondalık, Türkçe)
const formatNumber = (val) => {
  const n = Number(val);
  if (isNaN(n)) return "-";
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// helper: parse displayed (ör. "5.850,00" -> 5850.00)
const parseDisplayNumber = (str) => {
  if (typeof str === "number") return str;
  if (!str) return 0;
  const cleaned = String(str)
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
};

// Fiyat güncelleme fonksiyonları
const findElementAndFill = (code, alis, satis) => {
  const urunSatir = document.getElementById(code);
  if (!urunSatir) return;

  const alisElement = urunSatir.querySelector(".alis");
  const satisElement = urunSatir.querySelector(".satis");

  // karşılaştırmaları numeric yap
  const currentAlis = parseDisplayNumber(alisElement.innerText);
  const currentSatis = parseDisplayNumber(satisElement.innerText);

  const alisDown = handleRate(currentAlis, Number(alis));
  const satisDown = handleRate(currentSatis, Number(satis));

  checkValuesAndDisplay(alisElement, alis, alisDown);
  checkValuesAndDisplay(satisElement, satis, satisDown);
};

// Fiyat arttı mı azaldı mı belirler.
const handleRate = (currentValue, newValue) => {
  if (currentValue > newValue) return "down";
  else if (currentValue < newValue) return "up";
  return "equal"
}

const checkValuesAndDisplay = (element, newValue, rate) => {
  if (newValue === 0 || isNaN(newValue)) return;

  const originalBg = getComputedStyle(element).backgroundColor;

  if (!element.classList.contains("footer")) {
    element.style.transition = "background 0.5s ease-in-out";

    if (rate === "down") {
      element.style.background = "#ffd6d6ff"; // kırmızı
    } else if (rate === "up") {
      element.style.background = "#e1ffd6ff"; // yeşil
    }

    // 2 saniye sonra geri griye dönsün
    setTimeout(() => {
      element.style.background = "#fff";
    }, 500);
  }

  const deger = formatNumber(newValue); // iki ondalık gösterim, locale ile
  element.innerText = deger;
}

// Saat kontrolü için interval
setInterval(manageSocketConnection, 3000);
