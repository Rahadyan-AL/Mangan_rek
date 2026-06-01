"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findPublicMenu, findPublicRestaurant } from "@/lib/public-restaurants";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const menuId = searchParams.get("menuId");

  const restaurant = useMemo(() => findPublicRestaurant(restaurantId), [restaurantId]);
  const menu = useMemo(() => findPublicMenu(restaurantId, menuId), [menuId, restaurantId]);

  const activeMenu = menu ?? restaurant?.menus[0] ?? null;

  if (!restaurant || !activeMenu) {
    return (
      <main className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl border border-border bg-card p-10 text-center">
          <p className="text-lg font-semibold">Menu belum ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba kembali ke daftar restoran untuk memilih menu lain.
          </p>
          <Button asChild className="bg-[#00458B] text-white hover:bg-[#00356b]">
            <Link href="/restaurants">Cari Restoran</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)), hsl(var(--muted) / 0.3))",
      }}
    >
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 px-0">
          <ArrowLeft />
          Kembali
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="relative h-[28rem] w-full">
              <Image src={activeMenu.image} alt={activeMenu.name} fill className="object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">{restaurant.category}</p>
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight">{activeMenu.name}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">{restaurant.name}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-primary/70">
                    Harga
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    Rp {activeMenu.price.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {activeMenu.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Ringkasan Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Restoran</span>
                  <span className="font-medium text-foreground">{restaurant.name}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Kategori</span>
                  <span className="font-medium text-foreground">{restaurant.category}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Harga</span>
                  <span className="font-medium text-foreground">
                    Rp {activeMenu.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#00458B] text-white hover:bg-[#00356b]">
                  <ShoppingBag />
                  Tambah ke Pesanan
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/restaurants/restaurants-detail?restaurantId=${restaurant.id}`}>
                    Lihat Detail Restoran
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/restaurants">Cari Restoran Lain</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}