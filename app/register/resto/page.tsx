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
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [legalPhoto, setLegalPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (
      !ownerName ||
      !email ||
      !password ||
      !restaurantName ||
      !address ||
      !latitude ||
      !longitude
    ) {
      setError("Semua field wajib diisi kecuali foto legalitas.");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      setError("NEXT_PUBLIC_API_URL belum diisi di .env.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", ownerName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("restaurantName", restaurantName);
      formData.append("address", address);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (legalPhoto) {
        formData.append("legalPhoto", legalPhoto);
      }

      const response = await fetch(`${baseUrl}/api/auth/register/resto`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as RegisterResponse;
      if (!response.ok) {
        setError(data.message ?? "Registrasi gagal. Periksa kembali data Anda.");
        return;
      }

      document.cookie = `${ROLE_COOKIE_NAME}=admin-resto; path=/; max-age=2592000; samesite=lax`;
      document.cookie = `${ROLE_APPROVAL_COOKIE_NAME}=pending; path=/; max-age=2592000; samesite=lax`;
      router.push("/pending-approval");
    } catch {
      setError("Terjadi kesalahan saat registrasi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center p-6">
        <Card className="w-full max-w-2xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Daftar Pemilik Resto</CardTitle>
            <CardDescription>
              Lengkapi data akun dan informasi restoran Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Nama Pemilik</Label>
                <Input
                  id="ownerName"
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="restaurantName">Nama Restoran</Label>
                <Input
                  id="restaurantName"
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="Nama resto"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Alamat Restoran</Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-7.942134"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="112.620345"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="legalPhoto">Foto Legalitas (drive google)</Label>
                <Input
                  id="legalPhoto"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setLegalPhoto(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-slate-500">
                  Upload file legalitas seperti foto izin usaha atau dokumen PDF.
                </p>
              </div>

              {error ? (
                <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  className="w-full bg-[#00458B] text-white hover:bg-[#00356b]"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Daftar"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 text-sm text-slate-500">
            <div>
              Sudah punya akun resto?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login resto
              </Link>
            </div>
            <div>
              Bukan pemilik resto?{" "}
              <Link href="/register/user" className="text-blue-600 hover:underline">
                Daftar sebagai user
              </Link>
            </div>
            <div className="text-xs text-slate-400">
              Data Anda akan diverifikasi sebelum akun aktif.
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
