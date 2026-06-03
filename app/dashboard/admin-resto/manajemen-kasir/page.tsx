"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Pencil, Trash2, UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Cashier = { id: string; name: string; email: string };

export default function Page() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Edit State
  const [editing, setEditing] = useState<Cashier | null>(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCashiers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/users/cashiers`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Gagal memuat daftar kasir dari backend.");
      }
      const data = await res.json();
      const items = data.data || data.cashiers || data;
      setCashiers(Array.isArray(items) ? items : []);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data kasir.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCashiers();
  }, [fetchCashiers]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError("Semua field (Nama, Email, Password) wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/users/cashier`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat akun kasir.");
      }

      setName("");
      setEmail("");
      setPassword("");
      fetchCashiers();
      toast.success("Akun kasir berhasil dibuat!");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
      toast.error("Gagal membuat akun kasir.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editName) return;

    setIsSavingEdit(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      // 1. Update Name
      const updateRes = await fetch(`${baseUrl}/api/users/cashiers/${editing.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!updateRes.ok) {
        const data = await updateRes.json().catch(() => ({}));
        throw new Error(data.message || "Gagal memperbarui nama kasir.");
      }

      // 2. If password is provided, update password
      if (editPassword) {
        const passRes = await fetch(`${baseUrl}/api/users/cashiers/${editing.id}/password`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: editPassword }),
        });

        if (!passRes.ok) {
          const data = await passRes.json().catch(() => ({}));
          throw new Error(data.message || "Gagal memperbarui password kasir.");
        }
      }

      setEditing(null);
      setEditName("");
      setEditPassword("");
      fetchCashiers();
      toast.success("Detail kasir berhasil diperbarui!");
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan jaringan saat edit kasir.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/users/cashiers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCashiers((current) => current.filter((c) => c.id !== id));
        setDeletingId(null);
        toast.success("Akun kasir berhasil dihapus!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus kasir.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setDeletingId(null);
    }
  }

  const handleStartEdit = (c: Cashier) => {
    setEditing(c);
    setEditName(c.name);
    setEditPassword("");
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Manajemen Kasir</h1>
            <p className="mt-1 text-sm text-muted-foreground">Kelola kredensial akun kasir restoran Anda.</p>
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

        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Add Cashier Column */}
          <Card className="border border-border h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Tambah Akun Kasir</CardTitle>
              <CardDescription>Buat akun login baru khusus untuk staf kasir Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Misal: Andi Prasetya"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Login</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kasir.resto@example.com"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting} className="mt-2 w-full bg-[#00458B] text-white hover:bg-[#00356b]">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  {isSubmitting ? "Membuat Akun..." : "Buat Akun Kasir"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* List Cashiers Column */}
          <div className="space-y-6">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Akun Kasir</CardTitle>
                <CardDescription>Akun kasir aktif yang dapat digunakan untuk masuk ke sistem.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground py-4">Memuat data kasir...</p>
                ) : cashiers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">Belum ada akun kasir yang terdaftar.</p>
                ) : (
                  <div className="space-y-2">
                    {cashiers.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 hover:border-primary/30 transition-all"
                      >
                        <div>
                          <div className="font-semibold text-foreground">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleStartEdit(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setDeletingId(c.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Panel */}
            {editing && (
              <Card className="border border-primary/30 bg-card/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-md font-semibold">Edit Akun: {editing.email}</CardTitle>
                  <CardDescription>Perbarui nama atau reset password akun ini.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveEdit} className="grid gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="editName">Nama Baru</Label>
                      <Input
                        id="editName"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="editPassword">Reset Password (Opsional)</Label>
                      <div className="relative">
                        <Input
                          id="editPassword"
                          type={showEditPassword ? "text" : "password"}
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="Kosongkan jika tidak ingin mengubah password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEditPassword(!showEditPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button type="submit" disabled={isSavingEdit} className="bg-[#00458B] text-white hover:bg-[#00356b]">
                        {isSavingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Modal Delete dihapus dari list dan dipindah ke root main */}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Hapus Akun Kasir?</CardTitle>
              <CardDescription className="text-center mt-2">
                Apakah Anda yakin ingin menghapus akun kasir ini secara permanen?
                Tindakan ini tidak dapat dibatalkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-center">
              <Button variant="outline" className="flex-1" onClick={() => setDeletingId(null)}>
                Batal
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deletingId)}>
                Hapus
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
