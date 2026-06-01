"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_COOKIE_NAME, normalizeRole } from "@/lib/auth";

type ProfileResponse = {
  success?: boolean;
  message?: string;
  data?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string;
    status?: string;
  };
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string;
    status?: string;
  };
};

function readCookieValue(cookieName: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "MR"
  );
}

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<string | null>(() => normalizeRole(readCookieValue(ROLE_COOKIE_NAME)));
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) {
      router.replace("/login");
    }
  }, [role, router]);

  useEffect(() => {
    async function loadProfile() {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        setError("NEXT_PUBLIC_API_URL belum diisi di .env.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/auth/me`, {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
          },
          credentials: "include",
        });

        const data = (await response.json().catch(() => ({}))) as ProfileResponse;
        const profile = data.data ?? data.user ?? {};

        if (!response.ok) {
          setError(data.message ?? "Gagal memuat profil.");
          setIsLoading(false);
          return;
        }

        setName(profile.name ?? "");
        setEmail(profile.email ?? "");
        setPhone(profile.phone ?? "");
        setAddress(profile.address ?? "");
        setRole(normalizeRole(profile.role) ?? role);
        setStatus(profile.status ?? null);
      } catch {
        setError("Terjadi kesalahan saat memuat profil.");
      } finally {
        setIsLoading(false);
      }
    }

    if (role) {
      void loadProfile();
    }
  }, [role]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError("NEXT_PUBLIC_API_URL belum diisi di .env.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_API_KEY ?? "",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ProfileResponse;
      if (!response.ok) {
        setError(data.message ?? "Gagal memperbarui profil.");
        return;
      }

      const profile = data.data ?? data.user ?? {};
      setName(profile.name ?? name);
      setEmail(profile.email ?? email);
      setPhone(profile.phone ?? phone);
      setAddress(profile.address ?? address);
      setMessage(data.message ?? "Profil berhasil diperbarui.");
    } catch {
      setError("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Memuat profil...
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900"
      style={{ backgroundImage: "linear-gradient(to bottom, #f8fafc, #ffffff, #f1f5f9)" }}
    >
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <Avatar className="h-24 w-24 border border-slate-200 bg-[#00458B]/10 text-[#00458B]">
              <AvatarFallback className="bg-transparent text-2xl font-bold text-[#00458B]">
                {getInitials(name || email || "Mangan Rek")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">{name || "Profil Pengguna"}</h1>
              <p className="text-sm text-slate-500">{email || "Belum ada email"}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {role ? (
                <span className="rounded-full bg-[#00458B]/10 px-3 py-1 font-medium text-[#00458B]">
                  {role}
                </span>
              ) : null}
              {status ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                  {status}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Update Profil</CardTitle>
            <CardDescription>
              Perbarui data akun Anda melalui endpoint `/api/auth/profile`.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Nama Anda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">No. WhatsApp</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Alamat lengkap"
                />
              </div>

              {error ? (
                <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="sm:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}

              <div className="sm:col-span-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Kembali
                </Button>
                <Button
                  type="submit"
                  className="bg-[#00458B] text-white hover:bg-[#00356b]"
                  disabled={isSaving}
                >
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}