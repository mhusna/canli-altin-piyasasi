import { collection, doc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Kullanıcının kâr bilgilerini alır ve EXCHANGE_TYPES dizisine set eder.
 * @param {*} userId 
 * @param {*} db 
 * @param {*} targetArray 
 */
export const getProfitsAndFillArray = async (userId, db, targetArray) => { 
  const pricesCol = collection(db, "users", userId, "prices");
  const snapshot = await getDocs(pricesCol);

  snapshot.forEach((doc) => {
    const data = doc.data();
    const productId = doc.id; // Örn: "BILEZIK22"

    targetArray.find((type) => {
      if (type.id === productId) {
        type.satisKar = data.satis.toFixed(2);
        type.alisKar = data.alis.toFixed(2);
      }
    });
  });
}

/**
 * Kullanıcının kâr bilgilerini alır ve EXCHANGE_TYPES dizisine set eder.
 * @param {*} userId 
 * @param {*} db 
 * @param {*} targetArray 
 */
export const fillPricesToExchangeTypes = (data, targetArray) => {
  data.forEach((item) => {
    targetArray.forEach((exchange) => {
      if (item.code === exchange.haremId) {
        exchange.haremAlis = item.alis;
        exchange.haremSatis = item.satis;
      }
    });
  });
}

/**
 * Kullanıcının kâr bilgilerini db'ye kaydeder.
 * @param {*} uid 
 * @param {*} db 
 * @param {*} targetArray 
 */
export const saveProfits = async (uid, db, targetArray) => {
  try {
    for (const item of targetArray) {
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

/**
 * Kullanıcının kâr bilgilerini okur ve ekrana doldurur.
 * @param {*} uid 
 * @param {*} db 
 * @param {*} targetArray 
 */
export const getProfits = async (uid, db, targetArray) => {
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
        targetArray.forEach((item) => {
          if (!pricesData[item.id]) pricesData[item.id] = { alis: 0, satis: 0 };
        });

        fillTableWithData(pricesData, targetArray);
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

/**
 * Ekrandaki tabloyu db'den okunan kârlar ile doldurur.
 * @param {*} data 
 * @param {*} targetArray 
 */
const fillTableWithData = (data = {}, targetArray) => {
  targetArray.forEach((item) => {
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