"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BadgePercent, Sandwich, ShoppingCart, Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/menus`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.data || data.menus || data;
        setMenuItems(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  async function handleDelete(id: string) {
    if (!confirm("Hapus menu ini?")) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/menus/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMenuItems((cur) => cur.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menghapus menu");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    }
  }

  const dynamicStats = [
    {
      label: "Total Orders",
      value: "245",
      trend: "+8%",
      tone: "bg-primary/10 text-primary",
      icon: ShoppingCart,
    },
    {
      label: "Menu Items",
      value: menuItems.length.toString(),
      trend: "+0%",
      tone: "bg-secondary/10 text-secondary",
      icon: Sandwich,
    },
    {
      label: "Active Promos",
      value: "0",
      trend: "+0%",
      tone: "bg-accent/10 text-accent",
      icon: BadgePercent,
    },
    {
      label: "Total Revenue",
      value: "Rp 85.400.000",
      trend: "+12%",
      tone: "bg-emerald-10 text-emerald-700",
      icon: ShoppingCart,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Resto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan aktivitas dan menu populer hari ini.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dynamicStats.map((item) => (
            <Card key={item.label} className="border border-border">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}>
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <CardDescription>{item.label}</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                      {item.value}
                    </CardTitle>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {item.trend}
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Menu Management</CardTitle>
                <CardDescription>
                  Kelola menu dan status ketersediaan.
                </CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/dashboard/admin-resto/menus/new">
                  <Plus className="mr-2 h-4 w-4" /> Tambah
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Memuat menu...</p>
              ) : menuItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada menu yang ditambahkan.</p>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Rp {Number(item.price).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isAvailable || item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.isAvailable || item.status === 'Available' ? "Available" : "Sold Out"}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/admin-resto/menus/${item.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Promo Setup</CardTitle>
              <CardDescription>Atur jam promo dan diskon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Start Time</p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  --:--
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">End Time</p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  --:--
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Discount (%)</p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  e.g. 20
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Set Promo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
