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
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { checkUserIsExpired, setImage } from "../utils/userUtils.js";
import { EXCHANGE_TYPES, firebaseConfig } from "../models/commonModels.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


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
    window.location.href = "../livePrices/livePrices.html";
  } catch (error) {
    console.error("❌ Fiyat kaydı hatası:", error);
    alert("Hata oluştu: " + error.message);
  }
}

// ------------------- FIRESTORE’DAN FİYATLARI (GERÇEK ZAMANLI) OKU -------------------
function loadPrices(uid) {
  try {
    const pricesRef = collection(db, "users", uid, "prices");

    // Gerçek zamanlı dinleyici: Firestore'daki herhangi bir değişiklikte tetiklenir
    onSnapshot(
      pricesRef,
      (snapshot) => {
        const pricesData = {};
        snapshot.forEach((docSnap) => {
          pricesData[docSnap.id] = docSnap.data();
        });

        // Eksik türler için varsayılan değerler ekle
        EXCHANGE_TYPES.forEach((item) => {
          if (!pricesData[item.id]) pricesData[item.id] = { alis: 0, satis: 0 };
        });

        fillTableWithData(pricesData);
      },
      (error) => {
        console.error("❌ Fiyat dinleyici hatası:", error);
        alert("Fiyatlar dinlenemiyor: " + error.message);
      }
    );
  } catch (error) {
    console.error("❌ Fiyat dinleyici kurulurken hata:", error);
    alert("Fiyat dinleyici kurulamadı: " + error.message);
  }
}

// ------------------- AUTH DURUMUNU KONTROL ET -------------------

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  await checkUserIsExpired(user.uid, db, auth);

  // 🔹 Admin kontrolü
  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);

  const topButtons = document.getElementById("topButtons");

  if (adminSnap.exists()) {
    topButtons.innerHTML = topButtons.innerHTML.concat(`
      <button id="saveBtn" class="backgroundColor">💾 Kaydet</button>
      <button id="adminPanelBtn" class="newUserBtn backgroundColor">Admin Paneli</button>
      <button id="homeBtn" class="homeBtn backgroundColor">🏠 Ana Sayfa</button>
      <button id="addImage" class="addImage backgroundColor">Logo Yükle</button>
      <button id="logoutBtn" class="logoutBtn backgroundColor">🔒 Çıkış Yap</button>
    `);
  } else {
    topButtons.innerHTML = topButtons.innerHTML.concat(`
      <button id="saveBtn" class="backgroundColor">💾 Kaydet</button>
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

  document.getElementById("saveBtn").addEventListener("click", () => {
    savePrices(user.uid);
  });

  // 🔹 Fiyatları yükle ve kaydet
  await loadPrices(user.uid);
});