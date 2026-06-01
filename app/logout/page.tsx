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
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        credentials: "include",
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6">
        <Card className="w-full max-w-md border border-slate-200 shadow-sm">
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
