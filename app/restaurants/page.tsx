import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { normalizePublicId } from "@/lib/public-restaurants";

type RestaurantItem = {
  id?: string;
  name?: string;
  address?: string;
  distanceKm?: number;
  isPromoActive?: boolean;
  discountDisplay?: number;
  image?: string;
  category?: string;
};

const fallbackRestaurants: RestaurantItem[] = [
  {
    name: "Bakso President",
    address: "Jl. Batanghari No.5",
    distanceKm: 1.2,
    isPromoActive: true,
    discountDisplay: 15,
    image: "/image/makanan/bakso.jpg",
    category: "Bakso",
  },
  {
    name: "Rawon Nguling",
    address: "Jl. Zainul Arifin No.62",
    distanceKm: 2.4,
    isPromoActive: true,
    discountDisplay: 10,
    image: "/image/makanan/soto.jpg",
    category: "Rawon",
  },
  {
    name: "Hot Cwie Mie Malang",
    address: "Jl. Kawi No.20",
    distanceKm: 0.8,
    isPromoActive: true,
    discountDisplay: 20,
    image: "/image/makanan/mie-goreng.jpg",
    category: "Cwie Mie",
  },
  {
    name: "Sate Gebug",
    address: "Jl. Basuki Rahmat",
    distanceKm: 1.5,
    isPromoActive: true,
    discountDisplay: 12,
    image: "/image/makanan/Sate-Ayam.jpg",
    category: "Sate",
  },
  {
    name: "Sego Empok Wakoel",
    address: "Pasar Besar",
    distanceKm: 3.1,
    isPromoActive: true,
    discountDisplay: 8,
    image: "/image/makanan/nasi-goreng.jpg",
    category: "Nasi",
  },
  {
    name: "Onde-Onde Agrin",
    address: "Jl. Tidar",
    distanceKm: 4,
    isPromoActive: true,
    discountDisplay: 5,
    image: "/image/makanan/pecel.jpg",
    category: "Jajanan",
  },
];

async function getRestaurants(): Promise<RestaurantItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) return fallbackRestaurants;

  try {
    const response = await fetch(
      `${baseUrl}/api/restaurants?page=1&limit=10&lat=-7.9666&lng=112.6326&sort=terdekat`,
      { cache: "no-store" }
    );

    if (!response.ok) return fallbackRestaurants;

    const data = await response.json().catch(() => null);
    const restaurants =
      data?.data ?? data?.restaurants ?? data?.items ?? data?.results ?? [];

    if (!Array.isArray(restaurants) || restaurants.length === 0) {
      return fallbackRestaurants;
    }

    return restaurants.map((item: Record<string, unknown>) => ({
      id: typeof item.id === "string" ? item.id : undefined,
      name:
        typeof item.name === "string"
          ? item.name
          : typeof item.restaurantName === "string"
            ? item.restaurantName
            : "Nama restoran",
      address:
        typeof item.address === "string"
          ? item.address
          : typeof item.location === "string"
            ? item.location
            : "Alamat belum tersedia",
      distanceKm:
        typeof item.distanceKm === "number"
          ? item.distanceKm
          : typeof item.distance === "number"
            ? item.distance
            : undefined,
      isPromoActive:
        typeof item.isPromoActive === "boolean" ? item.isPromoActive : false,
      discountDisplay:
        typeof item.discountDisplay === "number"
          ? item.discountDisplay
          : typeof item.discount === "number"
            ? item.discount
            : undefined,
      image:
        typeof item.image === "string"
          ? item.image
          : "/image/makanan/bakso.jpg",
      category:
        typeof item.category === "string"
          ? item.category
          : typeof item.type === "string"
            ? item.type
            : "Kuliner",
    }));
  } catch {
    return fallbackRestaurants;
  }
}

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Semua Restoran
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
              Jelajahi daftar restoran terdekat di Malang berdasarkan jarak,
              promo aktif, dan kategori kuliner.
            </p>
          </div>
          <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm md:w-105">
            <span className="text-muted-foreground">🔍</span>
            <Input
              className="border-none bg-transparent shadow-none focus-visible:ring-0"
              placeholder="Cari nama restoran..."
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant, index) => (
            <article
              key={restaurant.id ?? `${restaurant.name}-${index}`}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={restaurant.image ?? "/image/makanan/bakso.jpg"}
                  alt={restaurant.name ?? "Restaurant image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">
                      {restaurant.name ?? "Nama restoran"}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {restaurant.address ?? "Alamat belum tersedia"}
                    </p>
                  </div>
                  {restaurant.isPromoActive ? (
                    <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary">
                      Promo Aktif
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{restaurant.category ?? "Kuliner"}</span>
                  <span>
                    {typeof restaurant.distanceKm === "number"
                      ? `${restaurant.distanceKm.toFixed(1)} km`
                      : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-xs">
                  <span className="font-medium text-foreground">
                    Diskon {restaurant.discountDisplay ?? 0}%
                  </span>
                  <Link
                    href={`/restaurants/restaurants-detail?restaurantId=${normalizePublicId(
                      restaurant.id ?? restaurant.name ?? "restaurant"
                    )}`}
                    className="text-primary hover:underline"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}