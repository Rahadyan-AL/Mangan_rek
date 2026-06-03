"use client";

import Link from "next/link";
import { Clock, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const doodleSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%2300458B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'%3E%3C!-- Burger --%3E%3Cpath d='M 30 35 C 30 25, 50 25, 50 35 Z' /%3E%3Cpath d='M 28 38 L 52 38' /%3E%3Crect x='30' y='41' width='20' height='4' rx='2' /%3E%3Cpath d='M 30 48 C 30 53, 50 53, 50 48 Z' /%3E%3Ccircle cx='36' cy='30' r='0.5' /%3E%3Ccircle cx='44' cy='30' r='0.5' /%3E%3Ccircle cx='40' cy='28' r='0.5' /%3E%3C!-- Pizza --%3E%3Cpath d='M 150 20 L 165 45 L 135 45 Z' /%3E%3Cpath d='M 135 45 Q 150 55 165 45' /%3E%3Ccircle cx='145' cy='35' r='3' /%3E%3Ccircle cx='155' cy='40' r='2.5' /%3E%3Ccircle cx='150' cy='28' r='2' /%3E%3C!-- Noodle --%3E%3Cpath d='M 25 150 Q 40 170 55 150 Z' /%3E%3Cpath d='M 20 150 L 60 150' /%3E%3Cpath d='M 35 150 Q 40 135 45 150 T 55 150' /%3E%3Cpath d='M 30 150 Q 35 140 45 150' /%3E%3Cpath d='M 55 125 L 35 145' /%3E%3Cpath d='M 60 128 L 40 148' /%3E%3C!-- Apple --%3E%3Cpath d='M 150 145 C 135 140, 135 160, 150 160 C 165 160, 165 140, 150 145 Z' /%3E%3Cpath d='M 150 145 Q 155 135 155 130' /%3E%3Cpath d='M 155 130 Q 165 130 165 135 Q 155 140 155 130' /%3E%3C!-- Carrot --%3E%3Cpath d='M 95 90 L 110 105 Q 115 110 110 115 Q 105 120 100 115 L 85 100 Z' /%3E%3Cpath d='M 95 90 Q 85 80 80 85 Q 90 95 95 90' /%3E%3Cpath d='M 95 90 Q 90 75 85 80 Q 90 95 95 90' /%3E%3Cpath d='M 92 98 L 98 92' /%3E%3Cpath d='M 97 105 L 103 99' /%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <main 
      className="min-h-screen text-slate-900 flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: doodleSvg, backgroundSize: '150px 150px', backgroundColor: '#f8fafc' }}
    >
      <div className="mx-auto flex min-h-[75vh] w-full max-w-3xl items-center justify-center p-6">
        <Card className="w-full border border-slate-200/80 shadow-2xl bg-white/95 backdrop-blur-md p-2">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 shadow-inner">
              <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
            </div>
            <CardTitle className="text-3xl font-bold text-[#00458B]">Menunggu Persetujuan</CardTitle>
            <CardDescription className="text-base mt-2">
              Akun pemilik resto kamu sudah berhasil didaftarkan!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center text-slate-600 mt-2">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-6 space-y-3">
              <p className="font-medium text-slate-700">
                Dashboard admin resto baru bisa dibuka setelah <span className="font-bold text-amber-600">Super Admin</span> menyetujui akun ini.
              </p>
              <p className="text-sm">
                Proses verifikasi ini diperlukan untuk memastikan keamanan dan kevalidan data restoran. Mohon tunggu sebentar ya!
              </p>
            </div>
            
            <p className="text-sm text-slate-500">
              Sambil menunggu, kamu tetap bisa menjelajahi restoran lain sebagai pengguna biasa.
            </p>
            
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex w-full sm:w-auto">
                <Button className="w-full bg-[#00458B] text-white hover:bg-[#00356b] gap-2 h-11 px-8 shadow-md">
                  <Home className="h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href="/login" className="inline-flex w-full sm:w-auto">
                <Button variant="outline" className="w-full h-11 px-8 gap-2 border-slate-300 hover:bg-slate-100">
                  <LogIn className="h-4 w-4" />
                  Cek Status (Login)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
