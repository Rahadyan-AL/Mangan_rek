import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/search-input";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams?.search === "string" ? resolvedParams.search : "";
  const pageParam = typeof resolvedParams?.page === "string" ? resolvedParams.page : "1";
  const page = parseInt(pageParam, 10) || 1;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recommendations: any[] = [];
  let pagination = { page: 1, limit: 10, total: 0 };
  
  try {
    // using sort=terdekat as per postman collection
    const res = await fetch(`${baseUrl}/api/restaurants/all-menus?page=${page}&limit=10&search=${encodeURIComponent(search)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const result = await res.json();
      recommendations = result.data?.menus || result.data?.data || result.data || result.restaurants || result || [];
      if (result.data?.pagination) {
        pagination = result.data.pagination;
      }
      if (!Array.isArray(recommendations)) {
        recommendations = [];
      }
    }
  } catch (error) {
    console.error("Fetch restaurants failed:", error);
  }
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
        <SearchInput defaultValue={search} />
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
            Lihat Semua Restoran →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {recommendations.length > 0 ? recommendations.map((item: any) => (
            <Link
              key={item.id}
              href={`/restaurants/menu-detail?restaurantId=${item.restaurant?.id || item.restaurantId}&menuId=${item.id}`}
              className="block group"
            >
              <article
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={item.image || item.legalPhoto || "/image/makanan/bakso.jpg"}
                    alt={item.name || item.restaurantName || "Restoran"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">{item.name || item.restaurantName}</h3>
                    {item.promo || item.promoLabel ? (
                      <span className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary">
                        Promo Aktif
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.restaurant?.address || item.address || item.location}</p>
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
                <Link href={`/?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>
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
                <Link href={`/?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}>
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
