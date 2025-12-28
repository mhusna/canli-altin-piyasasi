import { collection, getDocs, } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

/**
 * Kullanıcının kâr bilgilerini alır ve EXCHANGE_TYPES dizisine set eder.
 * @param {*} userId 
 * @param {*} db 
 * @param {*} targetArray 
 */
export const getAndSetProfits = async (userId, db, targetArray) => { 
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