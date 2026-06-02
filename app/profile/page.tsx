"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserIcon } from "lucide-react";

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
import { ROLE_APPROVAL_COOKIE_NAME, ROLE_COOKIE_NAME, normalizeRole } from "@/lib/auth";

type ProfileResponse = {
  success?: boolean;
  message?: string;
  data?: {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
  };
  user?: {
    name?: string;
    email?: string;
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
  const [role, setRole] = useState<string | null>(() => normalizeRole(readCookieValue(ROLE_COOKIE_NAME)));
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
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

  async function handleLogout() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    setIsLoggingOut(true);
    try {
      if (baseUrl) {
        await fetch(`${baseUrl}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }
    } finally {
      document.cookie = `${ROLE_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
      document.cookie = `${ROLE_APPROVAL_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
      router.push("/login");
    }
  }

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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
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
      setMessage(data.message ?? "Profil berhasil diperbarui.");
    } catch {
      setError("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setPasswordError("NEXT_PUBLIC_API_URL belum diisi di .env.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPasswordError(data.message ?? "Gagal mengganti password.");
        return;
      }

      setPasswordMessage(data.message ?? "Password berhasil diganti.");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setPasswordError("Terjadi kesalahan saat mengganti password.");
    } finally {
      setIsChangingPassword(false);
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
                <UserIcon className="h-12 w-12" />
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
            <Button
              variant="outline"
              className="mt-2 w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Keluar..." : "Logout"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Update Profil</CardTitle>
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

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@email.com"
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

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Ganti Password</CardTitle>
              <CardDescription>
                Ganti password lama Anda dengan password baru yang lebih aman.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="oldPassword">Password Lama</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(event) => setOldPassword(event.target.value)}
                    placeholder="Masukkan password saat ini"
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Masukkan password baru"
                    required
                  />
                </div>

                {passwordError ? (
                  <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {passwordError}
                  </div>
                ) : null}

                {passwordMessage ? (
                  <div className="sm:col-span-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {passwordMessage}
                  </div>
                ) : null}

                <div className="sm:col-span-2 flex justify-end gap-3">
                  <Button
                    type="submit"
                    className="bg-amber-600 text-white hover:bg-amber-700"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? "Memproses..." : "Ganti Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}