HOOM SISWA OPERATOR - PWA

ISI PAKET
- index.html : form input
- app.js : penyimpanan lokal, daftar data, CSV, sinkronisasi
- sw.js : cache untuk penggunaan offline
- manifest.webmanifest : identitas PWA
- icon.svg : ikon aplikasi
- Code.gs : penerima data Google Spreadsheet

CARA MENJALANKAN
1. Upload seluruh isi folder ke GitHub repository (jangan hanya index.html).
2. Aktifkan GitHub Pages: Settings > Pages > Deploy from branch > main / root.
3. Buka URL GitHub Pages melalui Chrome/Edge. Gunakan HTTPS agar PWA dan service worker aktif.
4. Install aplikasi melalui menu Install App / Add to Home Screen.

CARA HUBUNGKAN GOOGLE SPREADSHEET
1. Buat Google Spreadsheet baru.
2. Extensions > Apps Script.
3. Ganti isi Code.gs dengan file Code.gs dari paket ini, lalu Save.
4. Deploy > New deployment > Web app.
5. Execute as: Me. Atur akses sesuai kebijakan organisasi; opsi Anyone membuat endpoint dapat menerima kiriman dari pemegang URL.
6. Deploy, izinkan akses, lalu salin URL yang berakhiran /exec.
7. Di aplikasi buka Pengaturan koneksi Google Spreadsheet, tempel URL, lalu Simpan URL.
8. Coba input satu data uji, klik Sinkronkan, lalu periksa tab HOOM_DATA.

CATATAN PENTING SINKRONISASI
- Form dan data lokal dapat dipakai offline pada perangkat/browser yang sama.
- URL endpoint Apps Script tertanam di app.js dan tidak ditampilkan kepada pengguna. Untuk mengganti endpoint, administrator mengubah konstanta APPS_SCRIPT_URL.
- Pengiriman memakai request no-cors karena endpoint Apps Script biasanya tidak menyediakan respons CORS yang dapat dibaca browser. Aplikasi menandai data sebagai "Terkirim, menunggu verifikasi", bukan mengklaim berhasil.
- ID unik pada setiap record mencegah baris ganda jika pengiriman diulang. Periksa tab HOOM_DATA sebelum menghapus data lokal.
- Data localStorage terikat pada browser/perangkat. Jangan hapus data browser sebelum memastikan data sudah ada di Spreadsheet.
- Untuk penggunaan produksi/multi-user, sebaiknya tambahkan autentikasi dan kebijakan akses sesuai aturan organisasi.

EXPORT
- Export CSV dapat dibuka dengan Excel atau diimpor ke Google Sheets.
- Cetak / PDF membuka dialog cetak browser; pilih Save as PDF.
