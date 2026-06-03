"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Ticket,
  Clock,
  MapPin,
  Percent,
  Utensils,
  ShoppingCart,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ==================== TYPES ====================

interface VoucherRestaurant {
  id: string;
  name: string;
  address: string;
}

interface Voucher {
  id: string;
  title: string;
  price: number;
  value: number;
  stock: number;
  expiryDate: string;
  restaurant: VoucherRestaurant;
}

interface PromoMenu {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

interface PromoRestaurant {
  id: string;
  name: string;
  address: string;
}

interface Promo {
  id: string;
  restaurantId: string;
  discount: number;
  startHour: string;
  endHour: string;
  type: "ALL" | "SPECIFIC";
  isActive: boolean;
  menus: PromoMenu[];
  restaurant: PromoRestaurant;
}

// ==================== COMPONENT ====================

export function PromoTabs({
  promos,
  vouchers,
}: {
  promos: Promo[];
  vouchers: Voucher[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"promo" | "voucher">("promo");
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [buyResult, setBuyResult] = useState<{
    id: string;
    success: boolean;
    message: string;
    paymentUrl?: string;
  } | null>(null);

  const activeVouchers = vouchers.filter(
    (v) => new Date(v.expiryDate) >= new Date() && v.stock > 0
  );

  async function handleBuyVoucher(voucherId: string) {
    setBuyingId(voucherId);
    setBuyResult(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/api/vouchers/buy`, {
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
          paymentUrl: json.data?.paymentUrl,
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

  return (
    <>
      {/* Tabs */}
      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("promo")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
            activeTab === "promo"
              ? "bg-[#00458B] text-white shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Percent size={16} />
          Promo Diskon
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              activeTab === "promo"
                ? "bg-white/20 text-white"
                : "bg-background text-foreground"
            }`}
          >
            {promos.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("voucher")}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
            activeTab === "voucher"
              ? "bg-[#00458B] text-white shadow-md"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Ticket size={16} />
          Voucher
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              activeTab === "voucher"
                ? "bg-white/20 text-white"
                : "bg-background text-foreground"
            }`}
          >
            {vouchers.length}
          </span>
        </button>
      </div>

      {/* ==================== PROMO TAB ==================== */}
      {activeTab === "promo" && (
        <div className="mt-6">
          {promos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Tag size={24} />
              </div>
              <h2 className="mt-5 text-xl font-semibold">Belum ada promo aktif</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Saat ini belum ada promo yang sedang aktif. Cek kembali nanti!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {promos.map((promo) => (
                <Card
                  key={promo.id}
                  className="overflow-hidden border border-border transition-shadow hover:shadow-md"
                >
                  <CardHeader className="space-y-2 border-b border-border/60 bg-muted/30">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">
                          Diskon {promo.discount}%
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1.5">
                          <Utensils size={13} />
                          {promo.restaurant.name}
                        </CardDescription>
                      </div>
                      {promo.isActive ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Aktif
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Tidak Aktif
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} />
                        {promo.startHour} – {promo.endHour}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} />
                        {promo.restaurant.address}
                      </span>
                    </div>

                    {promo.type === "SPECIFIC" && promo.menus.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Menu yang berlaku
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {promo.menus.map((menu) => (
                            <Link
                              key={menu.id}
                              href={`/restaurants/menu-detail?restaurantId=${promo.restaurant.id}&menuId=${menu.id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              {menu.image && (
                                <Image
                                  src={menu.image}
                                  alt={menu.name}
                                  width={16}
                                  height={16}
                                  className="h-4 w-4 rounded-full object-cover"
                                />
                              )}
                              {menu.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {promo.type === "ALL" && (
                      <p className="text-xs text-muted-foreground italic">
                        Berlaku untuk semua menu di restoran ini
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-4 rounded-xl bg-muted px-4 py-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Potongan
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {promo.discount}% dari harga menu
                        </p>
                      </div>
                      <Button
                        size="sm"
                        asChild
                        className="bg-[#00458B] text-white hover:bg-[#00356b]"
                      >
                        <Link
                          href={`/restaurants/restaurants-detail?restaurantId=${promo.restaurant.id}`}
                        >
                          Lihat Resto
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== VOUCHER TAB ==================== */}
      {activeTab === "voucher" && (
        <div className="mt-6">
          {activeVouchers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Ticket size={24} />
              </div>
              <h2 className="mt-5 text-xl font-semibold">Belum ada voucher aktif</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Saat ini belum ada voucher aktif yang tersedia. Cek kembali nanti!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Cutout circles for coupon effect */}
                  <div className="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-r border-border/50" />
                  <div className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background border-l border-border/50" />

                  <div className="space-y-1 px-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1 pr-3">
                        <h4 className="text-base font-bold text-foreground truncate">{voucher.title}</h4>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Utensils size={12} />
                          <span className="truncate">{voucher.restaurant.name}</span>
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600">
                        Hemat Rp{(voucher.value - voucher.price).toLocaleString("id-ID")}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 pt-3 text-xs">
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
                    
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-3">
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

                  {buyResult && buyResult.id === voucher.id && !buyResult.success && (
                    <div className="mx-2 rounded-lg border px-3 py-3 text-xs font-semibold flex flex-col gap-3 border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <p className="text-center">{buyResult.message}</p>
                    </div>
                  )}

                  <div className="flex gap-2 px-2 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-1 rounded-xl h-9 text-xs"
                    >
                      <Link
                        href={`/restaurants/restaurants-detail?restaurantId=${voucher.restaurant.id}`}
                      >
                        Lihat Resto
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      disabled={buyingId === voucher.id}
                      onClick={() => handleBuyVoucher(voucher.id)}
                      className="flex-1 bg-[#00458B] hover:bg-[#00356b] text-white font-bold h-9 rounded-xl text-xs gap-1.5 transition-all"
                    >
                      {buyingId === voucher.id ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Membeli...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} />
                          Beli
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* QR Payment Modal */}
      {buyResult && buyResult.success && buyResult.paymentUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setBuyResult(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl flex flex-col items-center gap-4 text-slate-900">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="text-lg font-bold">Voucher Berhasil Dipesan!</h3>
            </div>
            
            <p className="text-center text-sm text-slate-500">
              Silakan scan QRIS di bawah ini dengan aplikasi M-Banking atau e-Wallet Anda untuk menyelesaikan pembayaran.
            </p>
            
            <div className="rounded-xl border-2 border-primary/20 p-4 shadow-sm bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(buyResult.paymentUrl)}`} 
                alt="QRIS Code" 
                width={200}
                height={200}
                className="rounded-md mx-auto"
              />
            </div>
            
            <p className="text-xs text-center text-slate-500 max-w-[250px] mx-auto mt-2">
              Status pembayaran akan diperbarui otomatis di menu <span className="font-semibold text-slate-700">Profil &gt; Histori Pembelian</span>.
            </p>
            
            <Button
              className="mt-4 w-full bg-[#00458B] text-white hover:bg-[#003a76] font-semibold"
              onClick={() => {
                setBuyResult(null);
                router.push("/profile");
              }}
            >
              Cek Histori Saya
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-700"
              onClick={() => setBuyResult(null)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
