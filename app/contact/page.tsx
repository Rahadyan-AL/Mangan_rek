"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
    const doodleSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%2300458B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'%3E%3C!-- Burger --%3E%3Cpath d='M 30 35 C 30 25, 50 25, 50 35 Z' /%3E%3Cpath d='M 28 38 L 52 38' /%3E%3Crect x='30' y='41' width='20' height='4' rx='2' /%3E%3Cpath d='M 30 48 C 30 53, 50 53, 50 48 Z' /%3E%3Ccircle cx='36' cy='30' r='0.5' /%3E%3Ccircle cx='44' cy='30' r='0.5' /%3E%3Ccircle cx='40' cy='28' r='0.5' /%3E%3C!-- Pizza --%3E%3Cpath d='M 150 20 L 165 45 L 135 45 Z' /%3E%3Cpath d='M 135 45 Q 150 55 165 45' /%3E%3Ccircle cx='145' cy='35' r='3' /%3E%3Ccircle cx='155' cy='40' r='2.5' /%3E%3Ccircle cx='150' cy='28' r='2' /%3E%3C!-- Noodle --%3E%3Cpath d='M 25 150 Q 40 170 55 150 Z' /%3E%3Cpath d='M 20 150 L 60 150' /%3E%3Cpath d='M 35 150 Q 40 135 45 150 T 55 150' /%3E%3Cpath d='M 30 150 Q 35 140 45 150' /%3E%3Cpath d='M 55 125 L 35 145' /%3E%3Cpath d='M 60 128 L 40 148' /%3E%3C!-- Apple --%3E%3Cpath d='M 150 145 C 135 140, 135 160, 150 160 C 165 160, 165 140, 150 145 Z' /%3E%3Cpath d='M 150 145 Q 155 135 155 130' /%3E%3Cpath d='M 155 130 Q 165 130 165 135 Q 155 140 155 130' /%3E%3C!-- Carrot --%3E%3Cpath d='M 95 90 L 110 105 Q 115 110 110 115 Q 105 120 100 115 L 85 100 Z' /%3E%3Cpath d='M 95 90 Q 85 80 80 85 Q 90 95 95 90' /%3E%3Cpath d='M 95 90 Q 90 75 85 80 Q 90 95 95 90' /%3E%3Cpath d='M 92 98 L 98 92' /%3E%3Cpath d='M 97 105 L 103 99' /%3E%3C/g%3E%3C/svg%3E")`;

    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulasi pengiriman data (delay 1 detik) lalu simpan ke localStorage
        setTimeout(() => {
            const newMessage = {
                id: Date.now().toString(),
                ...formData,
                date: new Date().toISOString(),
                read: false,
            };

            const existingMessages = JSON.parse(localStorage.getItem("adminMessages") || "[]");
            localStorage.setItem("adminMessages", JSON.stringify([newMessage, ...existingMessages]));

            setIsLoading(false);
            setSuccessMessage("Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1000);
    };

    return (
        <div
            className="w-full min-h-[calc(100vh-130px)] flex items-center justify-center py-12 px-4"
            style={{ backgroundImage: doodleSvg, backgroundSize: '150px 150px' }}
        >
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-slate-100 p-8 md:p-10">
                <h1 className="mb-2 text-3xl font-bold text-[#00458B] text-center">Contact Us</h1>
                <p className="text-center text-slate-500 mb-8 text-sm">
                    Kirimkan pertanyaan, saran tempat makan baru, atau pengajuan kerjasama melalui form di bawah ini.
                </p>

                {successMessage ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center mb-6">
                        <p>{successMessage}</p>
                        <Button 
                            variant="outline" 
                            className="mt-4 border-green-600 text-green-700 hover:bg-green-100"
                            onClick={() => setSuccessMessage("")}
                        >
                            Kirim Pesan Lain
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input id="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subjek</Label>
                            <Input id="subject" required value={formData.subject} onChange={handleChange} placeholder="Saran Tempat Makan" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Pesan</Label>
                            <textarea
                                id="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tulis pesan Anda di sini..."
                                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#00458B] hover:bg-[#00356b] text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Mengirim..." : "Kirim Pesan"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
