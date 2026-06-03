"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function SettlePage() {
  const [type, setType] = useState<"voucher" | "pos">("voucher");
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSettle(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;

    setIsLoading(true);
    setMessage(null);
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    let endpoint = "";
    if (type === "voucher") {
      endpoint = `${baseUrl}/api/vouchers/transactions/${id.trim()}/verify-mock`;
    } else {
      endpoint = `${baseUrl}/api/pos/orders/${id.trim()}/verify-mock`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setMessage({ type: "success", text: data.message || "Transaksi berhasil disettle!" });
        setId("");
      } else {
        setMessage({ type: "error", text: data.message || "Gagal melakukan settle transaksi." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan pada sistem." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settle Manual</h1>
          <p className="mt-2 text-sm text-slate-500">
            Fitur khusus Super Admin untuk memverifikasi dan mengubah status transaksi menjadi PAID/SETTLED.
          </p>
        </header>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Verifikasi Transaksi</CardTitle>
            <CardDescription>
              Pilih jenis transaksi dan masukkan ID yang valid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSettle} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type">Jenis Transaksi</Label>
                <Select value={type} onValueChange={(v) => setType(v as "voucher" | "pos")}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih Jenis Transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voucher">Pembelian Voucher Promo</SelectItem>
                    <SelectItem value="pos">Order Kasir (POS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id">ID Pembelian / ID Order</Label>
                <Input
                  id="id"
                  placeholder="Contoh: d3779ce9-da13..."
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="font-mono text-sm"
                  required
                />
              </div>

              {message && (
                <div className={`flex items-start gap-3 rounded-lg p-3 text-sm ${
                  message.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <p>{message.text}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#00458B] hover:bg-[#00356b] text-white"
                disabled={isLoading || !id.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Verifikasi (Settle)"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
