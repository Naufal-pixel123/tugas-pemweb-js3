
function hitung() {

    // Mengambil input
    let hari = document.getElementById("hari").value;

    let dewasa = Number(document.getElementById("dewasa").value);
    let anak = Number(document.getElementById("anak").value);

    let uang = Number(document.getElementById("uang").value);

    // Menentukan harga tiket
    let hargaDewasa;
    let hargaAnak;

    if (hari == "weekday") {
        hargaDewasa = 40000;
    } else {
        hargaDewasa = 50000;
    }

    // Harga anak-anak diskon 50%
    hargaAnak = hargaDewasa * 0.5;

    // Menghitung subtotal
    let subtotalDewasa = dewasa * hargaDewasa;
    let subtotalAnak = anak * hargaAnak;

    // Menghitung total tiket
    let totalTiket = dewasa + anak;

    // Menghitung tiket gratis
    let tiketGratis = Math.floor(totalTiket / 5);

    // Total pembayaran
    let totalBayar = subtotalDewasa + subtotalAnak;

    // Menghitung kembalian
    let kembalian = uang - totalBayar;

    if (kembalian < 0) {
        kembalian = 0;
    }

    // Menampilkan harga
    document.getElementById("hargaDewasa").innerHTML =
    hargaDewasa.toLocaleString("id-ID");

    document.getElementById("hargaAnak").innerHTML =
    hargaAnak.toLocaleString("id-ID");

    // Menampilkan subtotal
    document.getElementById("subtotalDewasa").innerHTML =
    subtotalDewasa.toLocaleString("id-ID");

    document.getElementById("subtotalAnak").innerHTML =
    subtotalAnak.toLocaleString("id-ID");

    // Menampilkan hasil
    document.getElementById("totalTiket").innerHTML = totalTiket;

    document.getElementById("tiketGratis").innerHTML = tiketGratis;

    document.getElementById("totalDiterima").innerHTML =
    totalTiket + tiketGratis;

    document.getElementById("totalBayar").innerHTML =
    totalBayar.toLocaleString("id-ID");

    document.getElementById("kembalian").innerHTML =
    kembalian.toLocaleString("id-ID");
    
}

// Tombol batal
function batal() {

    document.getElementById("dewasa").value = 0;
    document.getElementById("anak").value = 0;
    document.getElementById("uang").value = 0;
    document.getElementById("kasir").value = "";

    document.getElementById("hari").value = "weekday";

    hitung();
}

// Tombol simpan
function simpan() {

    let nama = document.getElementById("kasir").value;

    let totalBayar = Number(
        document.getElementById("totalBayar").innerHTML.replace(/\./g, "")
    );

    let uang = Number(document.getElementById("uang").value);

    if (nama == "") {
        alert("Nama kasir harus diisi!");
    } 
    else if (uang < totalBayar) {
        alert("Uang yang diterima belum cukup!");
    }
    else {
        alert("Transaksi berhasil disimpan!");
    }

}

hitung();
