import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PromoTabs } from "./promo-tabs";

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

// ==================== SERVER FETCH ====================

async function getPromos(): Promise<Promo[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/api/restaurants/all-promos`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json().catch(() => null);
    const allPromos: Promo[] = json?.data?.promos ?? [];
    return allPromos;
  } catch {
    return [];
  }
}

async function getVouchers(): Promise<Voucher[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return [];
  try {
    const res = await fetch(`${baseUrl}/api/restaurants/all-vouchers`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json().catch(() => null);
    return json?.data?.vouchers ?? [];
  } catch {
    return [];
  }
}

// ==================== PAGE ====================

export default async function Page() {
  const [promos, vouchers] = await Promise.all([getPromos(), getVouchers()]);
  const activePromoCount = promos.length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Promo &amp; Voucher
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Hemat lebih banyak setiap kunjungan.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Temukan promo diskon dan voucher spesial dari berbagai restoran di
              Malang. Gunakan langsung saat makan atau simpan untuk nanti!
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:min-w-72">
            <div className="flex items-center gap-3">
              <Image
                src="/image/Mangan_Rek_logo-Photoroom.png"
                alt="Mangan Rek Logo"
                width={120}
                height={34}
                className="h-9 w-auto"
              />
              <div>
                <p className="text-sm font-semibold">Penawaran Terbaru</p>
                <p className="text-xs text-muted-foreground">
                  {promos.length + vouchers.length} penawaran tersedia
                </p>
              </div>
            </div>
            <Button
              asChild
              className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/restaurants">Jelajahi Restoran</Link>
            </Button>
          </div>
        </div>

        {/* Tabs + Content (client component for interactivity) */}
        <PromoTabs promos={promos} vouchers={vouchers} />

        {/* CTA Footer */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Cara pakai promo &amp; voucher</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pilih promo atau voucher yang sesuai, buka detail restoran, lalu
                gunakan saat order atau saat check-in ke resto.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
