import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

// Supabase importları
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "./models.js";


/**
 * Kullanıcının üyelik süresi dolmuş mu kontrol eder. Eğer dolmuşsa çıkış yapar.
 * @param {*} userId 
 * @returns 
 */
export const checkUserIsExpired = async (userId, db, auth) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("Kullanıcı bilgileri bulunamadı!");
  }

  const userData = userSnap.data();
  const expireDate = userData.expireDate?.toDate
    ? userData.expireDate.toDate()
    : new Date(userData.expireDate);

  const currentDate = new Date();
  if (currentDate > expireDate) {
    alert("Hesabınızın süresi dolmuş. Lütfen yönetici ile iletişime geçin.");
    await signOut(auth);
  }
}

/**
 * Kullanıcı logosu ve reklam görselini çekip sayfaya yerleştirir.
 * @param {*} userId 
 */
export const setImage = async (userId) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("logo_url, ad_url")
    .eq("id", userId)
    .single();

  const { data: adData, error: adError } = await supabase
    .from("ads")
    .select("ad_url")
    .single();

  try {
    const logoElem = document.getElementById("logo");
    if (profileData && profileData.logo_url && logoElem) {
      logoElem.src = profileData.logo_url;
    }

    const reklamElem = document.getElementById("reklam");
    if (adData && adData.ad_url && reklamElem) {
      reklamElem.src = adData.ad_url;
    }
  } catch (e) {
    console.error("Resim DOM'a yüklenirken hata meydana geldi:", e);
  }

  if (error) console.error("Logo yüklenirken hata meydana geldi:", error);
  if (adError) console.error("Reklam yüklenirken hata meydana geldi:", adError);
};

// Son bilinen URL'leri saklamak için değişkenler
var lastLogoUrl = null;
var lastAdUrl = null;

/**
 * Resim değişikliklerini polling ile kontrol eder ve DOM'u günceller.
 * Eski Smart TV tarayıcılarıyla uyumlu çalışır (WebSocket gerektirmez).
 * @param {string} userId 
 * @param {number} intervalMs - Kontrol aralığı (varsayılan: 30000ms = 30 saniye)
 */
export var subscribeToImageChanges = function (userId, intervalMs) {
  if (intervalMs === undefined) {
    intervalMs = 30000; // Varsayılan 30 saniye
  }

  var supabase = createClient(supabaseUrl, supabaseAnonKey);

  // İlk yüklemede mevcut URL'leri kaydet
  var initializeUrls = function () {
    supabase
      .from("profiles")
      .select("logo_url")
      .eq("id", userId)
      .single()
      .then(function (result) {
        if (result.data && result.data.logo_url) {
          lastLogoUrl = result.data.logo_url;
        }
      });

    supabase
      .from("ads")
      .select("ad_url")
      .single()
      .then(function (result) {
        if (result.data && result.data.ad_url) {
          lastAdUrl = result.data.ad_url;
        }
      });
  };

  // Değişiklikleri kontrol eden fonksiyon
  var checkForChanges = function () {
    // Logo değişikliğini kontrol et
    supabase
      .from("profiles")
      .select("logo_url")
      .eq("id", userId)
      .single()
      .then(function (result) {
        if (result.data && result.data.logo_url) {
          if (lastLogoUrl !== null && result.data.logo_url !== lastLogoUrl) {
            var logoElem = document.getElementById("logo");
            if (logoElem) {
              logoElem.src = result.data.logo_url + '?t=' + Date.now();
              console.log("Logo güncellendi:", result.data.logo_url);
            }
          }
          lastLogoUrl = result.data.logo_url;
        }
      })
      .catch(function (err) {
        console.error("Logo kontrol hatası:", err);
      });

    // Reklam değişikliğini kontrol et
    supabase
      .from("ads")
      .select("ad_url")
      .single()
      .then(function (result) {
        if (result.data && result.data.ad_url) {
          if (lastAdUrl !== null && result.data.ad_url !== lastAdUrl) {
            var reklamElem = document.getElementById("reklam");
            if (reklamElem) {
              reklamElem.src = result.data.ad_url + '?t=' + Date.now();
              console.log("Reklam güncellendi:", result.data.ad_url);
            }
          }
          lastAdUrl = result.data.ad_url;
        }
      })
      .catch(function (err) {
        console.error("Reklam kontrol hatası:", err);
      });
  };

  // İlk URL'leri kaydet
  initializeUrls();

  // Belirli aralıklarla kontrol et
  setInterval(checkForChanges, intervalMs);

  console.log("Resim değişiklik kontrolü başlatıldı (polling, her " + (intervalMs / 1000) + " saniyede bir).");
};