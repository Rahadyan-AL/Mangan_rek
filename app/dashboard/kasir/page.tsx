"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
  Clock3,
  CreditCard,
  GlassWater,
  LayoutGrid,
  Minus,
  Plus,
  Search,
  Sandwich,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Category = "All" | "Food" | "Drinks" | "Snacks";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "All">;
  image: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type VoucherState = {
  code: string;
  applied: boolean;
};

const categories: Array<{ name: Category; icon: typeof LayoutGrid }> = [
  { name: "All", icon: LayoutGrid },
  { name: "Food", icon: UtensilsCrossed },
  { name: "Drinks", icon: GlassWater },
  { name: "Snacks", icon: Sandwich },
];

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Bakso Malang",
    description: "Bakso hangat khas Malang dengan kuah gurih.",
    price: 25000,
    category: "Food",
    image: "/image/makanan/bakso.jpg",
  },
  {
    id: 2,
    name: "Mie Goreng",
    description: "Mie goreng gurih dengan aroma bawang dan sayur.",
    price: 20000,
    category: "Food",
    image: "/image/makanan/mie-goreng.jpg",
  },
  {
    id: 3,
    name: "Nasi Goreng",
    description: "Nasi goreng klasik dengan topping telur mata sapi.",
    price: 35000,
    category: "Food",
    image: "/image/makanan/nasi-goreng.jpg",
  },
  {
    id: 4,
    name: "Soto Ayam",
    description: "Soto ayam hangat dengan kuah kuning segar.",
    price: 22000,
    category: "Food",
    image: "/image/makanan/soto.jpg",
  },
  {
    id: 5,
    name: "Es Teh Manis",
    description: "Es teh manis dingin untuk pelengkap makan.",
    price: 5000,
    category: "Drinks",
    image: "/image/makanan/pecel.jpg",
  },
  {
    id: 6,
    name: "Sate Ayam",
    description: "Sate ayam dengan bumbu kacang yang manis gurih.",
    price: 7000,
    category: "Food",
    image: "/image/makanan/Sate-Ayam.jpg",
  },
  {
    id: 7,
    name: "Pecel",
    description: "Pecel segar dengan sambal kacang khas Jawa.",
    price: 12000,
    category: "Snacks",
    image: "/image/makanan/pecel.jpg",
  },
  {
    id: 8,
    name: "Lalapan",
    description: "Lalapan sederhana dengan sayur segar dan sambal.",
    price: 12000,
    category: "Snacks",
    image: "/image/makanan/lalapan.jpg",
  },
];

const initialCart: CartItem[] = [
  { id: 1, name: "Bakso Malang", price: 25000, quantity: 2 },
  { id: 5, name: "Es Teh Manis", price: 5000, quantity: 1 },
];

const initialVoucher = "";

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [voucher, setVoucher] = useState<VoucherState>({
    code: initialVoucher,
    applied: false,
  });

  const filteredMenu = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch =
        keyword.length === 0 ||
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = voucher.applied ? Math.round(subtotal * 0.1) : 0;
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal - discount + tax;

  function addToCart(menuItem: MenuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === menuItem.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentCart, { id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  }

  function updateQuantity(id: number, delta: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id: number) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris">("cash");

  function handleFinishPayment() {
    if (paymentMethod === "cash") {
      // simple flow: clear cart and close
      clearCart();
      setShowCheckout(false);
      alert("Pembayaran tunai berhasil.");
      return;
    }

    // QRIS placeholder flow
    clearCart();
    setShowCheckout(false);
    alert("Pembayaran via QRIS selesai (placeholder).");
  }

  function applyVoucher() {
    setVoucher((currentVoucher) => ({
      ...currentVoucher,
      applied: currentVoucher.code.trim().toLowerCase() === "malang10",
    }));
  }

  return (
    <main className="min-h-screen bg-[#f6f6fb] text-slate-900">
      <div className="mx-auto grid min-h-screen w-full max-w-360 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex min-h-0 flex-col border-b border-slate-200 bg-[#fbfbfd] lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 px-4 py-4 lg:px-6 lg:py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8edf7] text-[#00458B] shadow-sm">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-[#16406d]">Malang Central</h1>
                    <p className="text-xs text-slate-500">POS Terminal 01</p>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 lg:max-w-4xl xl:flex-row xl:items-center">
                <div className="relative w-full xl:max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search menu..."
                    className="h-11 rounded-lg border-slate-200 bg-white pl-11 shadow-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.name;

                    return (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => setActiveCategory(category.name)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-[#a65a2e] text-white shadow-sm"
                            : "bg-[#edf0f6] text-slate-600 hover:bg-[#e2e7f0]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredMenu.map((item) => (
                <Card key={item.id} className="overflow-hidden border-slate-200 bg-white shadow-sm">
                  <div className="relative h-32 w-full overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {item.description}
                      </p>
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
          </div>
        </section>

        <aside className="flex min-h-0 flex-col bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:px-5">
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
                <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border-b border-slate-100 pb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{formatRupiah(item.price)}</p>
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

          <div className="border-t border-slate-200 px-4 py-4 lg:px-5">
            <div className="mb-4 flex gap-2">
              <Input
                value={voucher.code}
                onChange={(e) =>
                  setVoucher((currentVoucher) => ({
                    ...currentVoucher,
                    code: e.target.value,
                    applied: false,
                  }))
                }
                placeholder="Voucher Code"
                className="h-10 rounded-lg border-slate-200 bg-white"
              />
              <Button variant="outline" type="button" onClick={applyVoucher} className="h-10 shrink-0 rounded-lg">
                Apply
              </Button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#a65a2e]">
                <span>Discount</span>
                <span>- {formatRupiah(discount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Tax (11%)</span>
                <span>{formatRupiah(tax)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-lg font-semibold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-[#16406d]">{formatRupiah(total)}</span>
            </div>

            <Button
              className="mt-5 h-12 w-full gap-2 rounded-lg bg-[#00458B] text-white hover:bg-[#003a76]"
              onClick={() => setShowCheckout(true)}
            >
              <CreditCard className="h-4 w-4" />
              Checkout
            </Button>

            {showCheckout ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setShowCheckout(false)} />
                <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-semibold">Checkout</h3>
                  <p className="mt-1 text-sm text-slate-500">Pilih metode pembayaran</p>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                        paymentMethod === "cash" ? "bg-[#e6f3ff] border-[#a6d1ff]" : "bg-white"
                      }`}
                    >
                      Tunai
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium ${
                        paymentMethod === "qris" ? "bg-[#e6f3ff] border-[#a6d1ff]" : "bg-white"
                      }`}
                    >
                      QRIS
                    </button>
                  </div>

                  <div className="mt-4">
                    {paymentMethod === "qris" ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-48 w-48 rounded-md border bg-white p-4 shadow-sm">
                          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                            QRIS Placeholder
                          </div>
                        </div>
                        <div className="text-center text-sm text-slate-600">Nominal: {formatRupiah(total)}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-600">Bayar tunai di kasir. Nominal: {formatRupiah(total)}</div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button type="button" className="rounded-md px-4 py-2" onClick={() => setShowCheckout(false)}>
                      Tutup
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishPayment}
                      className="rounded-md bg-[#00458B] px-4 py-2 text-white"
                    >
                      Selesaikan
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              Fast payment ready
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
