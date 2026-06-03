"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock3,
  CreditCard,
  History,
  LogOut,
  Minus,
  Plus,
  QrCode,
  Search,
  ShoppingBag,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type VoucherState = {
  code: string;
  applied: boolean;
  discountValue: number;
  isLoading: boolean;
  error: string | null;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

const FOOTER_LINKS = [
  { href: "/dashboard/kasir", label: "Order", icon: ShoppingBag },
  { href: "/dashboard/kasir/history", label: "History", icon: History },
  { href: "/logout", label: "Logout", icon: LogOut },
];

export default function Page() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [voucher, setVoucher] = useState<VoucherState>({
    code: "",
    applied: false,
    discountValue: 0,
    isLoading: false,
    error: null,
  });

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "QRIS">("CASH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrisString, setQrisString] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Fetch menus from backend
  const fetchMenus = useCallback(async () => {
    try {
      setIsMenuLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/pos/menus`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.data || data.menus || data;
        setMenuItems(Array.isArray(items) ? items : []);
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      setIsMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const filteredMenu = useMemo(() => {
    let result = menuItems;
    const keyword = search.trim().toLowerCase();
    if (keyword) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          (item.description?.toLowerCase().includes(keyword) ?? false)
      );
    }
    return [...result].sort((a, b) => {
      if (sortOrder === "desc") {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });
  }, [menuItems, search, sortOrder]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = voucher.applied
    ? Math.min(voucher.discountValue, subtotal)
    : 0;
  const total = subtotal - discountAmount;

  function addToCart(menuItem: MenuItem) {
    setCart((cur) => {
      const existing = cur.find((i) => i.id === menuItem.id);
      if (existing) {
        return cur.map((i) =>
          i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...cur,
        { id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 },
      ];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCart((cur) =>
      cur
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setCart((cur) => cur.filter((i) => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  async function applyVoucher() {
    const code = voucher.code.trim();
    if (!code) return;
    setVoucher((v) => ({ ...v, isLoading: true, error: null, applied: false }));
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/pos/validate`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueCode: code }),
      });
      const data = await res.json();
      if (res.ok) {
        const discountValue =
          data.data?.value ??
          data.value ??
          data.data?.discountAmount ??
          data.discountAmount ??
          0;
        setVoucher((v) => ({
          ...v,
          applied: true,
          discountValue: Number(discountValue),
          isLoading: false,
          error: null,
        }));
      } else {
        setVoucher((v) => ({
          ...v,
          applied: false,
          discountValue: 0,
          isLoading: false,
          error: data.message || "Voucher tidak valid",
        }));
      }
    } catch {
      setVoucher((v) => ({
        ...v,
        applied: false,
        discountValue: 0,
        isLoading: false,
        error: "Gagal memvalidasi voucher",
      }));
    }
  }

  async function handleSubmitOrder() {
    if (!customerName.trim()) {
      alert("Masukkan nama pelanggan terlebih dahulu.");
      return;
    }
    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const body = {
        customerName: customerName.trim(),
        items: cart.map((i) => ({ menuId: i.id, quantity: i.quantity })),
        paymentMethod,
        voucherCode: voucher.applied ? voucher.code : "",
      };
      const res = await fetch(`${baseUrl}/api/pos/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        if (paymentMethod === "QRIS") {
          // Extract QRIS string from the backend response
          const qris = data.qr_string;
          
          if (qris) {
            setQrisString(qris);
            if (data.order?.id) {
              localStorage.setItem(`qris_${data.order.id}`, qris);
            }
          } else {
            alert("Gagal memuat kode QRIS dari server.");
          }
        } else {
          setOrderSuccess(true);
          clearCart();
        }
      } else {
        alert(data.message || "Gagal membuat order");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCloseCheckout() {
    setShowCheckout(false);
    setQrisString(null);
    setOrderSuccess(false);
    setCustomerName("");
    setPaymentMethod("CASH");
  }

  function handleQrisConfirmPaid() {
    clearCart();
    setOrderSuccess(true);
    setQrisString(null);
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#f6f6fb] text-slate-900">
      <div className="flex flex-1 ml-16 h-full overflow-hidden">
        {/* ── Left: Menu Section ── */}
        <section className="flex flex-1 flex-col border-r border-slate-200 bg-[#fbfbfd] h-full overflow-hidden">
          <div className="border-b border-slate-200 px-4 py-4 lg:px-6 lg:py-5 shrink-0">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8edf7] text-[#00458B] shadow-sm">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#16406d]">POS Kasir</h1>
                  <p className="text-xs text-slate-500">Point of Sale Terminal</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full xl:max-w-xl">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search menu..."
                    className="h-11 rounded-lg border-slate-200 bg-white pl-11 shadow-sm"
                  />
                </div>
                <div className="flex items-center gap-1 border rounded-lg p-1 bg-white shadow-sm shrink-0">
                  <button 
                    onClick={() => setSortOrder('asc')}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${sortOrder === 'asc' ? 'bg-[#00458B] text-white font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    A-Z
                  </button>
                  <button 
                    onClick={() => setSortOrder('desc')}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${sortOrder === 'desc' ? 'bg-[#00458B] text-white font-medium' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    Z-A
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
            {isMenuLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-slate-500">Memuat menu...</p>
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-slate-500">Menu tidak ditemukan.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {filteredMenu.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-slate-200 bg-white shadow-sm"
                  >
                    {item.image && (
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-3 p-4">
                      <div>
                        <h3 className="text-base font-semibold leading-tight text-slate-900">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-end justify-between gap-3">
                        <p className="text-sm font-semibold text-[#16406d]">
                          {formatRupiah(item.price)}
                        </p>
                        <Button
                          type="button"
                          size="icon"
                          onClick={() => addToCart(item)}
                          className="h-9 w-9 rounded-full bg-[#00458B] text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#003a76]"
                          aria-label={`Tambahkan ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Right: Order Section ── */}
        <aside className="w-[360px] shrink-0 flex flex-col bg-white border-l border-slate-200 h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:px-5 shrink-0">
            <h2 className="text-lg font-semibold text-slate-900">Current Order</h2>
            <button
              type="button"
              onClick={clearCart}
              className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Hapus semua pesanan"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 lg:px-5">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-lg border-b border-slate-100 pb-4"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                    <div className="flex items-center rounded-md border border-slate-200 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-600 transition-colors hover:bg-white"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-8 w-9 items-center justify-center border-x border-slate-200 text-sm font-medium text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-8 w-8 items-center justify-center text-slate-600 transition-colors hover:bg-white"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-medium text-slate-400 transition-colors hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                Order masih kosong.
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 px-4 py-4 lg:px-5 shrink-0">
            {/* Voucher */}
            <div className="mb-4">
              <div className="flex gap-2">
                <Input
                  value={voucher.code}
                  onChange={(e) =>
                    setVoucher((v) => ({
                      ...v,
                      code: e.target.value,
                      applied: false,
                      error: null,
                    }))
                  }
                  placeholder="Kode Voucher"
                  className="h-10 rounded-lg border-slate-200 bg-white"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={applyVoucher}
                  disabled={voucher.isLoading || !voucher.code.trim()}
                  className="h-10 shrink-0 rounded-lg"
                >
                  {voucher.isLoading ? "..." : "Apply"}
                </Button>
              </div>
              {voucher.applied && (
                <p className="mt-1 text-xs text-green-600">
                  ✓ Voucher diterapkan (Potongan {formatRupiah(voucher.discountValue)})
                </p>
              )}
              {voucher.error && (
                <p className="mt-1 text-xs text-red-500">{voucher.error}</p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              {voucher.applied && (
                <div className="flex items-center justify-between text-[#a65a2e]">
                  <span>Diskon Voucher</span>
                  <span>- {formatRupiah(discountAmount)}</span>
                </div>
              )}
              
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-[#16406d]">
                {formatRupiah(total)}
              </span>
            </div>

            <Button
              className="mt-5 h-12 w-full gap-2 rounded-lg bg-[#00458B] text-white hover:bg-[#003a76]"
              onClick={() => setShowCheckout(true)}
              disabled={cart.length === 0}
            >
              <CreditCard className="h-4 w-4" />
              Checkout
            </Button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              Fast payment ready
            </div>
          </div>
        </aside>
      </div>

      {/* ── Checkout Modal ── */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={handleCloseCheckout}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            {/* State 1: Success */}
            {orderSuccess ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <CheckCircle className="h-14 w-14 text-green-500" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Order Berhasil!
                </h3>
                <p className="text-sm text-slate-500">
                  Pesanan telah berhasil diproses.
                </p>
                <Button
                  className="w-full bg-[#00458B] text-white hover:bg-[#003a76]"
                  onClick={handleCloseCheckout}
                >
                  Tutup
                </Button>
              </div>
            ) : qrisString ? (
              /* State 2: Show QRIS QR Code */
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-[#00458B]" />
                  <h3 className="text-lg font-semibold">Scan QRIS</h3>
                </div>
                <p className="text-center text-sm text-slate-500">
                  Scan QR code berikut untuk melakukan pembayaran
                </p>
                <div className="rounded-xl border-2 border-[#00458B]/20 p-3 shadow-sm">
                  {/* Generate QR code from the QRIS string returned by backend */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      qrisString
                    )}`}
                    alt="QRIS QR Code"
                    width={220}
                    height={220}
                    className="rounded-md"
                  />
                </div>
                <p className="text-sm font-semibold text-[#16406d]">
                  Total: {formatRupiah(total)}
                </p>
                <div className="flex w-full gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCloseCheckout}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    onClick={handleQrisConfirmPaid}
                  >
                    Konfirmasi Bayar
                  </Button>
                </div>
              </div>
            ) : (
              /* State 3: Fill checkout form */
              <>
                <h3 className="text-lg font-semibold">Checkout</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi detail order
                </p>

                {/* Customer Name */}
                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    <User className="mr-1 inline h-4 w-4" />
                    Nama Pelanggan
                  </label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masukkan nama pelanggan"
                    className="h-10"
                  />
                </div>

                {/* Payment Method */}
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Metode Pembayaran
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CASH")}
                      className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        paymentMethod === "CASH"
                          ? "border-[#00458B] bg-[#e6f3ff] text-[#00458B]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      Tunai
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("QRIS")}
                      className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        paymentMethod === "QRIS"
                          ? "border-[#00458B] bg-[#e6f3ff] text-[#00458B]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      QRIS
                    </button>
                  </div>
                </div>

                {/* Order total summary */}
                <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Total</span>
                    <span className="font-bold text-[#16406d]">
                      {formatRupiah(total)}
                    </span>
                  </div>
                  {paymentMethod === "QRIS" && (
                    <p className="mt-2 text-xs text-slate-500">
                      QR code akan muncul setelah order dikonfirmasi.
                    </p>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCloseCheckout}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-[#00458B] text-white hover:bg-[#003a76]"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting || !customerName.trim()}
                  >
                    {isSubmitting
                      ? "Memproses..."
                      : paymentMethod === "QRIS"
                      ? "Generate QR"
                      : "Selesaikan"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
    </main>
  );
}
