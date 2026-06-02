export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#f6f6fb] py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
                <h1 className="mb-2 text-3xl font-bold text-[#00458B] text-center">Kebijakan Privasi (Privacy Policy) Mangan Rek!</h1>
                <p className="text-center text-sm text-slate-500 mb-8">Terakhir Diperbarui: 2 Juni 2026</p>
                
                <div className="prose max-w-none text-slate-700 space-y-4">
                    <p>Selamat datang di Mangan Rek! ("kami", "milik kami", atau "Platform"). Kami sangat menghargai privasi Anda dan berkomitmen penuh untuk melindungi data pribadi pengguna kami. Kebijakan Privasi ini menjelaskan secara rinci bagaimana kami mengumpulkan, menggunakan, memproses, mengungkapkan, dan melindungi informasi Anda saat Anda mengakses situs web, sistem Point of Sale (POS), fitur Itinerary, dan layanan kami lainnya.</p>
                    <p>Dengan mendaftar, mengakses, atau menggunakan layanan Mangan Rek!, Anda menyetujui praktik pengumpulan dan penggunaan informasi yang diuraikan dalam dokumen ini.</p>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mt-6">1. Informasi yang Kami Kumpulkan</h3>
                    <p>Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan layanan kami kepada Anda, yang meliputi:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Informasi Pribadi Pengguna (Wisatawan/Pelanggan):</strong> Saat Anda mendaftar, kami mengumpulkan nama lengkap, alamat email, kata sandi yang dienkripsi, dan data profil lainnya yang Anda tambahkan secara opsional.</li>
                        <li><strong>Informasi Pemilik Restoran (Admin Resto):</strong> Untuk pendaftaran multi-entity, kami mengumpulkan data tambahan termasuk nama restoran, alamat fisik, titik koordinat (latitude & longitude), serta dokumen legalitas berupa foto atau berkas yang diunggah (legalPhoto) untuk proses verifikasi oleh Super Admin.</li>
                        <li><strong>Data Karyawan (Kasir):</strong> Pemilik restoran dapat membuat akun untuk staf kasir yang mencakup nama dan kredensial login khusus.</li>
                        <li><strong>Data Geospasial & Lokasi:</strong> Untuk menjalankan fitur Itinerary Generator dan menampilkan restoran terdekat (menggunakan formula Haversine), kami mengumpulkan data lokasi akurat atau perkiraan lokasi Anda (GPS) saat Anda memberikan izin akses lokasi pada perangkat Anda.</li>
                        <li><strong>Informasi Transaksi & Pembayaran:</strong> Kami mencatat riwayat pembelian voucher digital Anda. Pemrosesan pembayaran dilakukan oleh pihak ketiga (Payment Gateway Louvin). Kami menyimpan ID Transaksi, status (PAID/USED), dan nominal, namun kami tidak menyimpan informasi kartu kredit atau kredensial perbankan sensitif Anda secara langsung di database kami. Untuk transaksi dine-in, sistem POS kami mencatat data pesanan, metode pembayaran (Cash/QRIS), dan total pendapatan harian.</li>
                        <li><strong>Data Perangkat dan Analitik:</strong> Kami mengumpulkan informasi tentang bagaimana Anda mengakses platform, termasuk alamat IP, jenis browser, versi aplikasi, waktu kunjungan, dan halaman yang Anda lihat.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">2. Bagaimana Kami Menggunakan Informasi Anda</h3>
                    <p>Data yang dikumpulkan digunakan secara eksklusif untuk tujuan operasional dan peningkatan layanan, antara lain:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Mendaftarkan dan mengelola akun Anda (baik sebagai Pengguna, Kasir, atau Admin Resto).</li>
                        <li>Menyediakan fitur inti platform, termasuk pencarian direktori restoran berbasis lokasi, kalkulasi itinerary wisata kuliner, dan manajemen checkout POS.</li>
                        <li>Memproses dan memvalidasi transaksi pembelian voucher digital, serta menerbitkan kode unik (Unique Code) untuk penukaran di kasir restoran.</li>
                        <li>Melakukan moderasi konten, menyetujui atau menolak pendaftaran restoran, serta membekukan (Ban) atau menghapus akun yang melanggar ketentuan.</li>
                        <li>Mengirimkan pemberitahuan administratif, pembaruan keamanan, informasi layanan, atau tanda terima transaksi.</li>
                        <li>Menganalisis tren penggunaan untuk pengembangan fitur baru dan optimalisasi antarmuka pengguna (UI/UX).</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">3. Berbagi dan Pengungkapan Informasi</h3>
                    <p>Kami tidak menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga. Kami hanya membagikan data dalam kondisi berikut:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Kepada Restoran Mitra:</strong> Saat Anda membeli dan menukarkan voucher, kami membagikan status dan kode voucher kepada restoran terkait untuk proses validasi via POS.</li>
                        <li><strong>Penyedia Layanan Pihak Ketiga:</strong> Kami bekerja sama dengan penyedia infrastruktur cloud, layanan peta (Map API), dan gerbang pembayaran (Louvin) yang hanya memiliki akses ke informasi yang diperlukan untuk melakukan tugas mereka sesuai regulasi keamanan.</li>
                        <li><strong>Kepatuhan Hukum:</strong> Kami berhak menyerahkan informasi Anda kepada otoritas hukum jika diwajibkan oleh undang-undang yang berlaku di Republik Indonesia, atau untuk melindungi hak, properti, dan keselamatan Mangan Rek!, pengguna kami, maupun publik.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">4. Retensi dan Keamanan Data</h3>
                    <p>Kami menyimpan data pribadi Anda selama akun Anda berstatus aktif atau selama diperlukan untuk memenuhi tujuan hukum dan operasional. Keamanan data Anda sangat penting bagi kami. Kami mengimplementasikan standar keamanan industri, termasuk enkripsi kata sandi (seperti bcrypt) dan pengamanan transmisi data via JWT (JSON Web Tokens) menggunakan HttpOnly Cookies. Meskipun kami berusaha keras melindungi data Anda, tidak ada metode transmisi di internet yang 100% aman.</p>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">5. Hak Pengguna</h3>
                    <p>Anda memiliki kendali atas data Anda. Melalui pengaturan akun, Anda dapat:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Melihat, mengedit, atau memperbarui informasi profil Anda.</li>
                        <li>Menambahkan atau menghapus restoran dari daftar "Favorit" Anda.</li>
                        <li>Mengajukan permohonan penghapusan akun beserta seluruh data yang terafiliasi dengan menghubungi tim dukungan kami.</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-slate-900 mt-6">6. Perubahan pada Kebijakan Privasi Ini</h3>
                    <p>Kami dapat memperbarui Kebijakan Privasi ini secara berkala. Segala perubahan akan diumumkan di halaman ini dengan memperbarui tanggal "Terakhir Diperbarui". Anda disarankan untuk meninjau halaman ini secara berkala.</p>
                </div>
            </div>
        </main>
    );
}
