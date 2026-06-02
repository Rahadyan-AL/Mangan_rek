"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  FavoriteRestaurant,
  readFavoriteRestaurants,
  removeFavoriteRestaurant,
} from "@/lib/local-favorites";

export default function Page() {
  const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setFavorites(readFavoriteRestaurants());
  }, []);

  function handleRemoveFavorite(restaurantId: string) {
    const nextFavorites = removeFavoriteRestaurant(restaurantId);
    setFavorites(nextFavorites);
  }

  if (!isMounted) {
    return <main className="min-h-screen bg-background" />;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 text-foreground">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Favorit
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Simpan restoran atau menu yang paling kamu suka agar mudah dibuka kembali dari daftar favorit.
        </p>
      </div>

        <Button asChild className="w-fit bg-[#00458B] text-white hover:bg-[#00356b]">
          <Link href="/restaurants">Jelajahi</Link>
        </Button>
      </div>

      {favorites.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative h-44 w-full">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(item.id)}
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-red-500 shadow-sm backdrop-blur"
                  aria-label={`Hapus ${item.name} dari favorit`}
                >
                  <Heart className="fill-current" size={18} />
                </button>
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">{item.name}</h2>
                    <p className="text-xs text-muted-foreground">{item.address}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-foreground">
                    {item.category}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={
                    item.type === "MENU"
                      ? `/restaurants/menu-detail?restaurantId=${item.restaurantId}&menuId=${item.id}`
                      : `/restaurants/restaurants-detail?restaurantId=${item.id}`
                  }>
                    Buka Detail
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="fill-current" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">Belum ada favorit</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Simpan restoran atau menu dari halaman detail untuk menampilkannya di sini.
          </p>
          <Button asChild className="mt-6 bg-[#00458B] text-white hover:bg-[#00356b]">
            <Link href="/restaurants">Jelajahi</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
