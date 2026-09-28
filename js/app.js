// ============================================================
// DASHBOARD — 12 CRUD ke Firebase Realtime Database
// 3 entitas: Klien, Proyek, Invoice.
// Tiap entitas punya: Create, Read, Update, Delete  => 3 x 4 = 12 fungsi.
// Data dipisah per user: users/{uid}/{entitas}/{id}
// ============================================================
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { db } from "./firebase-config.js";




// Helper path per entitas (data disimpan di level atas Realtime Database).
const pathEntitas = (entitas, id) =>
  ref(db, `${entitas}` + (id ? `/${id}` : ""));

// ============================================================
// 12 FUNGSI CRUD
// ============================================================
// Entitas 1: KLIEN
export async function createKlien(data) {
  await set(push(pathEntitas("clients")), { ...data, createdAt: Date.now() });
}
export function readKlien(render) {
  onValue(pathEntitas("clients"), (snap) => render(snap.val() || {}));
}
export async function updateKlien(id, data) {
  await update(pathEntitas("clients", id), data);
}
export async function deleteKlien(id) {
  await remove(pathEntitas("clients", id));
}
// Entitas 2: PROYEK
export async function createProyek(data) {
  await set(push(pathEntitas("projects")), { ...data, createdAt: Date.now() });
}
export function readProyek(render) {
  onValue(pathEntitas("projects"), (snap) => render(snap.val() || {}));
}
export async function updateProyek(id, data) {
  await update(pathEntitas("projects", id), data);
}
export async function deleteProyek(id) {
  await remove(pathEntitas("projects", id));
}
// Entitas 3: INVOICE
export async function createInvoice(data) {
  await set(push(pathEntitas("invoices")), { ...data, createdAt: Date.now() });
}
export function readInvoice(render) {
  onValue(pathEntitas("invoices"), (snap) => render(snap.val() || {}));
}
export async function updateInvoice(id, data) {
  await update(pathEntitas("invoices", id), data);
}
export async function deleteInvoice(id) {
  await remove(pathEntitas("invoices", id));
}

// ============================================================
// UI: tab switching
// ============================================================
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("aktif"));
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("aktif"));
    tab.classList.add("aktif");
    document.getElementById(tab.dataset.target).classList.add("aktif");
  });
});

const rupiah = (n) => "Rp " + (Number(n) || 0).toLocaleString("id-ID");

const aman = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

// Render function tiap entitas disimpan untuk dipasang setelah uid siap.
let renderKlien, renderProyek, renderInvoice;

// ---------- KLIEN: wiring form + render ----------
(function wiringKlien() {
  const form = document.getElementById("form-klien");
  const idField = document.getElementById("klien-id");
  const tbody = document.querySelector("#tabel-klien tbody");
  const btnBatal = document.getElementById("klien-batal");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nama: form.nama.value.trim(),
      perusahaan: form.perusahaan.value.trim(),
      email: form.email.value.trim(),
      telepon: form.telepon.value.trim(),
    };
    if (!data.nama) return;
    try {
      if (idField.value) await updateKlien(idField.value, data);
      else await createKlien(data);
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan klien: " + err.message);
    }
  });

  btnBatal.addEventListener("click", resetForm);
  function resetForm() {
    form.reset();
    idField.value = "";
    document.getElementById("klien-mode").textContent = "Tambah Klien";
    btnBatal.hidden = true;
  }

  renderKlien = (obj) => {
    const rows = Object.entries(obj);
    document.getElementById("hitung-klien").textContent = rows.length;
    tbody.innerHTML =
      rows
        .map(
          ([id, k]) => `
      <tr>
        <td>${aman(k.nama)}</td>
        <td>${aman(k.perusahaan)}</td>
        <td>${aman(k.email)}</td>
        <td>${aman(k.telepon)}</td>
        <td class="aksi">
          <button data-edit="${id}">Edit</button>
          <button class="hapus" data-hapus="${id}">Hapus</button>
        </td>
      </tr>`
        )
        .join("") ||
      `<tr><td colspan="5" class="kosong">Belum ada klien.</td></tr>`;

    tbody.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => {
        const k = obj[b.dataset.edit];
        idField.value = b.dataset.edit;
        form.nama.value = k.nama || "";
        form.perusahaan.value = k.perusahaan || "";
        form.email.value = k.email || "";
        form.telepon.value = k.telepon || "";
        document.getElementById("klien-mode").textContent = "Ubah Klien";
        btnBatal.hidden = false;
      })
    );
    tbody.querySelectorAll("[data-hapus]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (confirm("Hapus klien ini?")) await deleteKlien(b.dataset.hapus);
      })
    );
  };
})();

// ---------- PROYEK: wiring form + render ----------
(function wiringProyek() {
  const form = document.getElementById("form-proyek");
  const idField = document.getElementById("proyek-id");
  const tbody = document.querySelector("#tabel-proyek tbody");
  const btnBatal = document.getElementById("proyek-batal");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nama: form.nama.value.trim(),
      klien: form.klien.value.trim(),
      status: form.status.value,
      deadline: form.deadline.value,
      nilai: Number(form.nilai.value) || 0,
    };
    if (!data.nama) return;
    try {
      if (idField.value) await updateProyek(idField.value, data);
      else await createProyek(data);
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan proyek: " + err.message);
    }
  });

  btnBatal.addEventListener("click", resetForm);
  function resetForm() {
    form.reset();
    idField.value = "";
    document.getElementById("proyek-mode").textContent = "Tambah Proyek";
    btnBatal.hidden = true;
  }

  renderProyek = (obj) => {
    const rows = Object.entries(obj);
    document.getElementById("hitung-proyek").textContent = rows.length;
    tbody.innerHTML =
      rows
        .map(
          ([id, p]) => `
      <tr>
        <td>${aman(p.nama)}</td>
        <td>${aman(p.klien)}</td>
        <td><span class="badge ${p.status === "Selesai" ? "hijau" : p.status === "Berjalan" ? "biru" : "abu"}">${aman(p.status)}</span></td>
        <td>${aman(p.deadline)}</td>
        <td>${rupiah(p.nilai)}</td>
        <td class="aksi">
          <button data-edit="${id}">Edit</button>
          <button class="hapus" data-hapus="${id}">Hapus</button>
        </td>
      </tr>`
        )
        .join("") ||
      `<tr><td colspan="6" class="kosong">Belum ada proyek.</td></tr>`;

    tbody.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = obj[b.dataset.edit];
        idField.value = b.dataset.edit;
        form.nama.value = p.nama || "";
        form.klien.value = p.klien || "";
        form.status.value = p.status || "Rencana";
        form.deadline.value = p.deadline || "";
        form.nilai.value = p.nilai || "";
        document.getElementById("proyek-mode").textContent = "Ubah Proyek";
        btnBatal.hidden = false;
      })
    );
    tbody.querySelectorAll("[data-hapus]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (confirm("Hapus proyek ini?")) await deleteProyek(b.dataset.hapus);
      })
    );
  };
})();

// ---------- INVOICE: wiring form + render ----------
(function wiringInvoice() {
  const form = document.getElementById("form-invoice");
  const idField = document.getElementById("invoice-id");
  const tbody = document.querySelector("#tabel-invoice tbody");
  const btnBatal = document.getElementById("invoice-batal");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      nomor: form.nomor.value.trim(),
      proyek: form.proyek.value.trim(),
      jumlah: Number(form.jumlah.value) || 0,
      status: form.status.value,
      tanggal: form.tanggal.value,
    };
    if (!data.nomor) return;
    try {
      if (idField.value) await updateInvoice(idField.value, data);
      else await createInvoice(data);
      resetForm();
    } catch (err) {
      alert("Gagal menyimpan invoice: " + err.message);
    }
  });

  btnBatal.addEventListener("click", resetForm);
  function resetForm() {
    form.reset();
    idField.value = "";
    document.getElementById("invoice-mode").textContent = "Tambah Invoice";
    btnBatal.hidden = true;
  }

  renderInvoice = (obj) => {
    const rows = Object.entries(obj);
    document.getElementById("hitung-invoice").textContent = rows.length;
    tbody.innerHTML =
      rows
        .map(
          ([id, inv]) => `
      <tr>
        <td>${aman(inv.nomor)}</td>
        <td>${aman(inv.proyek)}</td>
        <td>${rupiah(inv.jumlah)}</td>
        <td><span class="badge ${inv.status === "Lunas" ? "hijau" : "abu"}">${aman(inv.status)}</span></td>
        <td>${aman(inv.tanggal)}</td>
        <td class="aksi">
          <button data-edit="${id}">Edit</button>
          <button class="hapus" data-hapus="${id}">Hapus</button>
        </td>
      </tr>`
        )
        .join("") ||
      `<tr><td colspan="6" class="kosong">Belum ada invoice.</td></tr>`;

    tbody.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => {
        const inv = obj[b.dataset.edit];
        idField.value = b.dataset.edit;
        form.nomor.value = inv.nomor || "";
        form.proyek.value = inv.proyek || "";
        form.jumlah.value = inv.jumlah || "";
        form.status.value = inv.status || "Belum Lunas";
        form.tanggal.value = inv.tanggal || "";
        document.getElementById("invoice-mode").textContent = "Ubah Invoice";
        btnBatal.hidden = false;
      })
    );
    tbody.querySelectorAll("[data-hapus]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (confirm("Hapus invoice ini?")) await deleteInvoice(b.dataset.hapus);
      })
    );
  };
})();

// Dipanggil setelah uid siap: subscribe READ realtime untuk 3 entitas.
function pasangPembacaRealtime() {
  readKlien(renderKlien);
  readProyek(renderProyek);
  readInvoice(renderInvoice);
}

// Aplikasi tanpa login: langsung baca data saat halaman dimuat.
pasangPembacaRealtime();
