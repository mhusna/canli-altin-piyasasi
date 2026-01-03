import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { checkUserIsExpired } from "../utils/userUtils.js";
import { firebaseConfig } from "../models/commonModels.js";
import { supabaseUrl, supabaseAnonKey } from "../utils/models.js";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Firebase başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logoInput = document.getElementById("logoInput");
const adInput = document.getElementById("adInput");
const uploadBtn = document.getElementById("uploadBtn");

let currentUser = null;
let isAdmin = false;

// Kullanıcıyı bekle
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await checkUserIsExpired(user.uid, db, auth);
    currentUser = user;

    // tokenResult = await user.getIdTokenResult(true);
    const topButtons = document.getElementById('topButtons');

    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);
    
    if (adminSnap.exists()) {
      isAdmin = true;
      topButtons.innerHTML = `
            <button id="adminPanelBtn" class="newUserBtn backgroundColor">
              Admin Paneli
            </button>
            <button id="homeBtn" class="homeBtn backgroundColor">
              🏠 Ana Sayfa
            </button>
            <button id="logoutBtn" class="logoutBtn backgroundColor">
              🔒 Çıkış Yap
            </button>
          `;
    }
    else {
      // Admin değilse reklam yükleme alanını gizle
      document.getElementById('ad-container').style.display = 'none';
      topButtons.innerHTML = `
            <button id="homeBtn" class="homeBtn backgroundColor">
              🏠 Ana Sayfa
            </button>
            <button id="logoutBtn" class="logoutBtn backgroundColor">
              🔒 Çıkış Yap
            </button>
          `;
    }

    if (document.getElementById("adminPanelBtn")) {
      document.getElementById("adminPanelBtn").addEventListener("click", () => {
        window.location.href = "../adminPanel/adminPanel.html";
      });
    }

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

  } else {
    window.location.href = "../index.html";
  }
});

// Supabase yükleme fonksiyonu
const uploadToServer = async (preName, bucketName, file) => {
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const path = `users/${currentUser.uid}/${preName}_${Date.now()}_${safeName}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("Yükleme hatası:", error);
    alert("Yükleme hatası: " + error.message);
    return null;
  }

  const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path);
  return urlData.publicUrl;
};

uploadBtn.addEventListener("click", async () => {
  const logo = logoInput.files[0];
  const ad = adInput.files[0];

  if (!logo || (isAdmin && !ad)) {
    alert("Lütfen bir dosya seçin.");
    return;
  }

  const logoPublicUrl = await uploadToServer('logo', 'logos', logo);

  let adPublicUrl = null;
  if(isAdmin) {
    adPublicUrl = await uploadToServer('ad', 'ads', ad);
  }

  if (!logoPublicUrl || (isAdmin && !adPublicUrl)) return;

  await supabase.from("profiles").upsert({
    id: currentUser.uid,
    logo_url: logoPublicUrl,
    updated_at: new Date().toISOString()
  });

  if (isAdmin) {
    await supabase.from("ads").upsert({
      id: currentUser.uid,
      ad_url: adPublicUrl,
      updated_at: new Date().toISOString()
    });
  }

  alert("Yükleme başarılı!");
});