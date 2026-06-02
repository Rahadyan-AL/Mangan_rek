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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col lg:flex-row">

        <section className="flex w-full flex-1 items-center justify-center p-6 lg:w-3/5">
          <Card className="w-full max-w-md border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Masuk ke Akun</CardTitle>
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
        </section>
      </div>
    </main>
  );
}
