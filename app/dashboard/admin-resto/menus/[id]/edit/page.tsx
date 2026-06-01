"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState("true");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${baseUrl}/api/restaurants/menus`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const items = data.data || data.menus || data;
          const menuList = Array.isArray(items) ? items : [];
          const found = menuList.find((m: any) => m.id === id);
          if (found) {
            setPrice(found.price?.toString() || "");
            setIsAvailable(found.isAvailable === false ? "false" : "true");
          } else {
            setError("Menu tidak ditemukan");
          }
        } else {
          setError("Gagal memuat menu");
        }
      } catch (err) {
        setError("Kesalahan jaringan");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!price) {
      setError("Harga wajib diisi.");
      return;
    }
    
    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const payload = {
        price: Number(price),
        isAvailable: isAvailable === "true",
      };

      const res = await fetch(`${baseUrl}/api/restaurants/menus/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal memperbarui menu");
      }
      
      router.push("/dashboard/admin-resto");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="p-10 text-center">Memuat...</div>;
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground md:px-10 md:py-10">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-6 px-0 hover:bg-transparent">
          <Link href="/dashboard/admin-resto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Menu</CardTitle>
            <CardDescription>Perbarui harga dan status ketersediaan menu Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga Baru (Rp)</Label>
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
              
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                className="mt-4 w-full bg-[#00458B] text-white hover:bg-[#00356b]"
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
