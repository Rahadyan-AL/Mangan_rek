"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ROLE_APPROVAL_COOKIE_NAME,
  ROLE_COOKIE_NAME,
} from "@/lib/auth";

type RegisterResponse = {
  success?: boolean;
  message?: string;
};

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError("NEXT_PUBLIC_API_URL belum diisi di .env.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json().catch(() => ({}))) as RegisterResponse;
      if (!response.ok) {
        setError(data.message ?? "Registrasi gagal. Periksa kembali data Anda.");
        return;
      }

      document.cookie = `${ROLE_COOKIE_NAME}=user; path=/; max-age=2592000; samesite=lax`;
      document.cookie = `${ROLE_APPROVAL_COOKIE_NAME}=approved; path=/; max-age=2592000; samesite=lax`;
      router.push("/");
    } catch {
      setError("Terjadi kesalahan saat registrasi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">

        <section className="flex w-full flex-1 items-center justify-center p-6 lg:w-3/5">
          <Card className="w-full max-w-md border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Buat Akun</CardTitle>
              <CardDescription>
                Daftar sebagai pengguna untuk mulai menjelajah kuliner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 karakter"
                    required
                  />
                </div>

                {error ? (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-[#00458B] text-white hover:bg-[#00356b]"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Register"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 text-sm text-slate-500">
              <div>
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login disini
                </Link>
              </div>
              <div>
                Apakah kamu pemilik resto?{" "}
                <Link href="/register/resto" className="text-blue-600 hover:underline">
                  Daftar sebagai pemilik
                </Link>
              </div>
              <div className="text-xs text-slate-400">
                Dengan membuat akun, Anda menyetujui syarat dan ketentuan.
              </div>
            </CardFooter>
          </Card>
        </section>
      </div>
    </main>
  );
}
