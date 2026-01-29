const WebSocket = require("ws");

// Cache için global değişkenler
let cachedPrices = null;
let lastUpdateTime = 0;
const CACHE_TTL_MS = 500;

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Cache kontrolü
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
    const priceData = await fetchPriceFromWebSocket();
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

function fetchPriceFromWebSocket() {
  return new Promise((resolve, reject) => {
    const wsUrl = "wss://hrmsocketonly.haremaltin.com/socket.io/?EIO=4&transport=websocket";

    const ws = new WebSocket(wsUrl, {
      headers: {
        "Origin": "https://www.haremaltin.com",
        "Referer": "https://www.haremaltin.com/",
        "Host": "hrmsocketonly.haremaltin.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
        "Sec-WebSocket-Version": "13"
      },
      perMessageDeflate: false
    });

    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("WebSocket timeout"));
    }, 8000);

    ws.on("open", () => {
      console.log("WebSocket connected");
    });

    ws.on("message", (data) => {
      const message = data.toString();

      // Socket.IO protocol
      if (message.startsWith("42")) {
        try {
          const jsonStr = message.substring(2);
          const parsed = JSON.parse(jsonStr);

          if (parsed[0] === "price_changed" && parsed[1]) {
            clearTimeout(timeout);
            ws.close();

            const items = Object.values(parsed[1]);
            const haremData = Object.values(items[1]);
            resolve(haremData);
          }
        } catch (e) {
          console.error("JSON parse error:", e.message);
        }
      } else if (message === "2") {
        ws.send("3");
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      ws.close();
      reject(new Error("WebSocket error: " + err.message));
    });

    ws.on("close", () => {
      clearTimeout(timeout);
    });
  });
}
