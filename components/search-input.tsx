"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (query === currentSearch) {
        return;
      }

      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
        params.delete("page"); // reset to page 1 on new search
      } else {
        params.delete("search");
        params.delete("page");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query, pathname, router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
      params.delete("page");
    } else {
      params.delete("search");
      params.delete("page");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 flex w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
      <span className="text-muted-foreground">🔍</span>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-none bg-transparent shadow-none focus-visible:ring-0"
        placeholder="Cari Bakso, Rawon, Cwie Mie..."
      />
      <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
        Cari
      </Button>
    </form>
  );
}
