import Image from "next/image";
import Link from "next/link";

import { SearchInput } from "@/components/search-input";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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

async function getRestaurants(page: number, search: string): Promise<{ data: RestaurantItem[], pagination: { page: number, totalPages: number, total: number, limit: number } }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const defaultPagination = { page: 1, totalPages: 1, total: 0, limit: 10 };

  if (!baseUrl) return { data: fallbackRestaurants, pagination: defaultPagination };

  try {
    const response = await fetch(
      `${baseUrl}/api/restaurants?page=${page}&limit=10&search=${encodeURIComponent(search)}`,
      { cache: "no-store" }
    );

    if (!response.ok) return { data: fallbackRestaurants, pagination: defaultPagination };

    const data = await response.json().catch(() => null);
    const restaurants =
      data?.data?.restaurants ?? data?.data ?? data?.restaurants ?? data?.items ?? data?.results ?? [];
    
    const pagination = data?.data?.pagination ?? defaultPagination;

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
        typeof item.legalPhoto === "string"
          ? item.legalPhoto
          : typeof item.image === "string"
          ? item.image
          : "/image/makanan/bakso.jpg",
      category:
        typeof item.category === "string"
          ? item.category
          : typeof item.type === "string"
            ? item.type
            : "Kuliner",
    }));
    return { data: parsedRestaurants, pagination };
  } catch {
    return { data: fallbackRestaurants, pagination: { page: 1, totalPages: 1, total: 0, limit: 10 } };
  }
}

export default async function RestaurantsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams?.search === "string" ? resolvedParams.search : "";
  const pageParam = typeof resolvedParams?.page === "string" ? resolvedParams.page : "1";
  const page = parseInt(pageParam, 10) || 1;

  const { data: restaurants, pagination } = await getRestaurants(page, search);

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
          <div className="w-full md:w-auto">
            <SearchInput defaultValue={search} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.length > 0 ? restaurants.map((restaurant, index) => (
            <Link
              key={restaurant.id ?? `${restaurant.name}-${index}`}
              href={`/restaurants/restaurants-detail?restaurantId=${normalizePublicId(
                restaurant.id ?? restaurant.name ?? "restaurant"
              )}`}
              className="group block"
            >
              <article className="overflow-hidden rounded-[1.5rem] border border-border/50 bg-card/80 backdrop-blur-md shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/30">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={restaurant.image ?? "/image/makanan/bakso.jpg"}
                    alt={restaurant.name ?? "Restaurant image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {restaurant.name ?? "Nama restoran"}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {restaurant.address ?? "Alamat belum tersedia"}
                      </p>
                    </div>
                  </div>
                  
                  {restaurant.isPromoActive && (
                    <div className="inline-flex rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-600">
                      Promo Aktif
                    </div>
                  )}

                  {restaurant.discountDisplay ? (
                    <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-transparent px-4 py-2.5 text-xs">
                      <span className="font-semibold text-primary">
                        Diskon {restaurant.discountDisplay}%
                      </span>
                      <span className="text-primary font-medium group-hover:underline">Lihat Menu →</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5 text-xs transition-colors group-hover:bg-primary/5">
                      <span className="font-medium text-foreground">Menu & Detail</span>
                      <span className="text-primary font-medium group-hover:underline">Lihat →</span>
                    </div>
                  )}
                </div>
              </article>
            </Link>
          )) : (
            <p className="text-sm text-muted-foreground col-span-3 text-center py-10">Belum tersedia</p>
          )}
        </div>

        {pagination.total > 0 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              asChild={page > 1}
              className="h-8 w-8"
            >
              {page > 1 ? (
                <Link href={`/restaurants?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="h-4 w-4" />
                </span>
              )}
            </Button>
            
            <span className="text-xs font-medium text-muted-foreground px-2">
              {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              disabled={page * pagination.limit >= pagination.total}
              asChild={page * pagination.limit < pagination.total}
              className="h-8 w-8"
            >
              {page * pagination.limit < pagination.total ? (
                <Link href={`/restaurants?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}