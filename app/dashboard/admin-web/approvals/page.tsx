"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/approvals`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data approvals");
      }

      let items = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data.approvals)) items = data.approvals;
      else if (data.data && Array.isArray(data.data.data)) items = data.data.data;
      else if (data.data && Array.isArray(data.data.approvals)) items = data.data.approvals;

      setApprovals(items);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <Card className="border border-border">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle className="text-2xl">Pending Approvals</CardTitle>
              <CardDescription>
                Kelola daftar pendaftaran resto yang menunggu verifikasi.
              </CardDescription>
            </div>
            <Link href="/dashboard/admin-web" className="text-sm text-primary hover:underline">
              Kembali ke overview
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : approvals.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada pendaftaran yang menunggu verifikasi.</p>
            ) : (
              approvals.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    {item.restaurant?.legalPhoto ? (
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.restaurant.legalPhoto} 
                          alt="Foto Legalitas" 
                          className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => window.open(item.restaurant.legalPhoto, '_blank')}
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-[10px] text-muted-foreground">
                        Tanpa Foto
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{item.restaurant?.name || item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.name} • {item.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                      {item.status}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/admin-web/approvals-detail?id=${item.id}`}>Detail</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
