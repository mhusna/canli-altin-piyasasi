// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { 
  getFirestore,
  doc, 
  getDoc
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Firebase ayarları
const firebaseConfig = {
  apiKey: "AIzaSyDIGME8_6gN9bI1SCadrsx93QhQRCfC-dM",
  authDomain: "canli-altin-app.firebaseapp.com",
  databaseURL: "https://canli-altin-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "canli-altin-app",
  storageBucket: "canli-altin-app.firebasestorage.app",
  messagingSenderId: "675863034125",
  appId: "1:675863034125:web:301006180c35a5f0549844",
  measurementId: "G-V3YHGPSB8M"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Form elemanlarını yakala
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    debugger
  } catch (error) {
    alert("Giriş hatası: " + error.message);
  }
});

// Kullanıcı zaten giriş yaptıysa otomatik yönlendir
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Kullanıcı bilgileri bulunamadı!");
      return;
    }

    const userData = userSnap.data();
    const expireDate = userData.expireDate?.toDate
      ? userData.expireDate.toDate()
      : new Date(userData.expireDate);
    
    const currentDate = new Date();

    if (currentDate > expireDate) {
      alert("Hesabınızın süresi dolmuş. Lütfen yönetici ile iletişime geçin.");
      await signOut(auth);
      return;
    }

    window.location.href = "../livePrices/livePrices.html";
  }
});