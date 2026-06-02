"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, MapPin, Star, UtensilsCrossed, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ROLE_COOKIE_NAME,
  normalizeRole,
} from "@/lib/auth";
import {
  isFavoriteRestaurant,
  toggleFavoriteRestaurant,
} from "@/lib/local-favorites";

function readCookieValue(cookieName: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const [tick, setTick] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!restaurantId) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      try {
        const [restoRes, menusRes] = await Promise.all([
          fetch(`${baseUrl}/api/restaurants/${restaurantId}`),
          fetch(`${baseUrl}/api/restaurants/${restaurantId}/menus`)
        ]);

        if (restoRes.ok && menusRes.ok) {
          const restoData = await restoRes.json();
          const menusData = await menusRes.json();
          const resto = restoData.data || restoData;
          const menus = menusData.data || menusData;
          setRestaurant({ ...resto, menus });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router, restaurantId]);

  function handleToggleFavorite() {
    const cookieRole = normalizeRole(readCookieValue(ROLE_COOKIE_NAME));
    if (!cookieRole) {
      router.push("/login");
      return;
    }

    toggleFavoriteRestaurant({
      id: restaurant.id,
      name: restaurant.name || restaurant.restaurantName,
      address: restaurant.address || restaurant.location,
      image: restaurant.legalPhoto || restaurant.image || "/image/makanan/bakso.jpg",
      category: restaurant.category || "Kuliner",
      description: restaurant.description,
      distanceKm: restaurant.distanceKm,
      rating: restaurant.rating,
    });
    // force recompute derived favorite state
    setTick((t) => t + 1);
  }

  const isFavorite = restaurant ? isFavoriteRestaurant(restaurant.id) : false;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }
  if (!restaurant) {
    return <div className="min-h-screen flex items-center justify-center">Restoran tidak ditemukan.</div>;
  }

  return (
    <main
      className="min-h-screen bg-background text-foreground pb-20"
      style={{
        backgroundImage: "radial-gradient(ellipse at top, hsl(var(--muted) / 0.6), transparent 80%)",
      }}
    >
      <section className="mx-auto w-full max-w-6xl px-6 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-8 rounded-full px-5 hover:bg-muted/50 transition-colors shadow-sm bg-background/50 backdrop-blur-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg transition-all hover:shadow-xl">
              <div className="relative h-80 w-full">
                <Image
                  src={restaurant.legalPhoto || restaurant.image || "/image/makanan/bakso.jpg"}
                  alt={restaurant.name || "Restaurant"}
                  fill
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-5 py-2.5 text-sm font-bold text-foreground shadow-sm backdrop-blur-md transition-all hover:scale-105"
                  aria-pressed={isFavorite}
                >
                  <Heart
                    className={isFavorite ? "fill-red-500 text-red-500" : "text-foreground"}
                    size={18}
                  />
                  {isFavorite ? "Tersimpan" : "Simpan"}
                </button>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                      <Store className="h-4 w-4" />
                      <span>{restaurant.owner?.name || restaurant.category || restaurant.type || "Kuliner"}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                      {restaurant.name || restaurant.restaurantName}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1">
                        <MapPin size={14} />
                        {restaurant.address}
                      </span>
                      {restaurant.rating != null && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-amber-600 font-medium">
                          <Star size={14} className="fill-amber-500" />
                          {Number(restaurant.rating || 0).toFixed(1)}
                        </span>
                      )}
                      {restaurant.distanceKm != null && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1">
                          {Number(restaurant.distanceKm || restaurant.distance || 0).toFixed(1)} km
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 rounded-[1.5rem] bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-4 text-right shadow-sm border border-primary/20 backdrop-blur-md">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                      Promo Aktif
                    </div>
                    <div className="text-lg font-bold text-primary mt-1">
                      {restaurant.promoLabel || "Tidak ada promo"}
                    </div>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                  {restaurant.description || "Deskripsi restoran belum tersedia."}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button variant="outline" asChild className="h-12 rounded-xl border-border/50 bg-background/50 px-8 text-base font-semibold backdrop-blur-sm transition-all hover:bg-muted/50 text-foreground">
                    <Link href={`/restaurants/menu-detail?restaurantId=${restaurant.id}`}>
                      Lihat Semua Menu
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-xl font-bold">Menu Rekomendasi</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 pt-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {restaurant.menus && restaurant.menus.length > 0 ? restaurant.menus.map((menu: any) => (
                  <Link
                    key={menu.id}
                    href={`/restaurants/menu-detail?restaurantId=${restaurant.id}&menuId=${menu.id}`}
                    className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border/50 bg-background/50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image src={menu.image || "/image/makanan/bakso.jpg"} alt={menu.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      {menu.discountedPrice && (
                        <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                          Promo
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold group-hover:text-primary transition-colors line-clamp-1">
                          {menu.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{menu.description || "Deskripsi menu belum tersedia."}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        {menu.discountedPrice ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground line-through">Rp {Number(menu.price).toLocaleString("id-ID")}</span>
                            <span className="text-sm font-bold text-primary">Rp {Number(menu.discountedPrice).toLocaleString("id-ID")}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-primary">
                            Rp {Number(menu.price).toLocaleString("id-ID")}
                          </span>
                        )}
                        <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-sm text-muted-foreground">Belum ada menu rekomendasi yang ditambahkan.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold">Informasi Singkat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground pt-5">
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 hover:bg-muted transition-colors">
                  <span>Status</span>
                  <span className="font-medium text-foreground">
                    {restaurant.isOpen === true ? "Buka" : restaurant.isOpen === false ? "Tutup" : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 hover:bg-muted transition-colors">
                  <span>Jarak</span>
                  <span className="font-medium text-foreground">
                    {restaurant.distanceKm != null ? `${Number(restaurant.distanceKm || restaurant.distance || 0).toFixed(1)} km` : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                <Button
                  onClick={handleToggleFavorite}
                  variant={isFavorite ? "secondary" : "outline"}
                  className={`w-full justify-start h-12 rounded-xl border-border/50 font-semibold transition-all ${isFavorite ? 'bg-primary/10 text-primary' : 'bg-background/50 hover:bg-muted/50 text-foreground'}`}
                >
                  <Heart className={isFavorite ? "fill-current" : ""} size={18} />
                  {isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                </Button>
                <Button asChild variant="outline" className="w-full justify-start h-12 rounded-xl border-border/50 bg-background/50 font-semibold transition-all hover:bg-muted/50 text-foreground">
                  <Link href="/favorit">
                    <UtensilsCrossed size={18} className="mr-2" />
                    Buka Favorit
                  </Link>
                </Button>
                <Button asChild className="w-full h-12 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all hover:shadow-md">
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