"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TrendingUp, Coins, ShoppingBag, ArrowLeft, RefreshCw, AlertCircle, History, Clock, FileText, ChevronLeft, ChevronRight, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ITEMS_PER_PAGE = 5;

export default function ReportPage() {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // View Detail
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      // Fetch Revenue
      const revRes = await fetch(`${baseUrl}/api/restaurants/revenue`, {
        credentials: "include",
      });
      if (!revRes.ok) throw new Error("Gagal mengambil data laporan pendapatan.");
      const revData = await revRes.json();
      setRevenueData(revData.data || revData);

      // Fetch History
      const histRes = await fetch(`${baseUrl}/api/restaurants/orders/history`, {
        credentials: "include",
      });
      if (!histRes.ok) throw new Error("Gagal mengambil riwayat transaksi.");
      const histData = await histRes.json();
      const resultData = histData.data || {};
      const orders = Array.isArray(resultData.orders) ? resultData.orders : [];
      const vouchers = Array.isArray(resultData.vouchers) ? resultData.vouchers : [];

      const combined = [
        ...orders.map((o: any) => ({
          id: o.id,
          createdAt: o.createdAt,
          totalAmount: o.finalAmount || o.totalAmount || 0,
          status: o.status,
          itemsCount: o.items ? o.items.length : 0,
          type: 'ORDER',
          buyerName: o.cashier?.name || 'Kasir / Pelanggan',
          detail: o,
        })),
        ...vouchers.map((v: any) => ({
          id: v.id,
          createdAt: v.createdAt,
          totalAmount: v.totalPaid || v.voucher?.price || 0, // Fallback to voucher price if totalPaid is 0 or missing
          status: v.status,
          itemsCount: 1,
          type: 'VOUCHER',
          buyerName: v.user?.name || 'Pelanggan',
          detail: v,
        }))
      ];

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistoryItems(combined);
      setCurrentPage(1);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fallback parsers
  const totalRevenue = revenueData ? (revenueData.totalRevenue ?? revenueData.revenue ?? revenueData.total ?? 0) : 0;
  const dailyRevenue = revenueData ? (revenueData.totalDaily ?? revenueData.dailyRevenue ?? revenueData.daily ?? 0) : 0;
  const totalTransactions = revenueData ? (revenueData.totalTransactions ?? revenueData.transactionsCount ?? revenueData.transactions ?? revenueData.count ?? 0) : 0;

  function formatDate(dateStr: string) {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("id-ID", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  }

  // Pagination Logic
  const totalPages = Math.ceil(historyItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = historyItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Laporan & Riwayat Transaksi
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ringkasan pendapatan dan daftar transaksi lengkap restoran Anda.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
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
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cards Section */}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              <Card className="border border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pendapatan Harian</CardTitle>
                  <Coins className="h-4.5 w-4.5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    Rp {Number(dailyRevenue).toLocaleString("id-ID")}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total pemasukan hari ini</p>
                </CardContent>
              </Card>

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

              <Card className="border border-border bg-card sm:col-span-2 md:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Transaksi</CardTitle>
                  <ShoppingBag className="h-4.5 w-4.5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {totalTransactions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pesanan selesai diproses</p>
                </CardContent>
              </Card>
            </div>

            {/* History Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-foreground">
                <History className="h-5 w-5 text-primary" />
                Riwayat Transaksi Terbaru
              </h2>
              
              {historyItems.length === 0 ? (
                <div className="py-12 text-center rounded-2xl border border-dashed border-border bg-card">
                  <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">Belum ada riwayat transaksi penjualan.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {paginatedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between hover:border-primary/20 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                ID: {item.id.toString().toUpperCase().slice(0, 8)}...
                              </span>
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                item.status === "COMPLETED" || item.status === "SUCCESS" || item.status === "PAID" || item.status === "SETTLED"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : item.status === "CANCELLED" || item.status === "FAILED"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {formatDate(item.createdAt)}
                              </span>
                              <span>•</span>
                              <span className="font-semibold text-primary">{item.type}</span>
                              <span>•</span>
                              <span>{item.itemsCount} Item</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <div className="font-bold text-foreground">
                            Rp {Number(item.totalAmount).toLocaleString("id-ID")}
                          </div>
                          <Button size="sm" variant="outline" className="flex items-center gap-1.5" onClick={() => setSelectedItem(item)}>
                            <Eye className="h-4 w-4" /> Detail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <p className="text-sm text-muted-foreground">
                        Halaman {currentPage} dari {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Prev
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Detail Transaksi
              </CardTitle>
              <CardDescription>
                ID: {selectedItem.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</p>
                  <p className="font-medium text-foreground">{formatDate(selectedItem.createdAt)}</p>
                </div>
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pembeli</p>
                  <p className="font-medium text-foreground">{selectedItem.buyerName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipe</p>
                  <p className="font-medium text-foreground">{selectedItem.type}</p>
                </div>
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                  <p className={`font-medium ${
                    selectedItem.status === 'COMPLETED' || selectedItem.status === 'PAID' || selectedItem.status === 'SUCCESS' || selectedItem.status === 'SETTLED'
                      ? 'text-green-600'
                      : selectedItem.status === 'CANCELLED' || selectedItem.status === 'FAILED'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}>
                    {selectedItem.status}
                  </p>
                </div>
              </div>
              <div className="space-y-2 rounded-lg border border-border/50 bg-primary/5 p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Rincian Item</p>
                <div className="max-h-[150px] overflow-y-auto">
                  {selectedItem.type === 'VOUCHER' ? (
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-foreground">{selectedItem.detail.voucher?.title || 'Voucher Diskon'}</span>
                      <span className="font-medium text-foreground">Rp {Number(selectedItem.totalAmount).toLocaleString('id-ID')}</span>
                    </div>
                  ) : (
                    selectedItem.detail.items && selectedItem.detail.items.length > 0 ? (
                      selectedItem.detail.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-border/40 last:border-0">
                          <span className="font-medium text-foreground">{it.quantity}x {it.menu?.name || 'Item Menu'}</span>
                          <span className="font-medium text-foreground">Rp {Number(it.price * it.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic text-xs">Tidak ada detail item yang tersedia.</p>
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center rounded-lg border border-border/50 bg-muted/50 p-3 mt-2">
                 <span className="font-semibold text-foreground">Total Tagihan</span>
                 <span className="text-lg font-bold text-foreground">Rp {Number(selectedItem.totalAmount).toLocaleString('id-ID')}</span>
              </div>
              <div className="pt-2 flex justify-end">
                <Button onClick={() => setSelectedItem(null)} className="w-full">
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
