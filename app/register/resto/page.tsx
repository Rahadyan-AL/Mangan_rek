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
  const [showPassword, setShowPassword] = useState(false);

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

  const doodleSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%2300458B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'%3E%3C!-- Burger --%3E%3Cpath d='M 30 35 C 30 25, 50 25, 50 35 Z' /%3E%3Cpath d='M 28 38 L 52 38' /%3E%3Crect x='30' y='41' width='20' height='4' rx='2' /%3E%3Cpath d='M 30 48 C 30 53, 50 53, 50 48 Z' /%3E%3Ccircle cx='36' cy='30' r='0.5' /%3E%3Ccircle cx='44' cy='30' r='0.5' /%3E%3Ccircle cx='40' cy='28' r='0.5' /%3E%3C!-- Pizza --%3E%3Cpath d='M 150 20 L 165 45 L 135 45 Z' /%3E%3Cpath d='M 135 45 Q 150 55 165 45' /%3E%3Ccircle cx='145' cy='35' r='3' /%3E%3Ccircle cx='155' cy='40' r='2.5' /%3E%3Ccircle cx='150' cy='28' r='2' /%3E%3C!-- Noodle --%3E%3Cpath d='M 25 150 Q 40 170 55 150 Z' /%3E%3Cpath d='M 20 150 L 60 150' /%3E%3Cpath d='M 35 150 Q 40 135 45 150 T 55 150' /%3E%3Cpath d='M 30 150 Q 35 140 45 150' /%3E%3Cpath d='M 55 125 L 35 145' /%3E%3Cpath d='M 60 128 L 40 148' /%3E%3C!-- Apple --%3E%3Cpath d='M 150 145 C 135 140, 135 160, 150 160 C 165 160, 165 140, 150 145 Z' /%3E%3Cpath d='M 150 145 Q 155 135 155 130' /%3E%3Cpath d='M 155 130 Q 165 130 165 135 Q 155 140 155 130' /%3E%3C!-- Carrot --%3E%3Cpath d='M 95 90 L 110 105 Q 115 110 110 115 Q 105 120 100 115 L 85 100 Z' /%3E%3Cpath d='M 95 90 Q 85 80 80 85 Q 90 95 95 90' /%3E%3Cpath d='M 95 90 Q 90 75 85 80 Q 90 95 95 90' /%3E%3Cpath d='M 92 98 L 98 92' /%3E%3Cpath d='M 97 105 L 103 99' /%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <main
      className="min-h-screen text-slate-900 flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: doodleSvg, backgroundSize: '150px 150px', backgroundColor: '#f8fafc' }}
    >
      <div className="w-full max-w-2xl">
        <Card className="w-full border border-slate-200 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#00458B]">Daftar Pemilik Resto</CardTitle>
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
                <Label htmlFor="legalPhoto">Foto restoran</Label>
                <Input
                  id="legalPhoto"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setLegalPhoto(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-slate-500">
                  Upload foto restoran Anda.
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
