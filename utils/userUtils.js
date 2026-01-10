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

/**
 * Resim değişikliklerini Supabase Realtime ile dinler ve DOM'u günceller.
 * @param {string} userId 
 */
export const subscribeToImageChanges = (userId) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Profiles tablosundaki logo değişikliklerini dinle
  supabase
    .channel('profiles-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: 'id=eq.' + userId
      },
      function (payload) {
        var logoElem = document.getElementById("logo");
        if (payload.new.logo_url && logoElem) {
          // Cache'i bypass etmek için timestamp ekle
          logoElem.src = payload.new.logo_url + '?t=' + Date.now();
          console.log("Logo güncellendi:", payload.new.logo_url);
        }
      }
    )
    .subscribe();

  // Ads tablosundaki reklam değişikliklerini dinle
  supabase
    .channel('ads-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'ads'
      },
      function (payload) {
        var reklamElem = document.getElementById("reklam");
        if (payload.new.ad_url && reklamElem) {
          reklamElem.src = payload.new.ad_url + '?t=' + Date.now();
          console.log("Reklam güncellendi:", payload.new.ad_url);
        }
      }
    )
    .subscribe();

  console.log("Supabase Realtime subscription başlatıldı.");
};