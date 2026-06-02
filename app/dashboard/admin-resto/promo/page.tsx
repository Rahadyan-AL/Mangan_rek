"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Tag, Clock, CheckSquare, Square, Percent, AlertCircle, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PromoPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [promoType, setPromoType] = useState<"ALL" | "SPECIFIC">("ALL");
  const [discount, setDiscount] = useState("");
  const [startHour, setStartHour] = useState("14:00");
  const [endHour, setEndHour] = useState("17:00");
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);

  const fetchPromosAndMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      // Fetch active promos
      const promoRes = await fetch(`${baseUrl}/api/restaurants/promos`, {
        credentials: "include",
      });
      let promoDataList = [];
      if (promoRes.ok) {
        const data = await promoRes.json();
        promoDataList = data.data || data.promos || data;
      } else {
        throw new Error("Gagal mengambil data promo.");
      }

      // Fetch menus (for selective promos and listing targets)
      const menuRes = await fetch(`${baseUrl}/api/restaurants/menus`, {
        credentials: "include",
      });
      let menuDataList = [];
      if (menuRes.ok) {
        const data = await menuRes.json();
        menuDataList = data.data || data.menus || data;
      }

      setPromos(Array.isArray(promoDataList) ? promoDataList : []);
      setMenus(Array.isArray(menuDataList) ? menuDataList : []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromosAndMenus();
  }, [fetchPromosAndMenus]);

  const handleStartEdit = (promo: any) => {
    setEditingPromoId(promo.id);
    setPromoType(promo.type);
    setDiscount(promo.discount.toString());
    setStartHour(promo.startHour);
    setEndHour(promo.endHour);
    setSelectedMenuIds(promo.menuIds || []);
  };

  const handleCancelEdit = () => {
    setEditingPromoId(null);
    setPromoType("ALL");
    setDiscount("");
    setStartHour("14:00");
    setEndHour("17:00");
    setSelectedMenuIds([]);
  };

  async function handleAddPromo(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!discount || Number(discount) <= 0 || Number(discount) > 100) {
      setError("Diskon harus di antara 1% - 100%.");
      return;
    }
    if (!startHour || !endHour) {
      setError("Jam mulai dan jam selesai wajib diisi.");
      return;
    }
    if (promoType === "SPECIFIC" && selectedMenuIds.length === 0) {
      setError("Pilih minimal satu menu untuk promo spesifik.");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const payload: any = {
        type: promoType,
        discount: Number(discount),
        startHour,
        endHour,
      };

      if (promoType === "SPECIFIC") {
        payload.menuIds = selectedMenuIds;
      }

      const url = editingPromoId
        ? `${baseUrl}/api/restaurants/promos/${editingPromoId}`
        : `${baseUrl}/api/restaurants/promos`;
      const method = editingPromoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || (editingPromoId ? "Gagal memperbarui promo." : "Gagal menambahkan promo."));
      }

      // Clear Form & Reload
      handleCancelEdit();
      fetchPromosAndMenus();
      alert(editingPromoId ? "Promo berhasil diperbarui!" : "Promo berhasil ditambahkan!");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeletePromo(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus promo ini?")) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/promos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPromos((cur) => cur.filter((p) => p.id !== id));
        alert("Promo berhasil dihapus!");
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menghapus promo.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    }
  }

  // Helper to map menu names for specific promos
  function getMenuNames(menuIds: string[]) {
    if (!menuIds || !Array.isArray(menuIds)) return "-";
    const names = menuIds
      .map((id) => menus.find((m) => m.id === id)?.name || `Menu ID: ${id}`)
      .join(", ");
    return names || "Tidak ada menu yang terdaftar";
  }

  const handleToggleMenuSelection = (menuId: string) => {
    setSelectedMenuIds((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Promo Setup</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Atur jam promo (Happy Hour), nilai diskon, dan target menu.
            </p>
          </div>
          <Link href="/dashboard/admin-resto" className="text-sm text-primary hover:underline">
            Kembali ke overview
          </Link>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Active Promos Column */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Daftar Promo Aktif</CardTitle>
              <CardDescription>Semua diskon aktif yang sedang berjalan di restoran Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-4">Memuat data promo...</p>
              ) : promos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Belum ada promo yang ditambahkan.</p>
              ) : (
                promos.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          <Percent className="h-3 w-3" />
                          Diskon {promo.discount}%
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${promo.type === 'ALL' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {promo.type === "ALL" ? "Semua Menu" : "Menu Spesifik"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Jam Aktif: {promo.startHour} - {promo.endHour}</span>
                      </div>
                      {promo.type === "SPECIFIC" && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">Target Menu: </span>
                          {getMenuNames(promo.menuIds)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 self-start sm:self-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(promo)}
                      >
                        <Pencil className="mr-1.5 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePromo(promo.id)}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" /> Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Setup Promo Form Column */}
          <Card className="border border-border h-fit">
            <CardHeader>
              <CardTitle className="text-lg">{editingPromoId ? "Edit Promo" : "Buat Promo Baru"}</CardTitle>
              <CardDescription>
                {editingPromoId ? "Perbarui detail jam diskon dan target menu." : "Tambahkan potongan diskon berjangka."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPromo} className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Promo</Label>
                  <select
                    id="type"
                    value={promoType}
                    onChange={(e) => setPromoType(e.target.value as any)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="ALL">Semua Produk (ALL)</option>
                    <option value="SPECIFIC">Produk Spesifik (SPECIFIC)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Diskon (%)</Label>
                  <div className="relative">
                    <Input
                      id="discount"
                      type="number"
                      min="1"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="Masukkan persen diskon, e.g. 15"
                      required
                    />
                    <Percent className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startHour">Jam Mulai</Label>
                    <Input
                      id="startHour"
                      type="time"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endHour">Jam Selesai</Label>
                    <Input
                      id="endHour"
                      type="time"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {promoType === "SPECIFIC" && (
                  <div className="space-y-2">
                    <Label>Pilih Menu Target</Label>
                    {menus.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Belum ada menu terdaftar untuk dipilih.</p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto rounded-md border border-border bg-background p-3 space-y-2">
                        {menus.map((menu) => {
                          const isChecked = selectedMenuIds.includes(menu.id);
                          return (
                            <button
                              type="button"
                              key={menu.id}
                              onClick={() => handleToggleMenuSelection(menu.id)}
                              className="flex w-full items-center gap-2 text-left text-sm hover:bg-muted/50 p-1 rounded transition-colors"
                            >
                              {isChecked ? (
                                <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                              ) : (
                                <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span className="line-clamp-1">{menu.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-[#00458B] text-white hover:bg-[#00356b]"
                >
                  {editingPromoId ? <Pencil className="mr-1.5 h-4 w-4" /> : <Plus className="mr-1.5 h-4 w-4" />}
                  {isSubmitting ? "Menyimpan..." : editingPromoId ? "Simpan Perubahan" : "Tambahkan Promo"}
                </Button>
                {editingPromoId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="w-full"
                  >
                    Batal Edit
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
