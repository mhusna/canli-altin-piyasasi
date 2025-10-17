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
socket.on("connect", () => console.log("Bağlandı!"));
socket.on("price_changed", (data) => {
  data.forEach((item) => {
    findElementAndFill(item.code, item.alis, item.satis, item.dir);
  });
});

// Fiyat güncelleme fonksiyonları
const findElementAndFill = (code, alis, satis, dir) => {
  const urunSatir = document.getElementById(code);
  if (!urunSatir) return;

  const alisElement = urunSatir.querySelector(".alis");
  const satisElement = urunSatir.querySelector(".satis");

  checkValuesAndDisplay(alisElement, alis, dir.alis_dir === "down" ? true : false);
  checkValuesAndDisplay(satisElement, satis, dir.satis_dir === "down" ? true : false);
};

const checkValuesAndDisplay = (element, newValue, isDown) => {
  isDown ? (element.style.background = "red") : (element.style.background = "green");
  element.innerText = newValue;
};

// Saat kontrolü için interval
setInterval(manageSocketConnection, 1000 * 60);