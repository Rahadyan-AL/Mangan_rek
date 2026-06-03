"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Clock,
  FileText,
  History,
  LogOut,
  Printer,
  RefreshCw,
  ShoppingBag,
  QrCode,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type OrderItem = {
  menuId?: string;
  menuName?: string;
  name?: string;
  quantity: number;
  price?: number;
  subtotal?: number;
};

type Order = {
  id: string;
  customerName?: string;
  customer?: string;
  status: string;
  paymentMethod?: string;
  totalAmount?: number;
  total?: number;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
  qr_string?: string;
  qrisCode?: string;
  qrisString?: string;
  qrCode?: string;
  qrString?: string;
};

type RestoInfo = {
  name?: string;
  description?: string | null;
  address?: string | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatDateTime(dateString: string) {
  try {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

const FOOTER_LINKS = [
  { href: "/dashboard/kasir", label: "Order", icon: ShoppingBag },
  { href: "/dashboard/kasir/history", label: "History", icon: History },
  { href: "/logout", label: "Logout", icon: LogOut },
];

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  PAID:       "bg-green-100 text-green-700",
  PENDING:    "bg-yellow-100 text-yellow-700",
  CANCELLED:  "bg-red-100 text-red-700",
  PROCESSING: "bg-blue-100 text-blue-700",
};

export default function KasirHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<Record<string, string>>({});
  const [restoInfo, setRestoInfo] = useState<RestoInfo | null>(null);
  const [selectedQrisOrder, setSelectedQrisOrder] = useState<Order | null>(null);
  const [selectedCancelOrder, setSelectedCancelOrder] = useState<Order | null>(null);
  const [selectedNotaOrder, setSelectedNotaOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notaRef = useRef<HTMLDivElement>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      const [resHistory, resMenus, resProfile] = await Promise.all([
        fetch(`${baseUrl}/api/pos/orders/history`, { credentials: "include" }),
        fetch(`${baseUrl}/api/pos/menus`, { credentials: "include" }),
        fetch(`${baseUrl}/api/restaurants/profile`, { credentials: "include" }).catch(() => null),
      ]);

      if (!resHistory.ok) throw new Error("Gagal mengambil data history.");
      const data = await resHistory.json();
      const list = data.data || data.orders || data;
      setOrders(Array.isArray(list) ? list : []);

      if (resMenus.ok) {
        const menuData = await resMenus.json();
        const menuList = menuData.data || menuData.menus || menuData;
        if (Array.isArray(menuList)) {
          const menuMap: Record<string, string> = {};
          menuList.forEach((m: any) => {
            menuMap[m.id] = m.name;
          });
          setMenus(menuMap);
        }
      }

      if (resProfile && resProfile.ok) {
        const profileData = await resProfile.json();
        // API returns { data: { name, description, address, ... } }
        const info = profileData.data || profileData.restaurant || profileData;
        setRestoInfo(info);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCancelOrder = async () => {
    if (!selectedCancelOrder) return;
    try {
      setIsCancelling(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/pos/orders/${selectedCancelOrder.id}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Order berhasil dibatalkan");
        setSelectedCancelOrder(null);
        fetchHistory();
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal membatalkan order");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePrintNota = () => {
    const printContent = notaRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Nota Transaksi</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #111;
              padding: 16px;
              max-width: 380px;
              margin: 0 auto;
            }
            .header { text-align: center; margin-bottom: 12px; }
            .header h1 { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
            .header p { font-size: 11px; color: #444; margin-top: 2px; }
            .divider { border-top: 1px dashed #999; margin: 10px 0; }
            .divider-solid { border-top: 2px solid #111; margin: 10px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .row .label { color: #555; }
            .row .value { font-weight: 600; text-align: right; max-width: 60%; }
            .items-header { font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; color: #444; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
            .item-name { flex: 1; }
            .item-qty { width: 30px; text-align: center; }
            .item-price { text-align: right; }
            .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 6px; }
            .payment-row { display: flex; justify-content: space-between; margin-top: 4px; font-size: 12px; }
            .footer { text-align: center; margin-top: 14px; font-size: 11px; color: #666; }
            .order-id { font-size: 10px; color: #888; text-align: center; margin-bottom: 8px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Build nota content for the selected order
  const renderNotaContent = (order: Order) => {
    const customerName = order.customerName || order.customer || "-";
    const totalAmount = order.totalAmount ?? order.total ?? 0;
    const paymentMethod = order.paymentMethod || "-";
    const timestamp = order.createdAt || order.updatedAt;
    const items = order.items || [];

    const restoName = restoInfo?.name || "Restoran";
    const restoDesc = restoInfo?.description || "";
    const restoAddress = restoInfo?.address || "";

    return (
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: "13px", color: "#111" }}>
        {/* Header Resto */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "1px" }}>Nota</h1>

        </div>

        <div style={{ borderTop: "2px solid #111", margin: "10px 0" }} />

        {/* Order info */}
        {timestamp && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "#555" }}>Tanggal</span>
            <span style={{ fontWeight: 600 }}>{formatDateTime(timestamp)}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span style={{ color: "#555" }}>Pelanggan</span>
          <span style={{ fontWeight: 600 }}>{customerName}</span>
        </div>

        <div style={{ borderTop: "1px dashed #999", margin: "10px 0" }} />

        {/* Items */}
        <p style={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", color: "#444" }}>
          Menu yang Dipesan
        </p>
        {items.length > 0 ? (
          items.map((item, idx) => {
            const itemName =
              item.menuName || item.name || menus[item.menuId || ""] || item.menuId || "-";
            const itemPrice = item.price ?? 0;
            const itemTotal = item.subtotal ?? (item.price != null ? item.price * item.quantity : 0);
            return (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "12px" }}>
                <span style={{ flex: 1 }}>{itemName}</span>
                <span style={{ width: "30px", textAlign: "center" }}>×{item.quantity}</span>
                <span style={{ textAlign: "right" }}>{formatRupiah(itemTotal)}</span>
              </div>
            );
          })
        ) : (
          <p style={{ color: "#888", fontSize: "11px" }}>-</p>
        )}

        <div style={{ borderTop: "1px dashed #999", margin: "10px 0" }} />

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: "bold", marginBottom: "6px" }}>
          <span>TOTAL</span>
          <span>{formatRupiah(totalAmount)}</span>
        </div>

        {/* Payment */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
          <span style={{ color: "#555" }}>Pembayaran</span>
          <span style={{ fontWeight: 600 }}>{paymentMethod}</span>
        </div>

        <div style={{ borderTop: "2px solid #111", margin: "12px 0" }} />

        
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f6f6fb]">
      <div className="ml-16 max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-[#16406d]">
              <Clock className="h-6 w-6" />
              History Transaksi
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Riwayat pembayaran di kasir.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-500">
            Memuat history transaksi...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const customerName = order.customerName || order.customer || "-";
              const totalAmount = order.totalAmount ?? order.total ?? 0;
              const paymentMethod = order.paymentMethod || "-";
              const status = (order.status || "UNKNOWN").toUpperCase();
              const statusStyle =
                STATUS_STYLES[status] || "bg-slate-100 text-slate-600";
              const timestamp = order.createdAt || order.updatedAt;
              const items = order.items || [];

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  {/* Top row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-slate-400">
                        #{order.id}
                      </p>
                      <p className="mt-0.5 text-base font-semibold text-slate-900">
                        {customerName}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Items */}
                  {items.length > 0 && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Item Pesanan
                      </p>
                      <ul className="space-y-1.5">
                        {items.map((item, idx) => {
                          const itemName =
                            item.menuName || item.name || menus[item.menuId || ""] || item.menuId || "-";
                          const itemTotal =
                            item.subtotal ??
                            (item.price != null
                              ? item.price * item.quantity
                              : null);
                          return (
                            <li
                              key={idx}
                              className="flex items-center justify-between text-sm text-slate-700"
                            >
                              <span>
                                <span className="font-medium">{itemName}</span>
                                <span className="ml-1 text-slate-400">
                                  × {item.quantity}
                                </span>
                              </span>
                              {itemTotal != null && (
                                <span className="text-slate-500">
                                  {formatRupiah(itemTotal)}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Bottom row */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2 text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium">
                        {paymentMethod}
                      </span>
                      {timestamp && (
                        <span className="text-xs">{formatDateTime(timestamp)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Nota Button - always visible */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 border-[#00458B] text-[#00458B] hover:bg-[#e8edf7]"
                        onClick={() => setSelectedNotaOrder(order)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Lihat Nota
                      </Button>

                      {status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setSelectedCancelOrder(order)}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Batalkan
                        </Button>
                      )}
                      {status === "PENDING" && paymentMethod === "QRIS" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-[#00458B] text-[#00458B] hover:bg-[#e8edf7]"
                          onClick={() => setSelectedQrisOrder(order)}
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          Tampilkan QRIS
                        </Button>
                      )}
                      <span className="text-base font-bold text-[#16406d]">
                        {formatRupiah(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Left Sidebar Navbar ── */}
      <aside className="fixed left-0 top-0 z-40 flex h-full w-16 flex-col items-center border-r border-slate-200 bg-white py-5 shadow-[1px_0_6px_rgba(0,0,0,0.06)]">
        <nav className="flex flex-1 flex-col items-center gap-1">
          {FOOTER_LINKS.filter((l) => l.href !== "/logout").map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-3 text-xs font-medium text-slate-500 transition-colors hover:bg-[#e8edf7] hover:text-[#00458B]"
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout pinned to bottom */}
        <Link
          href="/logout"
          className="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-3 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </aside>

      {/* ── Nota Modal ── */}
      {selectedNotaOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedNotaOrder(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8edf7] text-[#00458B]">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Nota Transaksi</h3>
              </div>
              <button
                onClick={() => setSelectedNotaOrder(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Nota Preview */}
            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
              {/* Hidden div used for print */}
              <div ref={notaRef} style={{ display: "none" }}>
                {renderNotaContent(selectedNotaOrder)}
              </div>
              {/* Visible preview */}
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                {renderNotaContent(selectedNotaOrder)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-5 py-4 border-t border-slate-100 bg-[#f8fafc]">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedNotaOrder(null)}
              >
                Tutup
              </Button>
              <Button
                className="flex-1 gap-2 bg-[#00458B] text-white hover:bg-[#003a76]"
                onClick={handlePrintNota}
              >
                <Printer className="h-4 w-4" />
                Print / Export
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* QRIS Modal */}
      {selectedQrisOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedQrisOrder(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-[#00458B]" />
                <h3 className="text-lg font-semibold">Scan QRIS</h3>
              </div>
              <p className="text-center text-sm text-slate-500">
                Scan QR code berikut untuk menyelesaikan pembayaran pesanan{" "}
                <span className="font-semibold text-slate-700">
                  #{selectedQrisOrder.id.substring(0, 8)}
                </span>
              </p>
              <div className="rounded-xl border-2 border-[#00458B]/20 p-3 shadow-sm">
                {(() => {
                  const qris =
                    selectedQrisOrder.qr_string ||
                    selectedQrisOrder.qrisCode ||
                    selectedQrisOrder.qrisString ||
                    selectedQrisOrder.qrCode ||
                    selectedQrisOrder.qrString ||
                    (typeof window !== "undefined" ? localStorage.getItem(`qris_${selectedQrisOrder.id}`) : null);
                  if (qris) {
                    /* eslint-disable-next-line @next/next/no-img-element */
                    return (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          qris
                        )}`}
                        alt="QRIS QR Code"
                        width={200}
                        height={200}
                        className="rounded-md"
                      />
                    );
                  }
                  return (
                    <div className="flex h-[200px] w-[200px] items-center justify-center rounded-md bg-slate-50 text-center text-sm text-slate-400">
                      Expired
                    </div>
                  );
                })()}
              </div>
              <p className="text-sm font-semibold text-[#16406d]">
                Total: {formatRupiah(selectedQrisOrder.totalAmount ?? selectedQrisOrder.total ?? 0)}
              </p>
              <Button
                className="mt-2 w-full bg-[#00458B] text-white hover:bg-[#003a76]"
                onClick={() => setSelectedQrisOrder(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {selectedCancelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isCancelling && setSelectedCancelOrder(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
                <XCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Batalkan Pesanan?</h3>
              <p className="text-sm text-slate-500 mb-4">
                Apakah Anda yakin ingin membatalkan pesanan{" "}
                <strong className="text-slate-700">#{selectedCancelOrder.id.substring(0, 8)}</strong> dari{" "}
                <strong className="text-slate-700">{selectedCancelOrder.customerName || selectedCancelOrder.customer || "-"}</strong>?
                Tindakan ini tidak dapat dikembalikan.
              </p>
              
              <div className="flex w-full gap-3 mt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedCancelOrder(null)}
                  disabled={isCancelling}
                >
                  Kembali
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Membatalkan..." : "Ya, Batalkan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}