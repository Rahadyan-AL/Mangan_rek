"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  ApprovalStatus,
  AppRole,
  ROLE_APPROVAL_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  getAuthRedirectPath,
  isAppRole,
  normalizeApprovalStatus,
  normalizeRole,
} from "@/lib/auth";

type LoginResponse = {
  success?: boolean;
  message?: string;
  role?: string;
  status?: string;
  approved?: boolean;
  data?: {
    role?: string;
    status?: string;
    approved?: boolean;
    user?: {
      role?: string;
      status?: string;
      approved?: boolean;
    };
  };
  user?: {
    role?: string;
    status?: string;
    approved?: boolean;
  };
};

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function setAuthCookies(nextRole: AppRole, approvalStatus: ApprovalStatus) {
    document.cookie = `${ROLE_COOKIE_NAME}=${nextRole}; path=/; max-age=2592000; samesite=lax`;
    document.cookie = `${ROLE_APPROVAL_COOKIE_NAME}=${approvalStatus}; path=/; max-age=2592000; samesite=lax`;
  }

  function resolveRole(data: LoginResponse): AppRole {
    const candidate = data.role ?? data.data?.role ?? data.data?.user?.role ?? data.user?.role;
    const normalized = normalizeRole(candidate);
    return normalized ?? "user";
  }

  function resolveApprovalStatus(data: LoginResponse, nextRole: AppRole) {
    const explicitStatus =
      normalizeApprovalStatus(data.status) ??
      normalizeApprovalStatus(data.data?.status) ??
      normalizeApprovalStatus(data.data?.user?.status) ??
      normalizeApprovalStatus(data.user?.status);

    if (explicitStatus) {
      return explicitStatus;
    }

    const explicitApproved =
      data.approved ?? data.data?.approved ?? data.data?.user?.approved ?? data.user?.approved;

    if (typeof explicitApproved === "boolean") {
      return explicitApproved ? "approved" : "pending";
    }

    return nextRole === "admin-resto" ? "pending" : "approved";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError("");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json().catch(() => ({}))) as LoginResponse;
      if (!response.ok) {
        setError(data.message ?? "Login gagal. Periksa kembali data Anda.");
        return;
      }

      const nextRole = resolveRole(data);
      const approvalStatus = resolveApprovalStatus(data, nextRole);
      setAuthCookies(nextRole, approvalStatus);

      if (nextRole === "admin-resto" && approvalStatus === "pending") {
        router.push("/pending-approval");
        return;
      }

      router.push(getAuthRedirectPath(nextRole));
    } catch {
      setError("Terjadi kesalahan saat login. Coba lagi.");
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
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="/image/Mangan_Rek_logo-Photoroom.png"
            alt="Mangan Rek Logo"
            className="h-40 w-auto object-contain "
          />
        </div>

        <Card className="w-full border border-slate-200 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#00458B]">Masuk ke Akun</CardTitle>
              <CardDescription>
                Gunakan email dan password terdaftar untuk melanjutkan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                  {isLoading ? "Memproses..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 text-sm text-slate-500">
              <div>
                Belum punya akun?{" "}
                <Link href="/register/user" className="text-blue-600 hover:underline">
                  Daftar sekarang
                </Link>
              </div>
            </CardFooter>
          </Card>
      </div>
    </main>
  );
}
