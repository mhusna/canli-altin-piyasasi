/**
 * Elementi bulup fiyatı yazar.
 * @param {*} code 
 * @param {*} alis 
 * @param {*} satis 
 * @param {*} format 
 * @returns 
 */
export const findElementAndFill = (code, alis, satis, format) => {
  const urunSatir = document.getElementById(code);
  if (!urunSatir) return;

  const alisElement = urunSatir.querySelector(".alis");
  const satisElement = urunSatir.querySelector(".satis");

  // karşılaştırmaları numeric yap
  const currentAlis = parseDisplayNumber(alisElement.innerText);
  const currentSatis = parseDisplayNumber(satisElement.innerText);

  const alisDown = handleRate(currentAlis, Number(alis));
  const satisDown = handleRate(currentSatis, Number(satis));

  checkValuesAndDisplay(alisElement, alis, alisDown, format);
  checkValuesAndDisplay(satisElement, satis, satisDown, format);
};

/**
 * Helper: parse displayed (ör. "5.850,00" -> 5850.00)
 * @param {*} str 
 * @returns 
 */
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

/**
 * Fiyat arttı mı azaldı mı belirler.
 * @param {*} currentValue 
 * @param {*} newValue 
 * @returns 
 */
const handleRate = (currentValue, newValue) => {
  if (currentValue > newValue) return "down";
  else if (currentValue < newValue) return "up";
  return "equal"
}

/**
 * Fiyat değişimini kontrol eder ve elementi günceller.
 * @param {*} element 
 * @param {*} newValue 
 * @param {*} rate 
 * @param {*} format 
 * @returns 
 */
const checkValuesAndDisplay = (element, newValue, rate, format) => {
  if (newValue === 0 || isNaN(newValue)) return;

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

  element.innerText = formatNumber(newValue, format ? 2 : 0); // iki ondalık gösterim, locale ile
}

/**
 * Helper: locale-aware format (2 ondalık, Türkçe)
 * @param {*} val 
 * @param {*} digits 
 * @returns 
 */
export const formatNumber = (val, digits) => {
  const n = Number(val);
  if (isNaN(n)) return "-";
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

/**
 * Saat bilgisini döndürür.
 * @returns 
 */
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export const handleTopButtons = (topButtonsContainer, isAdmin) => {
  if (isAdmin) {
    topButtonsContainer.innerHTML = topButtonsContainer.innerHTML.concat(`
      <button id="saveBtn" class="backgroundColor">💾 Kaydet</button>
      <button id="adminPanelBtn" class="newUserBtn backgroundColor">Admin Paneli</button>
      <button id="homeBtn" class="homeBtn backgroundColor">🏠 Ana Sayfa</button>
      <button id="addImage" class="addImage backgroundColor">Logo Yükle</button>
      <button id="logoutBtn" class="logoutBtn backgroundColor">🔒 Çıkış Yap</button>
    `);
  }
  else {
    topButtonsContainer.innerHTML = topButtonsContainer.innerHTML.concat(`
      <button id="saveBtn" class="backgroundColor">💾 Kaydet</button>
      <button id="homeBtn" class="homeBtn backgroundColor">🏠 Ana Sayfa</button>
      <button id="addImage" class="addImage backgroundColor">Logo Yükle</button>
      <button id="logoutBtn" class="logoutBtn backgroundColor">🔒 Çıkış Yap</button>
    `);
  }
}

/** Saat bilgisini günceller. */
setInterval(() => {
  const timeElement = document.querySelector('.timeContainer');
  if (timeElement) {
    timeElement.textContent = `${getCurrentTime()}`;
  }
}, 1000);

/** Ayarlar butonuna tıklanınca yönlendirme yapar. */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("goToUpdateBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "../updatePrices/updatePrices.html";
  });
});
