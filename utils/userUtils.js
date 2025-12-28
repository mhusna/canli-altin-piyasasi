import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Supabase importları
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.31.0/+esm";
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