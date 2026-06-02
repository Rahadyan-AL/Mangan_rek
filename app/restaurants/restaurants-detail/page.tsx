"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Star,
  Store,
  ChevronRight,
  Clock,
  Tag,
  Ticket,
  Percent,
  ShoppingCart,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TypingLoader } from "@/components/typing-loader";
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
  const [promos, setPromos] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [buyResult, setBuyResult] = useState<{
    id: string;
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!restaurantId) return;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) return;
      try {
        const [restoRes, menusRes, promosRes, vouchersRes] = await Promise.all([
          fetch(`${baseUrl}/api/restaurants/${restaurantId}`),
          fetch(`${baseUrl}/api/restaurants/${restaurantId}/menus`),
          fetch(`${baseUrl}/api/restaurants/${restaurantId}/promos`),
          fetch(`${baseUrl}/api/restaurants/${restaurantId}/vouchers`)
        ].map(p => p.catch(err => {
          console.error("Fetch failed:", err);
          return { ok: false } as Response;
        })));

        if (restoRes && restoRes.ok) {
          const restoData = await restoRes.json();
          const resto = restoData.data ?? restoData;
          let menus: unknown[] = [];
          if (menusRes && menusRes.ok) {
            const menusData = await menusRes.json();
            const raw = menusData.data ?? menusData;
            menus = Array.isArray(raw) ? raw : [];
          }
          setRestaurant({ ...resto, menus });
        }

        if (promosRes && promosRes.ok) {
          const promosData = await promosRes.json();
          const raw = promosData.data ?? promosData;
          const allPromos = Array.isArray(raw) ? raw : (raw?.promos || []);
          setPromos(allPromos.filter((p: any) => p.isActive));
        }

        if (vouchersRes && vouchersRes.ok) {
          const vouchersData = await vouchersRes.json();
          const raw = vouchersData.data ?? vouchersData;
          const allVouchers = Array.isArray(raw) ? raw : (raw?.vouchers || []);
          setVouchers(allVouchers.filter((v: any) => new Date(v.expiryDate) >= new Date() && v.stock > 0));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();

    // Load favorite from localStorage on mount
    if (restaurantId) {
      setIsFavorite(isFavoriteRestaurant(restaurantId));
    }

    // Get current location for distance
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomDistance(position.coords);
        },
        (error) => {
          console.warn("Location permission denied or unavailable", error);
        }
      );
    }
  }, [router, restaurantId]);

  const [customDistance, setCustomDistance] = useState<{latitude: number, longitude: number} | null>(null);

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  }

  const displayDistance = restaurant?.distanceKm 
    || restaurant?.distance 
    || (customDistance && restaurant?.latitude && restaurant?.longitude 
        ? calculateDistance(customDistance.latitude, customDistance.longitude, restaurant.latitude, restaurant.longitude) 
        : null);

  async function handleBuyVoucher(voucherId: string) {
    setBuyingId(voucherId);
    setBuyResult(null);

    try {
      const res = await fetch(`/api/vouchers/buy`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherId }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success) {
        setBuyResult({
          id: voucherId,
          success: true,
          message: json.message || "Voucher berhasil dibeli!",
        });
      } else {
        setBuyResult({
          id: voucherId,
          success: false,
          message:
            json?.message || "Gagal membeli voucher. Pastikan kamu sudah login.",
        });
      }
    } catch {
      setBuyResult({
        id: voucherId,
        success: false,
        message: "Gagal terhubung ke server.",
      });
    } finally {
      setBuyingId(null);
    }
  }

  const [isFavorite, setIsFavorite] = useState(false);

  function handleToggleFavorite() {
    if (!restaurant) return;
    try {
      toggleFavoriteRestaurant({
        id: restaurant.id,
        name: restaurant.name || restaurant.restaurantName,
        address: restaurant.address || "",
        image: restaurant.image || restaurant.legalPhoto || "",
        category: restaurant.category || restaurant.type || "Kuliner",
        description: restaurant.description || "",
        distanceKm: restaurant.distanceKm,
        rating: restaurant.rating,
        type: "RESTAURANT"
      });
      setIsFavorite(!isFavorite);
    } catch (e) {
      console.error("Failed to toggle favorite:", e);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <TypingLoader text="Memuat restoran..." />
      </div>
    );
  }
  if (!restaurant) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Restoran tidak ditemukan.</p>
        </div>
      </div>
    );
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
          </div>

          <div className="p-6 space-y-5">
            {/* Nama & kategori */}
            <div>
              {(restaurant.category || restaurant.type) && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary mb-1">
                  <Store className="h-4 w-4" />
                  <span>{restaurant.category || restaurant.type}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {restaurant.name || restaurant.restaurantName}
                  </h1>
                  <button
                    onClick={() => setIsDetailModalOpen(true)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-sm animate-pulse"
                    title="Detail Restoran"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm transition-transform hover:scale-110 active:scale-95"
                  title="Tambah ke Favorit"
                >
                  <Heart className={isFavorite ? "fill-red-500" : ""} size={22} />
                </button>
              </div>
            </div>

            {/* Badges: rating, jarak */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {restaurant.rating != null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-amber-600 font-medium">
                  <Star size={14} className="fill-amber-500" />
                  {Number(restaurant.rating || 0).toFixed(1)}
                </span>
              )}
              {displayDistance != null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1">
                  {Number(displayDistance).toFixed(1)} km
                </span>
              )}
            </div>

            {/* Deskripsi Restoran */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {restaurant.description ||
                "Bakso Malang legendaris dengan cita rasa otentik sejak 1998. Menyajikan bakso urat, bakso halus, siomay, tahu, dan kekian khas Malang dengan kuah kaldu sapi asli yang gurih nan segar."}
            </p>

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
                  {displayDistance != null ? `${Number(displayDistance).toFixed(1)} km` : "-"}
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

        {/* Promo Untukmu Section */}
        {(promos.length > 0 || vouchers.length > 0) && (
          <div className="mb-10 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <h2 className="text-xl font-bold">Promo Untukmu</h2>
                <p className="text-xs text-muted-foreground">Diskon & voucher terbaik khusus untuk kamu di restoran ini</p>
              </div>
            </div>

            {/* Grid for Promos and Vouchers */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Promos Column */}
              {promos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Percent size={16} /> Diskon Spesial
                  </h3>
                  <div className="space-y-3">
                    {promos.map((promo) => (
                      <div
                        key={promo.id}
                        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Cutout circles for coupon effect */}
                        <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-r border-border/50" />
                        <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-l border-border/50" />

                        <div className="space-y-1 px-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-extrabold text-primary">Diskon {promo.discount}%</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${promo.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                              {promo.isActive ? "Aktif" : "Non-aktif"}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {promo.type === "ALL"
                              ? "Berlaku untuk semua menu"
                              : `Berlaku untuk ${promo.menus?.length || 0} menu pilihan`}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1.5">
                            <Clock size={10} />
                            <span>Pukul {promo.startHour} - {promo.endHour} WIB</span>
                          </div>
                        </div>

                        {promo.type === "SPECIFIC" && promo.menus && promo.menus.length > 0 && (
                          <div className="bg-muted/40 rounded-xl p-3 flex flex-col gap-2 border border-border/30">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Menu Promo:</p>
                            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                              {promo.menus.map((menu: any) => (
                                <Link
                                  key={menu.id}
                                  href={`/restaurants/menu-detail?restaurantId=${restaurantId}&menuId=${menu.id}`}
                                  className="flex items-center gap-2 bg-card border border-border/40 rounded-lg p-1.5 pr-3 shrink-0 hover:border-primary/40 transition-colors"
                                >
                                  {menu.image && (
                                    <div className="relative h-6 w-6 rounded-md overflow-hidden bg-muted">
                                      <Image src={menu.image} alt={menu.name} fill className="object-cover" />
                                    </div>
                                  )}
                                  <span className="text-[10px] font-bold text-foreground max-w-[80px] truncate">{menu.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vouchers Column */}
              {vouchers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket size={16} /> Voucher Hemat
                  </h3>
                  <div className="space-y-3">
                    {vouchers.map((voucher) => (
                      <div
                        key={voucher.id}
                        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Cutout circles for coupon effect */}
                        <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-r border-border/50" />
                        <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-l border-border/50" />

                        <div className="space-y-1 px-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-foreground truncate max-w-[70%]">{voucher.title}</h4>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                              Hemat Rp{(voucher.value - voucher.price).toLocaleString("id-ID")}
                            </span>
                          </div>
                          
                          <div className="flex gap-4 pt-1 text-xs">
                            <div>
                              <p className="text-[9px] uppercase tracking-wide text-muted-foreground">Harga</p>
                              <p className="font-extrabold text-primary">Rp{voucher.price.toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wide text-muted-foreground">Nilai</p>
                              <p className="font-extrabold text-foreground">Rp{voucher.value.toLocaleString("id-ID")}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-wide text-muted-foreground">Sisa Stok</p>
                              <p className="font-bold text-foreground">{voucher.stock}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-2">
                            <Clock size={10} />
                            <span>
                              Hingga{" "}
                              {new Date(voucher.expiryDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Buy feedback message */}
                        {buyResult && buyResult.id === voucher.id && (
                          <div className={`mx-2 rounded-lg border px-3 py-1.5 text-[10px] font-semibold ${
                            buyResult.success
                              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {buyResult.message}
                          </div>
                        )}

                        <Button
                          size="sm"
                          disabled={buyingId === voucher.id}
                          onClick={() => handleBuyVoucher(voucher.id)}
                          className="w-full bg-[#00458B] hover:bg-[#00356b] text-white font-bold h-9 rounded-xl text-xs gap-1.5 transition-all"
                        >
                          {buyingId === voucher.id ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              Membeli...
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={13} />
                              Beli Voucher
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsDetailModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl transition-all duration-300 transform scale-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold">Detail Restoran</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{restaurant.name || restaurant.restaurantName}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Kategori */}
              {(restaurant.category || restaurant.type) && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Kategori Restoran</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {restaurant.category || restaurant.type}
                    </span>
                  </div>
                </div>
              )}

              {/* Jam Buka */}
              {restaurant.openingHours && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Jam Operasional</h4>
                  <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-2">
                    <div className="flex justify-between text-sm whitespace-pre-wrap">
                      <span className="font-bold text-foreground">{restaurant.openingHours}</span>
                    </div>
                    {restaurant.isOpen !== undefined && (
                      <div className={`flex items-center gap-1.5 text-xs font-medium pt-1 ${restaurant.isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                        <span className={`h-2 w-2 rounded-full ${restaurant.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span>{restaurant.isOpen ? 'Buka Sekarang' : 'Tutup Sementara'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cabang */}
              {restaurant.branches && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Daftar Cabang</h4>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-border/40 bg-card p-4 space-y-1">
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">{restaurant.branches}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Maps Mockup */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Lokasi Google Maps</h4>
                  <a
                    href={restaurant.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((restaurant.name || restaurant.restaurantName) + " " + (restaurant.address || ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                  >
                    Buka Aplikasi <ExternalLink size={12} />
                  </a>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-border/50 h-44 bg-slate-100 flex flex-col justify-end p-4">
                  {/* Styled Map Background Representation */}
                  <div className="absolute inset-0 bg-sky-100 flex items-center justify-center overflow-hidden">
                    <svg className="absolute w-[200%] h-[200%] text-sky-200/50 stroke-white stroke-[3px]" viewBox="0 0 100 100">
                      <line x1="0" y1="20" x2="100" y2="20" />
                      <line x1="0" y1="50" x2="100" y2="50" />
                      <line x1="0" y1="80" x2="100" y2="80" />
                      <line x1="30" y1="0" x2="30" y2="100" />
                      <line x1="70" y1="0" x2="70" y2="100" />
                      <circle cx="50" cy="50" r="10" fill="rgba(14,165,233,0.15)" stroke="none" />
                    </svg>
                    <div className="relative flex flex-col items-center gap-1 bg-background/95 shadow-lg rounded-2xl p-3 border border-border/50 text-center max-w-[80%]">
                      <div className="h-8 w-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center shadow-inner animate-bounce">
                        <MapPin size={16} className="fill-red-500" />
                      </div>
                      <p className="text-xs font-bold text-foreground line-clamp-1">{restaurant.name || restaurant.restaurantName}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{restaurant.address || "Jl. Ijen No. 10, Kota Malang"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}