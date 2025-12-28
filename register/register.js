import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth, signOut, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { firebaseConfig } from "../models/commonModels.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }
});

const form = document.getElementById("registerForm");
const message = document.getElementById("message");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

// Sayfa yüklendiğinde bugünün tarihini başlangıç tarihi olarak ayarla
document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0];
  startDateInput.value = today;

  // 30 gün sonrasını bitiş tarihi olarak ayarla
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  endDateInput.value = futureDate.toISOString().split('T')[0];
});

// Form validasyonu
function validateDates() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);

  if (endDate <= startDate) {
    message.textContent = "❌ Bitiş tarihi başlangıç tarihinden sonra olmalıdır!";
    message.className = "mt-3 text-center text-danger";
    return false;
  }

  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Tarih validasyonu
  if (!validateDates()) {
    return;
  }

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  try {
    // 🔹 1. Kullanıcıyı Authentication'a kaydet
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔹 2. Firestore'da users koleksiyonuna kaydet
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      signUpDate: Timestamp.fromDate(new Date(startDate)),
      expireDate: Timestamp.fromDate(new Date(endDate)),
      registrationDate: serverTimestamp()
    });

    // 3️⃣ Kullanıcıya boş prices koleksiyonu oluştur
    await createEmptyPrices(user.uid);

    message.textContent = "✅ Kayıt başarılı! Kullanıcı Firestore'a eklendi.";
    message.className = "mt-3 text-center text-success";
    window.location.href = "../adminPanel/adminPanel.html";

  } catch (error) {
    message.textContent = "❌ Hata: " + error.message;
    message.className = "mt-3 text-center text-danger";
  }
});

// --- Boş prices alt koleksiyonu oluştur ---
async function createEmptyPrices(uid) {
  const priceIds = [
    "BILEZIK22", "AYAR8", "AYAR14", "AYAR18", "AYAR22", "AYAR24",
    "CEYREK_YENI", "CEYREK_ESKI", "YARIM_YENI", "YARIM_ESKI",
    "TEK_ESKI", "TEK_YENI", "ATA_YENI", "RESAT",
    "GRAMESE_YENI", "GRAMESE_ESKI", "USDTRY", "EURTRY", "GUMUSTRY"
  ];

  for (const id of priceIds) {
    await setDoc(doc(db, "users", uid, "prices", id), { alis: 0, satis: 0 });
  }

}


document.getElementById("adminPanelBtn").addEventListener("click", () => {
  window.location.href = "../adminPanel/adminPanel.html";
});

document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "../livePrices/livePrices.html"; // Ana sayfa linki
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "../index.html"; // Çıkış sonrası yönlendirme
    })
    .catch((error) => {
      console.error("Çıkış yapılamadı:", error);
      alert("Çıkış sırasında bir hata oluştu!");
    });
});