"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Utensils } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/menus`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Gagal memuat data menu dari server");
      }
      const data = await res.json();
      const items = data.data || data.menus || data;
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/menus/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMenuItems((cur) => cur.filter((m) => m.id !== id));
        toast.success("Menu berhasil dihapus");
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus menu");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan saat menghapus menu");
    }
  }
  const filteredMenuItems = menuItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Menu Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola menu makanan dan minuman restoran Anda di sini.
            </p>
          </div>
          <Button asChild className="bg-[#00458B] text-white hover:bg-[#00356b] self-start sm:self-auto">
            <Link href="/dashboard/admin-resto/menu/new">
              <Plus className="mr-2 h-4 w-4" /> Tambah Menu Baru
            </Link>
          </Button>
        </header>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 border rounded-lg p-1 bg-card shadow-sm shrink-0">
            <button 
              onClick={() => setSortOrder('asc')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${sortOrder === 'asc' ? 'bg-[#00458B] text-white font-medium' : 'hover:bg-muted text-muted-foreground'}`}
            >
              A-Z
            </button>
            <button 
              onClick={() => setSortOrder('desc')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${sortOrder === 'desc' ? 'bg-[#00458B] text-white font-medium' : 'hover:bg-muted text-muted-foreground'}`}
            >
              Z-A
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">Memuat daftar menu...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p>{error}</p>
            <Button onClick={fetchMenus} variant="outline" className="mt-4 border-red-200 hover:bg-red-100">
              Coba Lagi
            </Button>
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card">
            <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Tidak ada menu yang cocok dengan pencarian Anda." : "Belum ada menu yang terdaftar."}
            </p>
            {!searchQuery && (
              <Button asChild className="mt-4 bg-[#00458B] text-white hover:bg-[#00356b]">
                <Link href="/dashboard/admin-resto/menu/new">
                  Tambah Menu Pertama
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMenuItems.map((item) => {
              const isAvailable = item.isAvailable || item.status === "Available";
              return (
                <Card key={item.id} className="overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-xs">
                        Tidak ada foto
                      </div>
                    )}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {isAvailable ? "Tersedia" : "Habis"}
                      </span>
                      {item.discountedPrice && (
                        <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          Promo
                        </span>
                      )}
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2 min-h-[2rem]">
                      {item.description || "Tidak ada deskripsi."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between border-t border-border/60 pt-4">
                      <div>
                        {item.discountedPrice ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">
                              Rp {Number(item.price).toLocaleString("id-ID")}
                            </span>
                            <span className="text-base font-bold text-primary">
                              Rp {Number(item.discountedPrice).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-base font-bold text-primary">
                            Rp {Number(item.price).toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/admin-resto/menu/${item.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
