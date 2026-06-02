"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewMenuPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState("true");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !price) {
      setError("Nama dan harga wajib diisi.");
      return;
    }
    
    setIsLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("isAvailable", isAvailable);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${baseUrl}/api/restaurants/menus`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal menambahkan menu");
      }
      
      router.push("/dashboard/admin-resto/menu");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-6 px-0 hover:bg-transparent">
          <Link href="/dashboard/admin-resto/menu">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Tambah Menu Baru</CardTitle>
            <CardDescription>Masukkan detail menu untuk ditambahkan ke daftar restoran Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Menu</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Nasi Goreng Spesial"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat tentang menu"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isAvailable">Status Ketersediaan</Label>
                  <select
                    id="isAvailable"
                    value={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="true">Tersedia</option>
                    <option value="false">Habis (Sold Out)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Foto Menu</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                />
              </div>
              
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                className="mt-4 w-full bg-[#00458B] text-white hover:bg-[#00356b]"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Menu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
