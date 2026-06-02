"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, MapPin, Star, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      try {
        const [restoRes, menusRes] = await Promise.all([
          fetch(`${baseUrl}/api/restaurants/${restaurantId}`),
          fetch(`${baseUrl}/api/restaurants/${restaurantId}/menus`)
        ]);

        if (restoRes.ok) {
          const restoData = await restoRes.json();
          const resto = restoData.data ?? restoData;
          let menus: unknown[] = [];
          if (menusRes.ok) {
            const menusData = await menusRes.json();
            const raw = menusData.data ?? menusData;
            menus = Array.isArray(raw) ? raw : [];
          }
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
      image: restaurant.legalPhoto || restaurant.image || null,
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
      <section className="mx-auto w-full max-w-4xl px-6 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-8 rounded-full px-5 hover:bg-muted/50 transition-colors shadow-sm bg-background/50 backdrop-blur-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        {/* Main info card */}
        <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg mb-8">
          <div className="relative h-80 w-full">
            {restaurant.legalPhoto || restaurant.image ? (
              <Image
                src={restaurant.legalPhoto || restaurant.image}
                alt={restaurant.name || "Restaurant"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">Tidak ada foto</div>
            )}
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

          <div className="p-6 space-y-5">
            {/* Nama & kategori */}
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1">
                <Store className="h-4 w-4" />
                <span>{restaurant.owner?.name || restaurant.category || restaurant.type || "Kuliner"}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {restaurant.name || restaurant.restaurantName}
              </h1>
            </div>

            {/* Badges: alamat, rating, jarak */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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

            {/* Info singkat: Status & Jarak (inline row) */}
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5 gap-6 hover:bg-muted transition-colors">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-foreground">
                  {restaurant.isOpen === true ? "Buka" : restaurant.isOpen === false ? "Tutup" : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5 gap-6 hover:bg-muted transition-colors">
                <span className="text-muted-foreground">Jarak</span>
                <span className="font-medium text-foreground">
                  {restaurant.distanceKm != null ? `${Number(restaurant.distanceKm || restaurant.distance || 0).toFixed(1)} km` : "-"}
                </span>
              </div>
              {restaurant.promoLabel && (
                <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-2.5 gap-6 border border-primary/20">
                  <span className="text-primary/70 font-semibold uppercase tracking-wide text-xs">Promo</span>
                  <span className="font-bold text-primary">{restaurant.promoLabel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Semua menu */}
        <div>
          <h2 className="text-xl font-bold mb-5">Menu</h2>
          {restaurant.menus && restaurant.menus.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {restaurant.menus.map((menu: any) => (
                <Link
                  key={menu.id}
                  href={`/restaurants/menu-detail?restaurantId=${restaurant.id}&menuId=${menu.id}`}
                  className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/80 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    {menu.image ? (
                      <Image src={menu.image} alt={menu.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">Tidak ada foto</div>
                    )}
                    {menu.discountedPrice && (
                      <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                        Promo
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <h3 className="text-base font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {menu.name}
                    </h3>
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
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-[1.5rem] border border-border/50 bg-muted/20">
              <p className="text-sm text-muted-foreground">Belum ada menu untuk restoran ini.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}