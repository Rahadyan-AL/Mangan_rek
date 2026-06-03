"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserIcon, Settings, History, ShoppingBag, Loader2 } from "lucide-react";

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

  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  useEffect(() => {
    async function loadHistory() {
      if (activeTab !== "history" || !role) return;
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;

      try {
        setIsLoadingHistory(true);
        const response = await fetch(`${baseUrl}/api/vouchers/history/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setHistoryData(data.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat histori", err);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadHistory();
  }, [activeTab, role]);

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
      setMessage("Profil berhasil diperbarui. Silakan login kembali.");
      
      setTimeout(() => {
        handleLogout();
      }, 2000);
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

      setPasswordMessage("Password berhasil diganti. Silakan login kembali.");
      setOldPassword("");
      setNewPassword("");

      setTimeout(() => {
        handleLogout();
      }, 2000);
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
          {/* Tabs */}
          <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Settings size={16} />
              Pengaturan Profil
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <History size={16} />
              Histori Pembelian
            </button>
          </div>

          {activeTab === "profile" && (
            <>
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
          </>
          )}

          {activeTab === "history" && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Histori Pembelian</CardTitle>
                <CardDescription>
                  Daftar voucher yang pernah Anda beli. Tunjukkan QRIS atau kode unik ke kasir untuk menukarkan voucher.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <ShoppingBag size={20} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">Belum ada pembelian</h3>
                    <p className="mt-1 text-sm text-slate-500">Anda belum pernah membeli promo atau voucher.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historyData.map((tx: any) => (
                      <div key={tx.id} className="flex flex-col md:flex-row md:items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
                        <div className="flex gap-4">
                          {tx.voucher?.restaurant?.legalPhoto ? (
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={tx.voucher.restaurant.legalPhoto} alt="Resto" className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                              No Img
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{tx.voucher?.title || "Voucher Promo"}</p>
                            <p className="text-xs text-slate-500 mt-1">{tx.voucher?.restaurant?.name}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                tx.status === "PAID" ? "bg-green-100 text-green-700" :
                                (tx.status === "PENDING" && (new Date().getTime() - new Date(tx.createdAt).getTime() > 15 * 60 * 1000)) ? "bg-red-100 text-red-700" :
                                tx.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                "bg-slate-100 text-slate-700"
                              }`}>
                                {tx.status === "PENDING" && (new Date().getTime() - new Date(tx.createdAt).getTime() > 15 * 60 * 1000) ? "EXPIRED" : tx.status}
                              </span>
                              <span className="text-xs font-medium text-slate-700">Rp {tx.totalPaid.toLocaleString('id-ID')}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                              {new Date(tx.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {tx.status === "PENDING" && tx.paymentUrl && (
                          <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-100 shrink-0">
                            {(new Date().getTime() - new Date(tx.createdAt).getTime() > 15 * 60 * 1000) ? (
                              <>
                                <p className="text-[10px] font-semibold uppercase text-red-500">QR Kadaluarsa</p>
                                <div className="flex h-20 w-20 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
                                  Expired
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-[10px] font-semibold uppercase text-slate-500">Scan QRIS untuk Bayar</p>
                                <div className="rounded bg-white p-1 shadow-sm">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(tx.paymentUrl)}`} 
                                    alt="QRIS Code" 
                                    className="h-20 w-20 object-contain"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        
                        {tx.status === "PAID" && tx.uniqueCode && (
                          <div className="flex flex-col items-center justify-center gap-1 rounded-lg bg-emerald-50 p-4 border border-emerald-100 shrink-0 min-w-[120px]">
                            <p className="text-[10px] font-semibold uppercase text-emerald-600">Kode Unik</p>
                            <p className="text-xl font-bold tracking-widest text-emerald-700">{tx.uniqueCode}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}