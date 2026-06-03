"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock, Building2, User } from "lucide-react";
import { toast } from "sonner";

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
      const errMsg = err.message || "Terjadi kesalahan jaringan";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Back Link */}
        <Link 
          href="/dashboard/admin-web" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke Overview
        </Link>

        <Card className="border border-border shadow-md overflow-hidden bg-card/65 backdrop-blur-md">
          <CardHeader className="border-b border-border/50 bg-muted/20">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6 text-amber-500" />
                  Pending Approvals
                </CardTitle>
                <CardDescription className="mt-1">
                  Kelola daftar pendaftaran restoran yang menunggu verifikasi Super Admin.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Memuat data persetujuan...
              </div>
            ) : error ? (
              <div className="py-8 text-center text-sm text-red-500">
                {error}
              </div>
            ) : approvals.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                Tidak ada pendaftaran restoran yang menunggu verifikasi saat ini.
              </div>
            ) : (
              <div className="grid gap-4">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/10 p-5 md:flex-row md:items-center md:justify-between transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {item.restaurant?.legalPhoto ? (
                        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.restaurant.legalPhoto} 
                            alt="Foto Legalitas" 
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => window.open(item.restaurant.legalPhoto, '_blank')}
                            title="Klik untuk memperbesar di tab baru"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          Tanpa Foto
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground text-lg flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          {item.restaurant?.name || item.name}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.name} <span className="mx-1">•</span> {item.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t border-border/50 pt-4 md:border-none md:pt-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {item.status}
                      </span>
                      <Button size="sm" variant="outline" className="shadow-sm font-medium" asChild>
                        <Link href={`/dashboard/admin-web/approvals-detail?id=${item.id}`}>Detail</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
