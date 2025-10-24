
const EXCHANGE_TYPES = [
  {
    id: "BILEZIK22",
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "AYAR22",
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "AYAR8",
    alisMilyem: 0.32,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "AYAR14",
    alisMilyem: 0.575,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "AYAR18",
    alisMilyem: 0.7,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "AYAR24",
    alisMilyem: 0.995,
    satisMilyem: 1.1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "CEYREK_YENI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "CEYREK_ESKI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "YARIM_YENI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "YARIM_ESKI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "TEK_ESKI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "TEK_YENI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "ATA_YENI",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "RESAT",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "GRAMESE_YENI",
    alisMilyem: 10,
    satisMilyem: 10,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "GRAMESE_ESKI",
    alisMilyem: 10,
    satisMilyem: 10,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "USDTRY",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "EURTRY",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
  {
    id: "GUMUSTRY",
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0
  },
];


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
      if(type.id === productId) {
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

  let has = {};
  let ata = {};
  let resat = {};
  firstItem.forEach((item) => {
    if (item.code === "ALTIN") {
      has = item;
    } else if (item.code === "ATA_YENI") {
      ata = item;
      resat = item;
    }
  });

  const hasAlisElement = document.getElementById("has-alis");
  const hasSatisElement = document.getElementById("has-satis");

  hasAlisElement.innerText = formatNumber(has.alis);
  hasSatisElement.innerText = formatNumber(has.satis);

  EXCHANGE_TYPES.forEach((type) => {
    const totalAlis = has.alis * type.alisMilyem + type.alisKar;
    const totalSatis = has.satis * type.satisMilyem + type.satisKar;

    if (type.id === "ATA") 
      findElementAndFill(type.id, ata.alis + type.alisKar, ata.satis + type.satisKar);
    else if (type.id === "RESAT")
      findElementAndFill(type.id, resat.alis + type.alisKar, resat.satis + type.satisKar);
    else 
      findElementAndFill(type.id, totalAlis, totalSatis);
  });
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

  const alisDown = currentAlis < Number(alis);
  const satisDown = currentSatis < Number(satis);

  checkValuesAndDisplay(alisElement, alis, alisDown);
  checkValuesAndDisplay(satisElement, satis, satisDown);
};

const checkValuesAndDisplay = (element, newValue, isDown) => {
  if (newValue === 0 || isNaN(newValue)) return;

  if (!element.classList.contains("footer")) {
    element.style.transition = "background 2s ease";
    isDown
      ? (element.style.background = "#efafaa")
      : (element.style.background = "#daf3d0");
  }
  const deger = formatNumber(newValue); // iki ondalık gösterim, locale ile
  element.innerText = deger;
};

// Saat kontrolü için interval
setInterval(manageSocketConnection, 2000);
