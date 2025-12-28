import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { checkUserIsExpired, setImage } from "../utils/userUtils.js";
import { EXCHANGE_TYPES, firebaseConfig } from "../models/commonModels.js";
import { getProfits, saveProfits } from "../utils/priceUtils.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  handleTopButtons(topButtons, adminSnap.exists());

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
    saveProfits(user.uid, db, EXCHANGE_TYPES);
  });

  await getProfits(user.uid, db, EXCHANGE_TYPES);
});