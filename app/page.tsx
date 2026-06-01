import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const recommendations = [
  {
    name: "Bakso President",
    location: "Jl. Batanghari No.5 · 1.2km",
    image: "/image/makanan/bakso.jpg",
    promo: true,
  },
  {
    name: "Rawon Nguling",
    location: "Jl. Zainul Arifin No.62 · 2.4km",
    image: "/image/makanan/soto.jpg",
    promo: true,
  },
  {
    name: "Hot Cwie Mie Malang",
    location: "Jl. Kawi No.20 · 0.8km",
    image: "/image/makanan/mie-goreng.jpg",
    promo: true,
  },
  {
    name: "Sate Gebug",
    location: "Jl. Basuki Rahmat · 1.5km",
    image: "/image/makanan/Sate-Ayam.jpg",
    promo: true,
  },
  {
    name: "Sego Empok Wakoel",
    location: "Pasar Besar · 3.1km",
    image: "/image/makanan/nasi-goreng.jpg",
    promo: true,
  },
  {
    name: "Onde-Onde Agrin",
    location: "Jl. Tidar · 4.0km",
    image: "/image/makanan/pecel.jpg",
    promo: true,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Jelajahi Cita Rasa Malang
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Temukan warisan kuliner otentik Malang. Mulai dari bakso, cwimie,
          rawon dan masih banyak lagi. Jelajahi semua rekomendasi pilihan oleh
          arek Malang.
        </p>
        <div className="mx-auto mt-8 flex w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
          <span className="text-muted-foreground">🔍</span>
          <Input
            className="border-none bg-transparent shadow-none focus-visible:ring-0"
            placeholder="Cari Bakso, Rawon, Cwie Mie..."
          />
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Cari
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Rekomendasi Kuliner</h2>
            <p className="text-sm text-muted-foreground">
              Spot kuliner terpopuler di Malang yang wajib dicoba.
            </p>
          </div>
          <Link href="/restaurants" className="text-sm text-primary hover:underline">
            Lihat Semua →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((item) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  {item.promo ? (
                    <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary">
                      Promo Aktif
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">{item.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
