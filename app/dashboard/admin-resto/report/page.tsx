"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TrendingUp, Coins, ShoppingBag, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportPage() {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/revenue`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data laporan pendapatan.");
      }

      const data = await res.json();
      // Extract data robustly
      const actualData = data.data || data;
      setRevenueData(actualData);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Fallback parsers
  const totalRevenue = revenueData
    ? revenueData.totalRevenue ?? revenueData.revenue ?? revenueData.total ?? 0
    : 0;
  
  const dailyRevenue = revenueData
    ? revenueData.totalDaily ?? revenueData.dailyRevenue ?? revenueData.daily ?? 0
    : 0;

  const totalTransactions = revenueData
    ? revenueData.totalTransactions ?? revenueData.transactionsCount ?? revenueData.transactions ?? revenueData.count ?? 0
    : 0;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Laporan Pendapatan Resto
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ringkasan data keuangan dan transaksi penjualan hari ini.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchRevenue} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" asChild size="sm">
              <Link href="/dashboard/admin-resto">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Overview
              </Link>
            </Button>
          </div>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">Memuat laporan keuangan...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* Daily Revenue Card */}
            <Card className="border border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pendapatan Harian</CardTitle>
                <Coins className="h-4.5 w-4.5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {Number(dailyRevenue).toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total pemasukan hari ini</p>
              </CardContent>
            </Card>

            {/* Total Revenue Card */}
            <Card className="border border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
                <Coins className="h-4.5 w-4.5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  Rp {Number(totalRevenue).toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Akumulasi pendapatan keseluruhan</p>
              </CardContent>
            </Card>

            {/* Transactions Card */}
            <Card className="border border-border bg-card sm:col-span-2 md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Transaksi</CardTitle>
                <ShoppingBag className="h-4.5 w-4.5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalTransactions}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Pesanan selesai diproses</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
