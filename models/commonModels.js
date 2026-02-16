export const EXCHANGE_TYPES = [
  {
    id: "HAS",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: true,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "BILEZIK22",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR8",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.32,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR14",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.575,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR18",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.7,
    satisMilyem: 0,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR22",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.912,
    satisMilyem: 0.93,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "AYAR24",
    haremId: "ALTIN",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 0.995,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "CEYREK_YENI",
    haremId: "CEYREK_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "CEYREK_ESKI",
    haremId: "CEYREK_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "YARIM_YENI",
    haremId: "YARIM_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "YARIM_ESKI",
    haremId: "YARIM_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "TEK_ESKI",
    haremId: "TEK_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "TEK_YENI",
    haremId: "TEK_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "ATA_YENI",
    haremId: "ATA_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "RESAT",
    haremId: "ATA_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "GRAMESE_YENI",
    haremId: "CEYREK_YENI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremAlis) * 10) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremSatis) * 10) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "GRAMESE_ESKI",
    haremId: "CEYREK_ESKI",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: false,
    alisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremAlis) * 10) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      // 10 tane çeyreğe eşit olduğundan * 10 yapıldı.
      return (Number(this.haremSatis) * 10) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "USDTRY",
    haremId: "USDTRY",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: true,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "EURTRY",
    haremId: "EURTRY",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    format: true,
    alisHesap: function () {
      return Number(this.haremAlis) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis) * this.satisMilyem + Number(this.satisKar);
    },
  },
  {
    id: "GUMTRY",
    haremId: "GUMTRY",
    haremAlis: 0,
    haremSatis: 0,
    alisMilyem: 1,
    satisMilyem: 1,
    alisKar: 0,
    satisKar: 0,
    alisHesap: function () {
      return Number(this.haremAlis * 1000) * this.alisMilyem + Number(this.alisKar);
    },
    satisHesap: function () {
      return Number(this.haremSatis * 1000) * this.satisMilyem + Number(this.satisKar);
    },
  },
];

export const firebaseConfig = {
  apiKey: "AIzaSyDIGME8_6gN9bI1SCadrsx93QhQRCfC-dM",
  authDomain: "canli-altin-app.firebaseapp.com",
  databaseURL:
    "https://canli-altin-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "canli-altin-app",
  storageBucket: "canli-altin-app.firebasestorage.app",
  messagingSenderId: "675863034125",
  appId: "1:675863034125:web:301006180c35a5f0549844",
  measurementId: "G-V3YHGPSB8M",
};