// Halaman Login — login hanya berhasil jika email sudah diverifikasi.
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, configBelumDiisi } from "./firebase-config.js";

const form = document.getElementById("form-login");
const pesan = document.getElementById("pesan");
const tautanKirimUlang = document.getElementById("kirim-ulang");

let userBelumVerifikasi = null;

function tampilkan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = "pesan " + (jenis || "");
}

if (configBelumDiisi) {
  tampilkan("Config Firebase belum diisi. Buka js/firebase-config.js dulu.", "error");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  tautanKirimUlang.hidden = true;
  userBelumVerifikasi = null;

  const email = form.email.value.trim();
  const password = form.password.value;
  const tombol = form.querySelector("button[type=submit]");
  tombol.disabled = true;
  tampilkan("Memeriksa...", "");

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    if (!cred.user.emailVerified) {
      // Email belum diverifikasi: tolak masuk, tawarkan kirim ulang.
      userBelumVerifikasi = cred.user;
      tampilkan(
        "Email belum diverifikasi. Cek inbox-mu, atau kirim ulang link verifikasi.",
        "error"
      );
      tautanKirimUlang.hidden = false;
      return;
    }

    tampilkan("Berhasil. Mengarahkan ke dashboard...", "sukses");
    window.location.href = "dashboard.html";
  } catch (err) {
    tampilkan(pesanError(err), "error");
  } finally {
    tombol.disabled = false;
  }
});

tautanKirimUlang.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!userBelumVerifikasi) return;
  try {
    await sendEmailVerification(userBelumVerifikasi, {
      url: window.location.origin + "/index.html",
      handleCodeInApp: false,
    });
    tampilkan("Link verifikasi baru sudah dikirim. Cek email-mu.", "sukses");
    tautanKirimUlang.hidden = true;
  } catch (err) {
    tampilkan("Gagal mengirim ulang: " + (err.message || err.code), "error");
  } finally {
    await signOut(auth);
  }
});

function pesanError(err) {
  switch (err.code) {
    // Akun tidak ditemukan
    case "auth/user-not-found":
      return "Akun tidak ditemukan.";
    // Password salah
    case "auth/wrong-password":
      return "Password salah.";
    // Firebase versi baru sering menggabung keduanya jadi invalid-credential.
    case "auth/invalid-credential":
      return "Email atau password salah.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/user-disabled":
      return "Akun ini dinonaktifkan.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi nanti.";
    default:
      return "Gagal login: " + (err.message || err.code);
  }
}
