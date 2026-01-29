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
    // Socket.IO Engine.IO protocol - EIO=4 for v4
    const wsUrl = "wss://hrmsocketonly.haremaltin.com/socket.io/?EIO=4&transport=websocket";

    const ws = new WebSocket(wsUrl, {
      headers: {
        "Origin": "https://www.haremaltin.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
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

      // Socket.IO protocol: 0 = open, 2 = ping, 3 = pong, 4 = message
      // 42 = message with event data
      if (message.startsWith("42")) {
        try {
          // Remove "42" prefix and parse JSON
          const jsonStr = message.substring(2);
          const parsed = JSON.parse(jsonStr);

          // parsed = ["price_changed", {...data...}]
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
        // Ping - respond with pong
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
