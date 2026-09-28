// Halaman Register — Firebase Authentication + webmailer (verifikasi email).
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, configBelumDiisi } from "./firebase-config.js";

const form = document.getElementById("form-register");
const pesan = document.getElementById("pesan");

function tampilkan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = "pesan " + (jenis || "");
}

if (configBelumDiisi) {
  tampilkan("Config Firebase belum diisi. Buka js/firebase-config.js dulu.", "error");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value;

  if (password.length < 6) {
    tampilkan("Password minimal 6 karakter.", "error");
    return;
  }

  const tombol = form.querySelector("button[type=submit]");
  tombol.disabled = true;
  tampilkan("Membuat akun...", "");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Webmailer: kirim email verifikasi. Setelah user klik link,
    // ia diarahkan kembali ke halaman login (index.html).
    await sendEmailVerification(cred.user, {
      url: window.location.origin + "/index.html",
      handleCodeInApp: false,
    });

    // Jangan biarkan user masuk sebelum verifikasi.
    await signOut(auth);

    tampilkan(
      "Akun dibuat. Kami sudah mengirim link verifikasi ke " +
        email +
        ". Buka email, klik link-nya, lalu login.",
      "sukses"
    );
    form.reset();
  } catch (err) {
    tampilkan(pesanError(err), "error");
  } finally {
    tombol.disabled = false;
  }
});

function pesanError(err) {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "Email ini sudah terdaftar. Silakan login.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/weak-password":
      return "Password terlalu lemah (minimal 6 karakter).";
    default:
      return "Gagal mendaftar: " + (err.message || err.code);
  }
}
