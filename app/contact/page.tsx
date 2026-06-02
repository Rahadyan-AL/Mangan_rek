export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#f6f6fb] py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
                <h1 className="mb-8 text-3xl font-bold text-[#00458B] text-center">Contact Us</h1>
                <div className="prose max-w-none text-slate-700 space-y-4">
                    <p>
                        Kami selalu senang mendengar masukan dari Anda! Jika Anda memiliki pertanyaan, saran tempat makan baru, atau ingin menjalin kerjasama, jangan ragu untuk menghubungi kami.
                    </p>
                    <ul className="mt-6 space-y-3 list-none p-0">
                        <li className="flex items-center gap-2"><strong>Email:</strong> hello@manganrek.com</li>
                        <li className="flex items-center gap-2"><strong>Telepon:</strong> +62 812-3456-7890</li>
                        <li className="flex items-center gap-2"><strong>Alamat:</strong> Jl. Kuliner Malang No. 1, Malang, Jawa Timur</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
