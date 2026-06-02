export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-[#f6f6fb] py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
                <h1 className="mb-2 text-3xl font-bold text-[#00458B] text-center">Syarat dan Ketentuan (Terms of Service)</h1>
                <h1 className="mb-2 text-3xl font-bold text-[#00458B] text-center">Mangan Rek!</h1>
                <p className="text-center text-sm text-slate-500 mb-8">Terakhir Diperbarui: 2 Juni 2026</p>
                
                <div className="prose max-w-none text-slate-700 space-y-4">
                    <p>Syarat dan Ketentuan ini ("Perjanjian") mengatur akses dan penggunaan Anda atas platform digital, direktori kuliner, sistem POS, dan layanan itinerary Mangan Rek! ("Platform"). Dengan menggunakan layanan kami, Anda sepakat untuk tunduk pada seluruh ketentuan yang tertulis di bawah ini. Jika Anda tidak setuju, Anda dilarang menggunakan platform ini.</p>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mt-6">1. Definisi Peran Pengguna</h3>
                    <p>Platform ini memiliki ekosistem dengan berbagai hak akses:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Pengguna (User):</strong> Individu/wisatawan yang menggunakan platform untuk mencari restoran, membuat rute perjalanan (itinerary), menyimpan favorit, dan membeli voucher.</li>
                        <li><strong>Admin Resto (Owner):</strong> Pemilik usaha kuliner yang mendaftarkan entitas usahanya, mengelola menu, mengatur promo (Happy Hour), membuat voucher, dan mengelola staf kasir.</li>
                        <li><strong>Kasir:</strong> Staf restoran yang menggunakan sistem antarmuka POS untuk mencatat pesanan (dine-in/take-away) dan memvalidasi voucher pelanggan.</li>
                        <li><strong>Super Admin:</strong> Pihak pengelola Mangan Rek! yang bertugas melakukan moderasi platform, persetujuan legalitas restoran, dan penegakan aturan.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">2. Pendaftaran Akun dan Keamanan</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Anda setuju untuk memberikan informasi yang akurat, lengkap, dan mutakhir saat melakukan registrasi.</li>
                        <li>Bagi Admin Resto, Anda wajib melampirkan dokumen legalitas yang sah. Super Admin berhak menyetujui (Approve) atau menolak (Reject) pendaftaran Anda. Sebelum disetujui, akun Anda akan berstatus Pending dan tidak dapat mengakses dashboard.</li>
                        <li>Anda bertanggung jawab penuh atas kerahasiaan kata sandi akun Anda dan atas semua aktivitas yang terjadi di bawah akun Anda.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">3. Ketentuan Transaksi & Pembelian Voucher</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Pembelian:</strong> Transaksi pembelian voucher restoran dilakukan melalui pihak ketiga (Payment Gateway Louvin). Mangan Rek! tidak memproses atau menyimpan dana secara langsung pada saat checkout.</li>
                        <li><strong>Validitas:</strong> Voucher yang dibeli akan menghasilkan Kode Unik. Voucher hanya dapat divalidasi dan digunakan (redeem) satu kali di restoran yang menerbitkan voucher tersebut sebelum masa berlakunya (expiry date) habis.</li>
                        <li><strong>Pengembalian Dana (Refund):</strong> Seluruh pembelian voucher bersifat final. Pengembalian dana tidak dapat dilakukan kecuali restoran tutup permanen atau tidak dapat menyediakan layanan karena force majeure.</li>
                        <li><strong>POS Kasir:</strong> Sistem POS memungkinkan pembayaran dengan Cash atau QRIS. Restoran bertanggung jawab penuh atas pencatatan, penyiapan pesanan, dan perhitungan uang kembalian atau penyelesaian transaksi QRIS di gerai fisik.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">4. Fitur Itinerary dan Data Peta</h3>
                    <p>Fitur Itinerary Generator menyusun rute perjalanan wisata kuliner berdasarkan durasi waktu yang Anda berikan dan algoritma jarak (Distance Matrix/Haversine). Mangan Rek! menyediakan estimasi rute ini "sebagaimana adanya". Kami tidak menjamin keakuratan absolut mengenai waktu tempuh, kondisi lalu lintas nyata, atau jam buka restoran secara real-time. Risiko keterlambatan perjalanan sepenuhnya menjadi tanggung jawab pengguna.</p>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">5. Kewajiban & Tanggung Jawab Admin Resto</h3>
                    <p>Sebagai mitra (Admin Resto), Anda berkewajiban untuk:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Menjaga keakuratan harga, ketersediaan menu, jam operasional, dan lokasi restoran.</li>
                        <li>Menghormati dan memproses setiap voucher Mangan Rek! yang ditukarkan oleh pelanggan dan belum berstatus USED.</li>
                        <li>Bertanggung jawab atas kualitas makanan, minuman, kebersihan, dan pelayanan yang diberikan kepada pelanggan di gerai fisik. Mangan Rek! hanya bertindak sebagai platform perantara perangkat lunak dan tidak bertanggung jawab atas keracunan makanan, alergi, atau kerugian fisik/materiil di lokasi restoran.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">6. Penggunaan yang Dilarang</h3>
                    <p>Pengguna dalam peran apa pun dilarang keras untuk:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Merekayasa balik (reverse engineering), meretas, atau menyusup ke dalam server, API, atau basis data Mangan Rek!.</li>
                        <li>Mengunggah dokumen legalitas palsu, gambar pornografi, atau konten yang melanggar hukum dalam bentuk apa pun.</li>
                        <li>Melakukan eksploitasi sistem diskon, voucher, atau pembayaran (fraud/scam).</li>
                    </ul>
                    <p>Super Admin memiliki kewenangan penuh untuk menangguhkan (Ban) atau menghapus (Delete) akun secara permanen jika terbukti melakukan pelanggaran.</p>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">7. Hak Kekayaan Intelektual</h3>
                    <p>Seluruh desain antarmuka, logo ("Mangan Rek!"), struktur basis data, kode sumber (frontend/backend), dan algoritma yang digunakan dalam layanan ini adalah hak milik Mangan Rek!. Pemilik restoran tetap memegang hak cipta atas foto menu restoran mereka, namun memberikan lisensi non-eksklusif kepada Mangan Rek! untuk menampilkannya di platform.</p>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">8. Batasan Tanggung Jawab (Limitation of Liability)</h3>
                    <p>Layanan disediakan dengan basis "sebagaimana adanya" (as is) dan "sebagaimana tersedia" (as available). Mangan Rek! tidak memberikan jaminan bahwa platform akan 100% bebas dari bug, downtime, atau gangguan server. Dalam batas maksimal yang diizinkan oleh hukum Indonesia, Mangan Rek! tidak bertanggung jawab atas hilangnya pendapatan, data, atau kerugian tidak langsung yang timbul akibat penggunaan atau ketidakmampuan menggunakan platform.</p>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">9. Hukum yang Berlaku</h3>
                    <p>Syarat dan Ketentuan ini tunduk pada dan ditafsirkan sesuai dengan hukum Republik Indonesia. Segala perselisihan yang timbul dari Perjanjian ini akan diselesaikan secara musyawarah mufakat, atau melalui yurisdiksi pengadilan negeri di wilayah Kota Malang.</p>
                </div>
            </div>
        </main>
    );
}
