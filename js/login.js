// Halaman Login — Firebase Authentication (login dasar).
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, configBelumDiisi } from "./firebase-config.js";

const form = document.getElementById("form-login");
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
  const tombol = form.querySelector("button[type=submit]");
  tombol.disabled = true;
  tampilkan("Memeriksa...", "");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    tampilkan("Email atau password salah.", "error");
  } finally {
    tombol.disabled = false;
  }
});
