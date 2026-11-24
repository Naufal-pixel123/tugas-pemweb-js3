// ===== Data =====
let barang = [
  { nama: "Indomie",     harga: 3000,  qty: 0, custom: false },
  { nama: "Air Mineral", harga: 4000,  qty: 0, custom: false },
  { nama: "Gula 1 kg",   harga: 17000, qty: 0, custom: false },
];
let nomorTrx = parseInt(localStorage.getItem("nomorTrx") || "1", 10);

// ===== Elemen =====
const $ = (id) => document.getElementById(id);
const tbody = $("daftarBarang");

// ===== Helper =====
const rp = (n) => Math.round(n).toLocaleString("id-ID");
const num = (v) => { const n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.add("hidden"), 2200);
}

function setHeader() {
  $("noTrx").value = "TRX-" + String(nomorTrx).padStart(3, "0");
  const d = new Date();
  $("tanggal").value = [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("/");
}

// ===== Render tabel =====
function render() {
  tbody.innerHTML = "";
  barang.forEach((b, i) => {
    const tr = document.createElement("tr");
    if (b.custom) {
      tr.innerHTML = `
        <td><div class="nama-wrap">
          <input class="nama" data-i="${i}" placeholder="Nama barang" value="${b.nama.replace(/"/g, "&quot;")}">
          <button class="del" data-del="${i}" title="Hapus">✕</button></div></td>
        <td><input class="harga" type="number" min="0" data-i="${i}" placeholder="0" value="${b.harga || ""}"></td>
        <td><input class="qty" type="number" min="0" data-i="${i}" value="${b.qty}"></td>
        <td class="num" id="sub-${i}">${rp(b.harga * b.qty)}</td>`;
    } else {
      tr.innerHTML = `
        <td>${b.nama}</td>
        <td class="num">${rp(b.harga)}</td>
        <td><input class="qty" type="number" min="0" data-i="${i}" value="${b.qty}"></td>
        <td class="num" id="sub-${i}">${rp(b.harga * b.qty)}</td>`;
    }
    tbody.appendChild(tr);
  });
  hitung();
}

// ===== Perhitungan =====
function hitung() {
  let total = 0;
  barang.forEach((b, i) => {
    const sub = b.harga * b.qty;
    total += sub;
    const el = $("sub-" + i);
    if (el) el.textContent = rp(sub);
  });

  let persen = num($("diskon").value);
  if (persen > 100) { persen = 100; $("diskon").value = 100; }

  const potongan = total * persen / 100;
  const bayar = total - potongan;
  const uang = num($("uang").value);
  const kembali = uang - bayar;

  $("totalBelanja").textContent = rp(total);
  $("potongan").textContent = rp(potongan);
  $("totalBayar").textContent = rp(bayar);
  $("kembalian").textContent = rp(kembali);
  $("kembalian").parentElement.classList.toggle("minus", kembali < 0);

  return { total, persen, potongan, bayar, uang, kembali };
}

// ===== Event =====
tbody.addEventListener("input", (e) => {
  const i = e.target.dataset.i;
  if (i === undefined) return;
  const b = barang[i];
  if (e.target.classList.contains("qty")) b.qty = Math.floor(num(e.target.value));
  else if (e.target.classList.contains("harga")) b.harga = num(e.target.value);
  else if (e.target.classList.contains("nama")) b.nama = e.target.value;
  hitung();
});

tbody.addEventListener("click", (e) => {
  const i = e.target.dataset.del;
  if (i === undefined) return;
  barang.splice(i, 1);
  render();
});

$("btnTambah").addEventListener("click", () => {
  barang.push({ nama: "", harga: 0, qty: 0, custom: true });
  render();
  const inputs = tbody.querySelectorAll("input.nama");
  inputs[inputs.length - 1].focus();
});

$("diskon").addEventListener("input", hitung);
$("uang").addEventListener("input", hitung);

function reset() {
  barang = barang.filter((b) => !b.custom);
  barang.forEach((b) => (b.qty = 0));
  $("kasir").value = "";
  $("diskon").value = 0;
  $("uang").value = 0;
  setHeader();
  render();
}

$("btnBatal").addEventListener("click", () => {
  if (confirm("Batalkan transaksi ini?")) reset();
});

$("btnSimpan").addEventListener("click", () => {
  const kasir = $("kasir").value.trim();
  const dibeli = barang.filter((b) => b.qty > 0);

  if (!kasir) { toast("Nama kasir wajib diisi"); $("kasir").focus(); return; }
  if (dibeli.length === 0) { toast("Belum ada barang yang dibeli"); return; }
  if (dibeli.some((b) => !b.nama.trim())) { toast("Nama barang baru belum diisi"); return; }

  const h = hitung();
  if (h.uang < h.bayar) { toast("Uang diterima kurang"); $("uang").focus(); return; }

  const noTrx = $("noTrx").value;
  const baris = dibeli.map((b) =>
    `${b.nama} ${b.qty} x ${rp(b.harga)} = ${rp(b.harga * b.qty)}`
  ).join("\n");

  const struk =
`${noTrx}   ${$("tanggal").value}
Kasir: ${kasir}
------------------------------
${baris}
------------------------------
Total Belanja : ${rp(h.total)}
Diskon (${h.persen}%)  : -${rp(h.potongan)}
Total Bayar   : ${rp(h.bayar)}
Uang Diterima : ${rp(h.uang)}
Kembalian     : ${rp(h.kembali)}`;

  // simpan riwayat di localStorage
  const riwayat = JSON.parse(localStorage.getItem("riwayatTrx") || "[]");
  riwayat.push({ noTrx, tanggal: $("tanggal").value, kasir, items: dibeli, ...h });
  localStorage.setItem("riwayatTrx", JSON.stringify(riwayat));

  nomorTrx++;
  localStorage.setItem("nomorTrx", nomorTrx);

  $("struk").textContent = struk;
  $("modal").classList.remove("hidden");
});

$("btnTutup").addEventListener("click", () => {
  $("modal").classList.add("hidden");
  reset();
});

// ===== Mulai =====
setHeader();
render();