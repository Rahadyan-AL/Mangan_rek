"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, MapPin, Star, UtensilsCrossed } from "lucide-react";

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
import {
  findPublicRestaurant,
  publicRestaurants,
} from "@/lib/public-restaurants";

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

  const restaurant = useMemo(() => {
    const matchedRestaurant = findPublicRestaurant(restaurantId);
    if (matchedRestaurant) {
      return matchedRestaurant;
    }

    return publicRestaurants[0];
  }, [restaurantId]);

  useEffect(() => {
    const cookieRole = normalizeRole(readCookieValue(ROLE_COOKIE_NAME));
    if (!cookieRole) {
      router.replace("/login");
    }
    // no synchronous setState here; favorites are derived below
  }, [router, restaurant.id]);

  function handleToggleFavorite() {
    const cookieRole = normalizeRole(readCookieValue(ROLE_COOKIE_NAME));
    if (!cookieRole) {
      router.push("/login");
      return;
    }

    toggleFavoriteRestaurant({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      image: restaurant.image,
      category: restaurant.category,
      description: restaurant.description,
      distanceKm: restaurant.distanceKm,
      rating: restaurant.rating,
    });
    // force recompute derived favorite state
    setTick((t) => t + 1);
  }

  const isFavorite = isFavoriteRestaurant(restaurant.id);

  // no explicit loading state; redirect will happen if not authorized

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: "linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)), hsl(var(--muted) / 0.3))",
      }}
    >
      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="relative h-80 w-full">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  priority
                />
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur"
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
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-primary">{restaurant.category}</p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
                      {restaurant.name}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={16} />
                        {restaurant.address}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star size={16} className="text-amber-500" />
                        {restaurant.rating.toFixed(1)}
                      </span>
                      <span>{restaurant.distanceKm.toFixed(1)} km</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-primary/70">
                      Promo Aktif
                    </div>
                    <div className="text-lg font-semibold text-primary">
                      {restaurant.promoLabel}
                    </div>
                  </div>
                </div>

                <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                  {restaurant.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button className="bg-[#00458B] text-white hover:bg-[#00356b]">
                    Pesan Sekarang
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/restaurants/menu-detail?restaurantId=${restaurant.id}`}>
                      Lihat Menu
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Menu Rekomendasi</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {restaurant.menus.map((menu) => (
                  <Link
                    key={menu.id}
                    href={`/restaurants/menu-detail?restaurantId=${restaurant.id}&menuId=${menu.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-40 w-full">
                      <Image src={menu.image} alt={menu.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-semibold group-hover:text-primary">
                          {menu.name}
                        </h3>
                        <span className="text-sm font-semibold text-primary">
                          Rp {menu.price.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{menu.description}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Informasi Singkat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Status</span>
                  <span className="font-medium text-foreground">
                    {restaurant.isOpen ? "Buka" : "Tutup"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Kategori</span>
                  <span className="font-medium text-foreground">{restaurant.category}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Jarak</span>
                  <span className="font-medium text-foreground">
                    {restaurant.distanceKm.toFixed(1)} km
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleToggleFavorite}
                  variant={isFavorite ? "secondary" : "outline"}
                  className="w-full justify-start"
                >
                  <Heart className={isFavorite ? "fill-current" : ""} />
                  {isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/favorit">
                    <UtensilsCrossed />
                    Buka Favorit
                  </Link>
                </Button>
                <Button asChild className="w-full bg-[#00458B] text-white hover:bg-[#00356b]">
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