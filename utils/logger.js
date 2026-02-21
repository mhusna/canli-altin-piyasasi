
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const logClientError = async (payload = {}) => {
  try {
    const nav = navigator;
    const hostname = location.hostname;

    // 🔎 IPv6 heuristic
    const ipv6Hint =
      hostname.includes(":") ||           // literal ipv6
      hostname.startsWith("[") ||         // bracket ipv6
      nav.connection?.type === "cellular"; // bazı TV modemleri

    await addDoc(collection(db, "client_logs"), {
      ...payload,

      // 🔑 kullanıcı
      userId: auth.currentUser?.uid || null,

      // 🌐 page
      url: location.href,
      referrer: document.referrer,
      pageVisibility: document.visibilityState,

      // 🧠 browser
      userAgent: nav.userAgent,
      platform: nav.platform,
      language: nav.language,
      languages: nav.languages,
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack,

      // 📶 network
      online: nav.onLine,
      connectionType: nav.connection?.effectiveType || "unknown",
      downlink: nav.connection?.downlink ?? null,
      rtt: nav.connection?.rtt ?? null,
      saveData: nav.connection?.saveData ?? false,

      // 🖥️ device
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio,
      deviceMemory: nav.deviceMemory ?? null,
      hardwareConcurrency: nav.hardwareConcurrency ?? null,

      // 📺 Smart TV detection
      isSmartTV:
        /smart-tv|smarttv|tizen|webos|netcast|viera|aquos|bravia|hisense|vestel/i.test(
          nav.userAgent
        ),

      // 🧪 IPv6 tahmini
      ipv6Hint,

      // 🌍 env
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp_ms: Date.now(),

      ts: serverTimestamp()
    });
  } catch (e) {
    console.error("Log gönderilemedi", e);
  }
};