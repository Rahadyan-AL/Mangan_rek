export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#f6f6fb] py-12 px-4 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
                <h1 className="mb-8 text-3xl font-bold text-[#00458B] text-center">About Us</h1>
                <div className="prose max-w-none text-slate-700 space-y-4">
                    <p>
                        Mangan Rek! Malang Culinary Heritage adalah sebuah platform direktori kuliner yang didedikasikan untuk melestarikan dan mempromosikan warisan kuliner otentik di Malang. Kami percaya bahwa setiap hidangan memiliki cerita yang patut dibagikan.
                    </p>
                    <p>
                        Melalui platform ini, kami berupaya menghubungkan para pecinta kuliner dengan tempat-tempat legendaris dan permata tersembunyi yang menyajikan cita rasa khas Malang. Mulai dari pecel, rawon, hingga bakso Malang, kami menghadirkan kurasi tempat makan terbaik untuk Anda.
                    </p>
                </div>
            </div>
        </main>
    );
}