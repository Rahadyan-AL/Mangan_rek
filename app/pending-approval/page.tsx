import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-6">
        <Card className="w-full border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Menunggu Persetujuan</CardTitle>
            <CardDescription>
              Akun pemilik resto kamu sudah terdaftar, tetapi dashboard baru bisa
              dibuka setelah admin web menyetujui akun ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              Selama status masih pending, kamu belum bisa masuk ke dashboard
              admin resto.
            </p>
            <p>
              Kalau kamu adalah user biasa, kamu tetap bisa kembali ke halaman
              utama dan menjelajah restoran.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="inline-flex">
                <Button className="w-full bg-[#00458B] text-white hover:bg-[#00356b] sm:w-auto">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href="/login" className="inline-flex">
                <Button variant="outline" className="w-full sm:w-auto">
                  Login Ulang
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
