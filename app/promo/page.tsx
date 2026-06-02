import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const promos = [
  {
    title: "Lunch Combo 20%",
    restaurant: "Bakso President",
    description: "Berlaku untuk pembelian makan siang pada jam 11.00 - 14.00.",
    price: "Gratis dengan order tertentu",
    badge: "Aktif",
  },
  {
    title: "Weekend Dessert Deal",
    restaurant: "Toko Oen",
    description: "Diskon dessert dan minuman untuk weekend family time.",
    price: "Voucher hemat Rp15.000",
    badge: "Populer",
  },
  {
    title: "Travel Friendly Voucher",
    restaurant: "Sego Empok Wakoel",
    description: "Cocok untuk user yang sedang menyusun itinerary kuliner.",
    price: "Potongan 10%",
    badge: "Baru",
  },
  {
    title: "Evening Snack Promo",
    restaurant: "Sate Gebug",
    description: "Promo makan malam yang bisa dipakai setelah jam 17.00.",
    price: "Diskon Rp20.000",
    badge: "Aktif",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Promo Untuk User
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Kumpulan promo yang bisa langsung dipakai.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Halaman ini berisi promo dari restoran yang dapat digunakan user
              untuk mendapatkan potongan harga, voucher hemat, atau penawaran
              khusus saat menjelajah kuliner Malang.
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
                <p className="text-sm font-semibold">Promo Terbaru</p>
                <p className="text-xs text-muted-foreground">Selalu update tiap minggu</p>
              </div>
            </div>
            <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Lihat Voucher
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {promos.map((promo) => (
            <Card key={promo.title} className="overflow-hidden border border-border">
              <CardHeader className="space-y-2 border-b border-border/60 bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{promo.title}</CardTitle>
                    <CardDescription className="mt-1">{promo.restaurant}</CardDescription>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {promo.badge}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <p className="text-sm leading-6 text-muted-foreground">
                  {promo.description}
                </p>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-muted px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Benefit
                    </p>
                    <p className="text-sm font-semibold text-foreground">{promo.price}</p>
                  </div>
                  <Button size="sm" className="bg-[#00458B] text-white hover:bg-[#00356b]">
                    Pakai Promo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Cara pakai promo</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Pilih promo yang sesuai, buka detail restoran, lalu gunakan saat
                order atau saat check-in ke resto.
              </p>
            </div>
            <Link href="/restaurants" className="text-sm font-medium text-primary hover:underline">
              Lihat restoran yang aktif promo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
