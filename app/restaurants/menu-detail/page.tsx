"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShoppingBag, MapPin, Store, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TypingLoader } from "@/components/typing-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isFavoriteRestaurant, toggleFavoriteRestaurant } from "@/lib/local-favorites";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const menuId = searchParams.get("menuId");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [restaurant, setRestaurant] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeMenu, setActiveMenu] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteMenu, setIsFavoriteMenu] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!restaurantId) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      try {
        const [restoRes, menuRes] = await Promise.all([
          fetch(`${baseUrl}/api/restaurants/${restaurantId}`),
          fetch(menuId ? `${baseUrl}/api/restaurants/${restaurantId}/menus/${menuId}` : `${baseUrl}/api/restaurants/${restaurantId}/menus`)
        ]);

        if (restoRes.ok && menuRes.ok) {
          const restoData = await restoRes.json();
          const menuData = await menuRes.json();
          
          setRestaurant(restoData.data || restoData);
          
          if (menuId) {
             setActiveMenu(menuData.data || menuData);
          } else {
             const menusArray = menuData.data || menuData || [];
             setActiveMenu(menusArray[0] || null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [restaurantId, menuId]);

  useEffect(() => {
    if (activeMenu?.id) {
      setIsFavoriteMenu(isFavoriteRestaurant(activeMenu.id));
    }
  }, [activeMenu?.id]);

  function handleToggleFavoriteMenu() {
    if (!activeMenu?.id || !restaurant?.id) return;
    try {
      toggleFavoriteRestaurant({
        id: activeMenu.id,
        name: activeMenu.name,
        address: restaurant.name || restaurant.restaurantName || "Lokasi belum tersedia",
        image: activeMenu.image || "",
        category: "Menu",
        description: activeMenu.description || "",
        type: "MENU",
        restaurantId: restaurant.id,
      });
      setIsFavoriteMenu(!isFavoriteMenu);
    } catch (e) {
      console.error("Failed to toggle favorite menu:", e);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <TypingLoader text="Memuat menu..." />
      </div>
    );
  }

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

        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-xl shadow-lg transition-all hover:shadow-xl">
            <div className="relative h-[28rem] w-full">
              <Image src={activeMenu.image} alt={activeMenu.name} fill className="object-cover" />
            </div>
            <div className="space-y-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    <Store className="h-4 w-4" />
                    <span>{restaurant.name || restaurant.restaurantName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{activeMenu.name}</h1>
                      {activeMenu.isAvailable ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-green-200 border rounded-full px-3">Tersedia</Badge>
                      ) : (
                        <Badge variant="destructive" className="shadow-none rounded-full px-3">Habis</Badge>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleFavoriteMenu}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm transition-transform hover:scale-110 active:scale-95"
                      title="Tambah ke Favorit"
                    >
                      <Heart className={isFavoriteMenu ? "fill-red-500" : ""} size={22} />
                    </button>
                  </div>
                  <div className="flex items-start gap-1.5 text-sm text-muted-foreground pb-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 max-w-md">{restaurant.address || restaurant.location || "Lokasi belum tersedia"}</span>
                  </div>
                  
                  {/* Modern Price Section (Shopee inspired) */}
                  <div className="mt-2 flex flex-col justify-center rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-4 border border-primary/20">
                    <div className="text-xs font-semibold uppercase tracking-[0.1em] text-primary/70 mb-1">Harga</div>
                    <div className="flex items-end gap-3">
                      {activeMenu.discountedPrice ? (
                        <>
                          <div className="text-3xl font-bold text-primary">
                            Rp {Number(activeMenu.discountedPrice).toLocaleString("id-ID")}
                          </div>
                          <div className="flex items-center gap-2 pb-1.5">
                            <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-sm">
                              {activeMenu.discountPercentage}% OFF
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              Rp {Number(activeMenu.price || 0).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-primary">
                          Rp {Number(activeMenu.price || 0).toLocaleString("id-ID")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                {activeMenu.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold">Informasi Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground pt-5">
                <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
                  <span>Restoran</span>
                  <span className="font-medium text-foreground">{restaurant.name || restaurant.restaurantName}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3 hover:bg-muted transition-colors">
                  <span className="shrink-0 text-muted-foreground">Lokasi</span>
                  <span className="font-medium text-foreground text-right line-clamp-2">{restaurant.address || restaurant.location || "-"}</span>
                </div>
                <div className="flex flex-col gap-1.5 rounded-xl bg-muted/50 px-4 py-3 hover:bg-muted transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="shrink-0 text-muted-foreground">Harga</span>
                    {activeMenu.discountedPrice ? (
                      <span className="font-bold text-primary">
                        Rp {Number(activeMenu.discountedPrice).toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="font-medium text-foreground">
                        Rp {Number(activeMenu.price || 0).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                  {activeMenu.discountedPrice ? (
                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="font-semibold text-red-500">Hemat {activeMenu.discountPercentage}%</span>
                      <span className="text-muted-foreground line-through">
                        Rp {Number(activeMenu.price || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-md bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-bold">Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                <Button className="w-full bg-[#00458B] text-white hover:bg-[#00356b] shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 h-12 rounded-xl text-base font-bold">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Beli Sekarang
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="w-full h-12 rounded-xl border-primary/30 text-primary hover:bg-primary/5 transition-all font-medium">
                    <Link href={`/restaurants/restaurants-detail?restaurantId=${restaurant.id}`}>
                      <Store className="mr-2 h-4 w-4" />
                      Kunjungi Resto
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50 transition-all text-foreground font-medium">
                    <Link href="/promo">Cari Promo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}