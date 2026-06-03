"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { History, Clock, FileText, ArrowLeft, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/orders/history`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil riwayat transaksi.");
      }

      const data = await res.json();
      const resultData = data.data || {};
      const orders = Array.isArray(resultData.orders) ? resultData.orders : [];
      const vouchers = Array.isArray(resultData.vouchers) ? resultData.vouchers : [];

      const combined = [
        ...orders.map((o: any) => ({
          id: o.id,
          createdAt: o.createdAt,
          totalAmount: o.finalAmount || o.totalAmount,
          status: o.status,
          itemsCount: o.items ? o.items.length : 0,
          type: 'ORDER',
        })),
        ...vouchers.map((v: any) => ({
          id: v.id,
          createdAt: v.createdAt,
          totalAmount: v.totalPaid,
          status: v.status,
          itemsCount: 1,
          type: 'VOUCHER',
        }))
      ];

      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setHistoryItems(combined);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  function formatDate(dateStr: string) {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <History className="h-6 w-6 text-primary" />
              History Transaksi Resto
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Riwayat transaksi penjualan dan pesanan restoran Anda.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchHistory} disabled={isLoading}>
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
            <p className="text-sm text-muted-foreground">Memuat riwayat transaksi...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">Belum ada riwayat transaksi penjualan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map((item) => {
              const id = item.id || item.orderId || "-";
              const timeStr = item.createdAt || item.date || item.time || "";
              const totalAmount = item.total || item.totalPrice || item.grandTotal || 0;
              const status = item.status || "COMPLETED";
              
              // Parse item count
              let itemsCount = 0;
              if (Array.isArray(item.items)) {
                itemsCount = item.items.length;
              } else if (item.itemsCount) {
                itemsCount = item.itemsCount;
              } else if (item.totalItems) {
                itemsCount = item.totalItems;
              }

              return (
                <div
                  key={id}
                  className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 sm:flex-row sm:items-center sm:justify-between hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          ID: {id.toString().toUpperCase().slice(0, 8)}...
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          status === "COMPLETED" || status === "SUCCESS" || status === "PAID"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}>
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(timeStr)}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-primary">{item.type}</span>
                        <span>•</span>
                        <span>{itemsCount} Item</span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end sm:self-auto text-right font-bold text-foreground">
                    Rp {Number(totalAmount).toLocaleString("id-ID")}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
