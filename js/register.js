// Halaman Register — Firebase Authentication (pendaftaran dasar).
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, configBelumDiisi } from "./firebase-config.js";

const form = document.getElementById("form-register");
const pesan = document.getElementById("pesan");
function tampilkan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = "pesan " + (jenis || "");
}
if (configBelumDiisi) tampilkan("Config Firebase belum diisi. Buka js/firebase-config.js dulu.", "error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value;
  if (password.length < 6) { tampilkan("Password minimal 6 karakter.", "error"); return; }
  const tombol = form.querySelector("button[type=submit]");
  tombol.disabled = true;
  tampilkan("Membuat akun...", "");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    tampilkan("Akun berhasil dibuat. Silakan login.", "sukses");
    setTimeout(() => (window.location.href = "index.html"), 1200);
  } catch (err) {
    tampilkan(err.code === "auth/email-already-in-use" ? "Email ini sudah terdaftar." : "Gagal mendaftar: " + (err.message || err.code), "error");
  } finally {
    tombol.disabled = false;
  }
});
