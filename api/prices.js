const { io } = require("socket.io-client");

// Cache için global değişkenler (cold start'lar arasında korunur)
let cachedPrices = null;
let lastUpdateTime = 0;
const CACHE_TTL_MS = 500; // 500ms cache

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Cache hala geçerliyse cached veriyi döndür
  const now = Date.now();
  if (cachedPrices && now - lastUpdateTime < CACHE_TTL_MS) {
    return res.status(200).json({
      success: true,
      data: cachedPrices,
      cached: true,
      timestamp: lastUpdateTime,
    });
  }

  try {
    const priceData = await fetchPriceFromSocket();
    cachedPrices = priceData;
    lastUpdateTime = Date.now();

    return res.status(200).json({
      success: true,
      data: priceData,
      cached: false,
      timestamp: lastUpdateTime,
    });
  } catch (error) {
    console.error("Price fetch error:", error.message);

    // Hata durumunda eski cache varsa onu döndür
    if (cachedPrices) {
      return res.status(200).json({
        success: true,
        data: cachedPrices,
        cached: true,
        stale: true,
        timestamp: lastUpdateTime,
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

function fetchPriceFromSocket() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      socket.disconnect();
      reject(new Error("Socket timeout - no data received"));
    }, 8000); // 8 saniye timeout

    const socket = io("https://hrmsocketonly.haremaltin.com", {
      transports: ["websocket"],
      timeout: 5000,
      reconnection: false,
    });

    socket.on("connect", () => {
      console.log("Socket connected to Harem");
    });

    socket.on("price_changed", (data) => {
      clearTimeout(timeout);
      socket.disconnect();

      const items = Object.values(data);
      const haremData = Object.values(items[1]);
      resolve(haremData);
    });

    socket.on("connect_error", (err) => {
      clearTimeout(timeout);
      socket.disconnect();
      reject(new Error("Socket connection error: " + err.message));
    });

    socket.on("error", (err) => {
      clearTimeout(timeout);
      socket.disconnect();
      reject(new Error("Socket error: " + err.message));
    });
  });
}
