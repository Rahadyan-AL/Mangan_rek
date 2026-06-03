"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Ticket, Calendar, AlertCircle, Coins, Archive } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [value, setValue] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  
  // Edit State
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);
  
  // Delete State
  const [deleteConfirmVoucher, setDeleteConfirmVoucher] = useState<any | null>(null);

  const fetchVouchers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/vouchers`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Gagal memuat data voucher dari server.");
      }
      const data = await res.json();
      const items = data.data || data.vouchers || data;
      setVouchers(Array.isArray(items) ? items : []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleStartEdit = (voucher: any) => {
    setEditingVoucherId(voucher.id);
    setTitle(voucher.title);
    setValue(voucher.value.toString());
    setStock(voucher.stock.toString());
    // Clear create-only fields
    setPrice("");
    setExpiryDate("");
  };

  const handleCancelEdit = () => {
    setEditingVoucherId(null);
    setTitle("");
    setPrice("");
    setValue("");
    setStock("");
    setExpiryDate("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !value || !stock) {
      setError("Field Judul, Nilai Voucher, dan Stok wajib diisi.");
      return;
    }

    if (!editingVoucherId) {
      if (!price || !expiryDate) {
        setError("Untuk voucher baru, Harga Beli dan Tanggal Kedaluwarsa wajib diisi.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      let res;

      if (editingVoucherId) {
        // Edit mode (PUT /api/vouchers/:id)
        // Payload: title, value, stock
        const payload = {
          title,
          value: Number(value),
          stock: Number(stock),
        };

        res = await fetch(`${baseUrl}/api/vouchers/${editingVoucherId}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create mode (POST /api/vouchers)
        // Payload: title, price, value, stock, expiryDate
        const isoDate = new Date(`${expiryDate}T23:59:59.000Z`).toISOString();
        const payload = {
          title,
          price: Number(price),
          value: Number(value),
          stock: Number(stock),
          expiryDate: isoDate,
        };

        res = await fetch(`${baseUrl}/api/vouchers`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal menyimpan voucher.");
      }

      handleCancelEdit();
      fetchVouchers();
      toast.success(editingVoucherId ? "Voucher berhasil diperbarui!" : "Voucher berhasil ditambahkan!");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
      toast.error("Gagal menyimpan voucher");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/vouchers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setVouchers((cur) => cur.filter((v) => v.id !== id));
        toast.success("Voucher berhasil dihapus!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus voucher.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setDeleteConfirmVoucher(null);
    }
  }

  function formatDate(isoString: string) {
    if (!isoString) return "-";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return isoString;
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              Manajemen Voucher
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Buat dan kelola voucher diskon yang dapat dibeli oleh pelanggan Anda.
            </p>
          </div>
          <Link href="/dashboard/admin-resto" className="text-sm text-primary hover:underline">
            Kembali ke overview
          </Link>
        </header>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Vouchers List Column */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Daftar Voucher Restoran</CardTitle>
              <CardDescription>Voucher yang saat ini terbit dan dapat diklaim pelanggan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-muted-foreground py-4">Memuat data voucher...</p>
              ) : vouchers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">Belum ada voucher yang terbit.</p>
              ) : (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card p-5 sm:flex-row sm:items-center sm:justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-foreground">
                          {voucher.title}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-800">
                          Nominal: Rp {Number(voucher.value).toLocaleString("id-ID")}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 font-semibold text-blue-800">
                          Harga Beli: Rp {Number(voucher.price).toLocaleString("id-ID")}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800">
                          Stok: {voucher.stock}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Kedaluwarsa: {formatDate(voucher.expiryDate)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-start sm:self-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(voucher)}
                      >
                        <Pencil className="mr-1.5 h-4 w-4" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirmVoucher(voucher)}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" /> Hapus
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Form Setup Column */}
          <Card className="border border-border h-fit">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingVoucherId ? "Edit Voucher" : "Buat Voucher Baru"}
              </CardTitle>
              <CardDescription>
                {editingVoucherId ? "Perbarui judul, nilai nominal, dan stok voucher." : "Terbitkan voucher belanja untuk restoran Anda."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Judul Voucher</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Voucher Diskon Rp10.000"
                    required
                  />
                </div>

                {!editingVoucherId && (
                  <div className="space-y-1.5">
                    <Label htmlFor="price">Harga Beli (Rp)</Label>
                    <div className="relative">
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Harga beli bagi pelanggan, e.g. 8000"
                        required
                      />
                      <Coins className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="value">Nilai Voucher (Rp)</Label>
                  <div className="relative">
                    <Input
                      id="value"
                      type="number"
                      min="1"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Nominal potongan diskon, e.g. 10000"
                      required
                    />
                    <Coins className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stok Voucher</Label>
                  <div className="relative">
                    <Input
                      id="stock"
                      type="number"
                      min="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Jumlah kuota voucher, e.g. 100"
                      required
                    />
                    <Archive className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {!editingVoucherId && (
                  <div className="space-y-1.5">
                    <Label htmlFor="expiryDate">Tanggal Kedaluwarsa</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-[#00458B] text-white hover:bg-[#00356b]"
                >
                  {editingVoucherId ? <Pencil className="mr-1.5 h-4 w-4" /> : <Plus className="mr-1.5 h-4 w-4" />}
                  {isSubmitting ? "Menyimpan..." : editingVoucherId ? "Simpan Perubahan" : "Terbitkan Voucher"}
                </Button>

                {editingVoucherId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="w-full"
                  >
                    Batal Edit
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Hapus Voucher?</CardTitle>
              <CardDescription className="text-center mt-2">
                Apakah Anda yakin ingin menghapus voucher <span className="font-bold text-foreground">{deleteConfirmVoucher.title}</span>?
                Riwayat transaksi yang terkait dengan voucher ini tidak akan dihapus.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-center">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmVoucher(null)}>
                Batal
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirmVoucher.id)}>
                Hapus
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
