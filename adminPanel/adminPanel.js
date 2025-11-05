
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIGME8_6gN9bI1SCadrsx93QhQRCfC-dM",
  authDomain: "canli-altin-app.firebaseapp.com",
  projectId: "canli-altin-app",
  storageBucket: "canli-altin-app.firebasestorage.app",
  messagingSenderId: "675863034125",
  appId: "1:675863034125:web:301006180c35a5f0549844",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function handleSuccessClick(uid) {
  try {
    // Firestore'dan kullanıcının belgesini getir
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Kullanıcı bulunamadı!");
      return;
    }

    const userData = userSnap.data();

    // Timestamp'leri Date'e çevir
    const signUpDate = userData.signUpDate?.toDate
      ? userData.signUpDate.toDate()
      : new Date(userData.signUpDate);

    const expireDate = userData.expireDate?.toDate
      ? userData.expireDate.toDate()
      : new Date(userData.expireDate);

    // localStorage'a kaydet
    localStorage.setItem('editUserData', JSON.stringify({
      uid: uid,
      email: userData.email,
      password: userData.password,
      signUpDate: signUpDate.toISOString().split('T')[0],
      expireDate: expireDate.toISOString().split('T')[0],
    }));

    // Edit sayfasına yönlendir
    window.location.href = '../editUser/editUser.html';

  } catch (error) {
    console.error("Kullanıcı yüklenirken hata:", error);
    alert("Kullanıcı bilgileri alınamadı!");
  }
}

function handleDeleteClick(uid) {
  // Kullanıcı bilgilerini bul
  const userInfo = array.find(user => user.uid === uid);

  if (!userInfo) {
    alert('❌ Kullanıcı bulunamadı!');
    console.error('Kullanıcı bulunamadı:', uid);
    return;
  }

  // Onay dialogu göster
  const confirmDelete = confirm(
    `🗑️ Kullanıcıyı silmek istediğinizden emin misiniz?\n\n` +
    `📧 Email: ${userInfo.mail}\n` +
    `🆔 UID: ${userInfo.uid}\n\n` +
    `⚠️ Bu işlem geri alınamaz!`
  );

  if (confirmDelete) {
    try {
      // Array'den kullanıcıyı çıkar
      const userIndex = array.findIndex(user => user.uid === uid);

      if (userIndex !== -1) {
        // Kullanıcıyı array'den sil
        const deletedUser = array.splice(userIndex, 1)[0];

        console.log('Silinen kullanıcı:', deletedUser);

        // Başarı mesajı
        alert(`✅ Kullanıcı başarıyla silindi!\n📧 ${deletedUser.mail}`);

        // Sayfayı yenile / UI'ı güncelle
        refreshUserList();

        // API çağrısı yapabilirsiniz (isteğe bağlı)
        deleteUserOnServer(uid);

      } else {
        throw new Error('Kullanıcı indexi bulunamadı');
      }

    } catch (error) {
      console.error('Silme işlemi sırasında hata:', error);
      alert('❌ Kullanıcı silinirken hata oluştu!');
    }
  } else {
    console.log('Silme işlemi iptal edildi');
  }
}

window.handleSuccessClick = handleSuccessClick;
window.handleDeleteClick = handleDeleteClick;

const createInfoElement = (uid, mail, startDate, expireDate) => {
  const dayDiff = dateDiffInDays(startDate, expireDate);

  return `
    <div class="titleContainer userContainer">
      <div class="userMail">${mail}</div>
      <div class="dayCount">${dayDiff}</div>
      <div class="islemler">
        <button type="button" class="btn btn-success" onclick="handleSuccessClick('${uid}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen"
            viewBox="0 0 16 16">
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
          </svg>
        </button>
        <button type="button" class="btn btn-danger" onclick="handleDeleteClick('${uid}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
            viewBox="0 0 16 16">
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </button>
      </div>
    </div>
  `;
}

async function loadAllUsers() {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);

  const userListContainer = document.getElementById("userList");
  const totalUserCount = document.getElementById('userCount');
  userListContainer.innerHTML = "";

  const userElements = [];

  snapshot.forEach((docSnap) => {
    const user = docSnap.data();
    const uid = docSnap.id; // Firestore doküman id'si (kullanıcı uid)

    const signUpDate = user.signUpDate?.toDate
      ? user.signUpDate.toDate()
      : new Date(user.signUpDate);

    const expireDate = user.expireDate?.toDate
      ? user.expireDate.toDate()
      : new Date(user.expireDate);

    userElements.push(createInfoElement(uid, user.email, signUpDate, expireDate));
  });

  userList.innerHTML = userElements.join('');
  totalUserCount.innerText = userElements.length;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  topButtons.innerHTML = `
      <button id="newUserBtn" class="newUserBtn backgroundColor">
        ➕ Yeni Kullanıcı Ekle
      </button>
      <button id="homeBtn" class="homeBtn backgroundColor">
        🏠 Ana Sayfa
      </button>
      <button id="addImage" class="addImage backgroundColor">
        Logo Yükle
      </button>
      <button id="logoutBtn" class="logoutBtn backgroundColor">
        🔒 Çıkış Yap
      </button>
      `;

  if (document.getElementById("newUserBtn")) {
    document.getElementById("newUserBtn").addEventListener("click", () => {
      window.location.href = "../register/register.html";
    });
  }

  document.getElementById("addImage").addEventListener("click", () => {
    window.location.href = "../uploadLogos/uploadLogos.html";
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


  // Admin kontrolü
  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);

  if (!adminSnap.exists()) {
    alert("Bu sayfaya erişim yetkiniz yok. (Admin olmanız gerekiyor)");
    window.location.href = "../index.html";
    return;
  }

  // Admin ise verileri yükle
  await loadAllUsers();
});

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

// Kullanıcı listesini yenile
function refreshUserList() {
  const userList = document.getElementById('userList');
  const totalUserCount = document.getElementById('userCount');

  // Yeni liste oluştur
  const userElements = [];

  // DOM'u güncelle
  userList.innerHTML = userElements.join('');
  totalUserCount.innerText = array.length;

  console.log(`Liste güncellendi. Toplam kullanıcı: ${array.length}`);
}

// Sunucudan kullanıcı silme (isteğe bağlı)
function deleteUserOnServer(uid) {
  // API çağrısı örneği
  /*
  fetch(`/api/users/${uid}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(response => {
      if (response.ok) {
          console.log('Kullanıcı sunucudan silindi:', uid);
      } else {
          throw new Error('Sunucu hatası');
      }
  })
  .catch(error => {
      console.error('Sunucu silme hatası:', error);
      // Hata durumunda kullanıcıyı geri ekleyebilirsiniz
  });
  */

  console.log('API çağrısı simülasyonu - Silinen UID:', uid);
}