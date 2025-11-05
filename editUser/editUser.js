import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIGME8_6gN9bI1SCadrsx93QhQRCfC-dM",
  authDomain: "canli-altin-app.firebaseapp.com",
  projectId: "canli-altin-app",
  storageBucket: "canli-altin-app.appspot.com", // tercihen .appspot.com
  messagingSenderId: "675863034125",
  appId: "1:675863034125:web:301006180c35a5f0549844",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sayfa yüklendiğinde localStorage'dan verileri al
document.addEventListener('DOMContentLoaded', function () {
  loadUserDataFromStorage();
});

// localStorage'dan kullanıcı verilerini yükle
function loadUserDataFromStorage() {
  try {
    // localStorage'dan veriyi al
    const userData = localStorage.getItem('editUserData');

    if (userData) {
      // JSON'dan JavaScript objesine çevir
      const userInfo = JSON.parse(userData);

      console.log('localStorage\'dan alınan veriler:', userInfo);

      // Form alanlarını doldur
      populateForm(userInfo);

      // Kullanıcı bilgi kartını göster
      displayUserInfo(userInfo);

    } else {
      console.warn('localStorage\'da editUserData bulunamadı!');
      alert('Kullanıcı verileri bulunamadı. Ana sayfaya yönlendiriliyorsunuz.');
      window.location.href = '../adminPanel/adminPanel.html';
    }

  } catch (error) {
    console.error('localStorage verisi okunurken hata:', error);
    alert('Veri okuma hatası! Ana sayfaya yönlendiriliyorsunuz.');
    window.location.href = '../adminPanel/adminPanel.html';
  }
}

// Form alanlarını doldur
function populateForm(userInfo) {
  document.getElementById('userEmail').value = userInfo.email || '';
  document.getElementById('userUid').value = userInfo.uid || '';

  // Tarihleri düzenle (ISO formatından date input formatına)
  if (userInfo.signUpDate) {
    const signUpDate = new Date(userInfo.signUpDate);
    document.getElementById('signUpDate').value = formatDateForInput(signUpDate);
  }

  if (userInfo.expireDate) {
    const expireDate = new Date(userInfo.expireDate);
    document.getElementById('expireDate').value = formatDateForInput(expireDate);
  }
}

function dateDiffInDays(startDate, expireDate) {
  // Milisaniye cinsinden bir günün değeri
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Tarihleri UTC formatına çevir (saat dilimi problemlerini önlemek için)
  const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const utc2 = Date.UTC(expireDate.getFullYear(), expireDate.getMonth(), expireDate.getDate());

  // Gün farkını hesapla (expireDate - startDate)
  // Pozitif değer: expireDate gelecekte
  // Negatif değer: expireDate geçmişte
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Kullanıcı bilgilerini göster
function displayUserInfo(userInfo) {
  const userInfoCard = document.getElementById('userInfoCard');
  const userInfoDisplay = document.getElementById('userInfoDisplay');

  const signUpDate = new Date(userInfo.signUpDate);
  const expireDate = new Date(userInfo.expireDate);

  const remainingDays = dateDiffInDays(signUpDate, expireDate);

  userInfoDisplay.innerHTML = `
                <div class="row">
                    <div class="col-sm-4"><strong>Email:</strong></div>
                    <div class="col-sm-8">${userInfo.email}</div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-4"><strong>UID:</strong></div>
                    <div class="col-sm-8">${userInfo.uid}</div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-4"><strong>Kalan Gün:</strong></div>
                    <div class="col-sm-8"><span class="badge bg-info">${remainingDays} gün</span></div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-4"><strong>Başlangıç:</strong></div>
                    <div class="col-sm-8">${signUpDate.toLocaleDateString('tr-TR')}</div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-sm-4"><strong>Bitiş:</strong></div>
                    <div class="col-sm-8">${expireDate.toLocaleDateString('tr-TR')}</div>
                </div>
            `;

  userInfoCard.style.display = 'block';
}

// Tarih formatını input için düzenle (YYYY-MM-DD)
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Form gönderildiğinde
document.getElementById('editUserForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = {
    email: document.getElementById('userEmail').value,
    uid: document.getElementById('userUid').value,
    signUpDate: document.getElementById('signUpDate').value, // "YYYY-MM-DD"
    expireDate: document.getElementById('expireDate').value  // "YYYY-MM-DD"
  };

  updateUser(formData);
});

async function updateUser(userData) {
  try {
    // sadece admin'lerin güncellemesine izin ver
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Giriş yapılmamış kullanıcı.");

    // Firestore doküman referansı
    const userRef = doc(db, "users", userData.uid);

    // signUpDate / expireDate input'tan gelen ISO string'ler, önce Date'e çevirip Timestamp yap
    const signUpDateObj = new Date(userData.signUpDate);
    const expireDateObj = new Date(userData.expireDate);

    // Firestore'a güncelleme (Timestamp kullanmak önerilir)
    await updateDoc(userRef, {
      email: userData.email,
      signUpDate: Timestamp.fromDate(signUpDateObj),
      expireDate: Timestamp.fromDate(expireDateObj),
      updatedAt: Timestamp.fromDate(new Date())
    });

    console.log("✅ Kullanıcı Firestore üzerinde güncellendi:", userData.uid);
    alert("✅ Kullanıcı bilgileri başarıyla güncellendi!");

    // localStorage'ı da güncelle (isteğe bağlı)
    localStorage.setItem("editUserData", JSON.stringify(userData));

    // admin paneline geri dön
    window.location.href = "../adminPanel/adminPanel.html";
  } catch (error) {
    console.error("❌ Kullanıcı güncellenirken hata oluştu:", error);
    alert("❌ Güncelleme işlemi başarısız: " + (error.message || error));
  }
}

// Firestore'dan kullanıcı silme
async function deleteUser(uid) {
  try {
    if (!uid) {
      alert("❌ UID bulunamadı, kullanıcı silinemedi.");
      return;
    }

    const confirmDelete = confirm("⚠️ Bu kullanıcıyı silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);

    console.log("✅ Kullanıcı Firestore'dan silindi:", uid);
    alert("✅ Kullanıcı başarıyla silindi!");

    // Listeyi güncelle (eğer admin paneldeysen)
    if (typeof loadAllUsers === "function") {
      await loadAllUsers();
    }

  } catch (error) {
    console.error("❌ Kullanıcı silme hatası:", error);
    alert("❌ Silme işlemi başarısız: " + (error.message || error));
  }
}

// Geri dön butonu
function goBack() {
  // localStorage'ı temizle
  localStorage.removeItem('editUserData');

  // Ana sayfaya dön
  window.location.href = '../adminPanel/adminPanel.html';
}

window.goBack = goBack;

// Sayfa kapatılırken localStorage'ı temizle (isteğe bağlı)
window.addEventListener('beforeunload', function () {
  localStorage.removeItem('editUserData');
});