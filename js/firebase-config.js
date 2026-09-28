// ============================================================
// KONFIGURASI FIREBASE
// Ganti nilai di bawah dengan config dari project Firebase-mu.
// Ambil dari: Firebase Console > Project Settings > General >
//   "Your apps" > SDK setup and configuration > Config.
// Panduan lengkap ada di PANDUAN-SETUP.md
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7uoj-7FPz521Pv2E3729I36bf5gJ9dIM",
  authDomain: "rushd-tracker.firebaseapp.com",
  databaseURL: "https://rushd-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rushd-tracker",
  storageBucket: "rushd-tracker.firebasestorage.app",
  messagingSenderId: "1039271946161",
  appId: "1:1039271946161:web:11fbce49aeeda0d3a3bf90",
  measurementId: "G-PTCHLW3599"
};

// Peringatan ramah kalau config belum diisi, supaya halaman tidak diam saja.
export const configBelumDiisi = firebaseConfig.apiKey.startsWith("GANTI");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
