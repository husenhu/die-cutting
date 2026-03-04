**Keterangan:**
Sistem otomasi tata letak (layouting) untuk industri pemotongan label (die-cutting).

Required: jsPDF

1. Kontrol Presisi Industri (Millimeter-Perfect)
Aplikasi harus mampu menangani input angka yang sangat akurat dalam satuan mm atau cm. Karena klien Anda menyasar label IMEI dan box elektronik, pergeseran 1mm saja bisa membuat label tidak muat di produk.

2. Fleksibilitas Ukuran Label (Custom Dimension)
Tanpa Batas Template: Tidak terpaku pada ukuran kertas standar (A4/Legal), tapi bisa menentukan lebar dan tinggi label sendiri sesuai pesanan khusus klien.
Gap Management: Menentukan jarak antar label (horizontal & vertikal) untuk mengakomodasi lebar pisau potong atau sensor printer.

3. Logika Lembaran & Perforasi (Sheet-Based Logic)
Ini poin kunci terakhir kita:
Batas Halaman: Aplikasi tahu kapan satu lembar sudah penuh dan harus "pindah halaman" (pindah ke lembaran berikutnya).
Garis Sobek (Perforasi): Aplikasi secara otomatis memberikan tanda atau instruksi potong di setiap akhir halaman agar lembaran bisa disobek dengan rapi.

4. Produksi Massal (Mass Generation)
User cukup memasukkan Total Label yang Dipesan (misal: 10.000 pcs), dan aplikasi akan menghitung:
Berapa banyak label per halaman.
Berapa total halaman (lembar) PDF yang harus dihasilkan.

5. Output Siap Mesin (Vector PDF)
Menggunakan jsPDF untuk menghasilkan file vektor. Ini penting karena:
File tidak akan pecah (blur) saat diperbesar.
Bisa dibaca dengan akurat oleh mesin potong digital atau printer thermal industri.

6. Visualisasi Real-Time (Live Preview)
Memberikan gambaran visual kepada operator sebelum mereka mencetak ribuan lembar, sehingga meminimalisir kesalahan setting yang bisa membuang-buang bahan (gelondongan label).