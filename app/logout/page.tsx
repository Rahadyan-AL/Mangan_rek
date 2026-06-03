"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROLE_APPROVAL_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/auth";

type LogoutResponse = {
  success?: boolean;
  message?: string;
};

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError("NEXT_PUBLIC_API_URL belum diisi di .env.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json().catch(() => ({}))) as LogoutResponse;
      if (!response.ok) {
        setError(data.message ?? "Logout gagal. Coba lagi.");
        return;
      }

      document.cookie = `${ROLE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `${ROLE_APPROVAL_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
      router.push("/login");
    } catch {
      setError("Terjadi kesalahan saat logout. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  const doodleSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%2300458B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'%3E%3C!-- Burger --%3E%3Cpath d='M 30 35 C 30 25, 50 25, 50 35 Z' /%3E%3Cpath d='M 28 38 L 52 38' /%3E%3Crect x='30' y='41' width='20' height='4' rx='2' /%3E%3Cpath d='M 30 48 C 30 53, 50 53, 50 48 Z' /%3E%3Ccircle cx='36' cy='30' r='0.5' /%3E%3Ccircle cx='44' cy='30' r='0.5' /%3E%3Ccircle cx='40' cy='28' r='0.5' /%3E%3C!-- Pizza --%3E%3Cpath d='M 150 20 L 165 45 L 135 45 Z' /%3E%3Cpath d='M 135 45 Q 150 55 165 45' /%3E%3Ccircle cx='145' cy='35' r='3' /%3E%3Ccircle cx='155' cy='40' r='2.5' /%3E%3Ccircle cx='150' cy='28' r='2' /%3E%3C!-- Noodle --%3E%3Cpath d='M 25 150 Q 40 170 55 150 Z' /%3E%3Cpath d='M 20 150 L 60 150' /%3E%3Cpath d='M 35 150 Q 40 135 45 150 T 55 150' /%3E%3Cpath d='M 30 150 Q 35 140 45 150' /%3E%3Cpath d='M 55 125 L 35 145' /%3E%3Cpath d='M 60 128 L 40 148' /%3E%3C!-- Apple --%3E%3Cpath d='M 150 145 C 135 140, 135 160, 150 160 C 165 160, 165 140, 150 145 Z' /%3E%3Cpath d='M 150 145 Q 155 135 155 130' /%3E%3Cpath d='M 155 130 Q 165 130 165 135 Q 155 140 155 130' /%3E%3C!-- Carrot --%3E%3Cpath d='M 95 90 L 110 105 Q 115 110 110 115 Q 105 120 100 115 L 85 100 Z' /%3E%3Cpath d='M 95 90 Q 85 80 80 85 Q 90 95 95 90' /%3E%3Cpath d='M 95 90 Q 90 75 85 80 Q 90 95 95 90' /%3E%3Cpath d='M 92 98 L 98 92' /%3E%3Cpath d='M 97 105 L 103 99' /%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <main
      className="min-h-screen text-slate-900 flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: doodleSvg, backgroundSize: '150px 150px', backgroundColor: '#f8fafc' }}
    >
      <div className="w-full max-w-md">
        <Card className="w-full border border-slate-200 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Keluar Akun</CardTitle>
            <CardDescription>
              Klik tombol di bawah untuk keluar dari akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            <Button
              className="w-full bg-[#00458B] text-white hover:bg-[#00356b]"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Sign Out"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
