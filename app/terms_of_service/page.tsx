export default function TermsOfServicePage() {
    const doodleSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%2300458B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'%3E%3C!-- Burger --%3E%3Cpath d='M 30 35 C 30 25, 50 25, 50 35 Z' /%3E%3Cpath d='M 28 38 L 52 38' /%3E%3Crect x='30' y='41' width='20' height='4' rx='2' /%3E%3Cpath d='M 30 48 C 30 53, 50 53, 50 48 Z' /%3E%3Ccircle cx='36' cy='30' r='0.5' /%3E%3Ccircle cx='44' cy='30' r='0.5' /%3E%3Ccircle cx='40' cy='28' r='0.5' /%3E%3C!-- Pizza --%3E%3Cpath d='M 150 20 L 165 45 L 135 45 Z' /%3E%3Cpath d='M 135 45 Q 150 55 165 45' /%3E%3Ccircle cx='145' cy='35' r='3' /%3E%3Ccircle cx='155' cy='40' r='2.5' /%3E%3Ccircle cx='150' cy='28' r='2' /%3E%3C!-- Noodle --%3E%3Cpath d='M 25 150 Q 40 170 55 150 Z' /%3E%3Cpath d='M 20 150 L 60 150' /%3E%3Cpath d='M 35 150 Q 40 135 45 150 T 55 150' /%3E%3Cpath d='M 30 150 Q 35 140 45 150' /%3E%3Cpath d='M 55 125 L 35 145' /%3E%3Cpath d='M 60 128 L 40 148' /%3E%3C!-- Apple --%3E%3Cpath d='M 150 145 C 135 140, 135 160, 150 160 C 165 160, 165 140, 150 145 Z' /%3E%3Cpath d='M 150 145 Q 155 135 155 130' /%3E%3Cpath d='M 155 130 Q 165 130 165 135 Q 155 140 155 130' /%3E%3C!-- Carrot --%3E%3Cpath d='M 95 90 L 110 105 Q 115 110 110 115 Q 105 120 100 115 L 85 100 Z' /%3E%3Cpath d='M 95 90 Q 85 80 80 85 Q 90 95 95 90' /%3E%3Cpath d='M 95 90 Q 90 75 85 80 Q 90 95 95 90' /%3E%3Cpath d='M 92 98 L 98 92' /%3E%3Cpath d='M 97 105 L 103 99' /%3E%3C/g%3E%3C/svg%3E")`;

    return (
        <div
            className="w-full min-h-[calc(100vh-130px)] flex flex-col py-12 px-4 items-center"
            style={{ backgroundImage: doodleSvg, backgroundSize: '150px 150px' }}
        >
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-12">
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
                        <li><strong>Super Admin:</strong> Pihak pengelola Mangan Rek! yang bertugas melakukan moderasi platform, persetujuan registrasi restoran, dan penegakan aturan.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">2. Pendaftaran Akun dan Keamanan</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Anda setuju untuk memberikan informasi yang akurat, lengkap, dan mutakhir saat melakukan registrasi.</li>
                        <li>Bagi Admin Resto, Anda wajib melampirkan foto restoran yang sah. Super Admin berhak menyetujui (Approve) atau menolak (Reject) pendaftaran Anda. Sebelum disetujui, akun Anda akan berstatus Pending dan tidak dapat mengakses dashboard.</li>
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
                        <li>Mengunggah foto restoran palsu, gambar pornografi, atau konten yang melanggar hukum dalam bentuk apa pun.</li>
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
        </div>
    );
}
