"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Owner = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  restaurant?: {
    name: string;
  };
};

export default function Page() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [deleteConfirmOwner, setDeleteConfirmOwner] = useState<Owner | null>(null);

  const fetchOwners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/owners`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data owner");
      }

      let items = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data.owners)) items = data.owners;
      else if (data.data && Array.isArray(data.data.data)) items = data.data.data;
      else if (data.data && Array.isArray(data.data.owners)) items = data.data.owners;

      setOwners(items);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  async function toggleBan(id: string) {
    const ownerObj = owners.find((o) => o.id === id);
    const name = ownerObj ? ownerObj.name : "Owner";
    const currentIsBanned = ownerObj?.status?.toUpperCase() === "REJECTED";
    const actionText = currentIsBanned ? "unban" : "ban";

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users/${id}/ban`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || `Gagal mengubah status ban owner ${name}`);
        return;
      }
      
      const newStatus = currentIsBanned ? "ACTIVE" : "REJECTED";
      toast.success(`Berhasil mengubah status ${name} menjadi ${newStatus === "REJECTED" ? "Banned" : "Aktif"}`);
      fetchOwners();
    } catch (err) {
      toast.error(`Terjadi kesalahan jaringan saat melakukan ${actionText}`);
    }
  }

  async function handleDelete(id: string) {
    const ownerObj = owners.find((o) => o.id === id);
    const name = ownerObj ? ownerObj.name : "Owner";
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || `Gagal menghapus owner ${name}`);
        return;
      }
      toast.success(`Owner "${name}" berhasil dihapus`);
      setOwners((cur) => cur.filter((o) => o.id !== id));
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setDeleteConfirmOwner(null);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Owners</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daftar pemilik restoran dan aksi manajemen.</p>
        </header>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">All Owners</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : owners.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada owner yang terdaftar.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-xs uppercase tracking-wide text-muted-foreground">
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Resto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.map((o) => {
                    const isBanned = o.status?.toUpperCase() === "REJECTED";
                    return (
                      <TableRow key={o.id} className="border-border/40">
                        <TableCell className="py-4 pr-4 font-medium">{o.name}</TableCell>
                        <TableCell className="py-4 pr-4 text-muted-foreground">
                          {o.restaurant?.name || o.email}
                        </TableCell>
                        <TableCell className="py-4 pr-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isBanned ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {isBanned ? "BANNED" : "ACTIVE"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedOwner(o)} title="Detail Owner">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant={isBanned ? "secondary" : "outline"} onClick={() => toggleBan(o.id)}>
                              {isBanned ? "Unban" : "Ban"}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => setDeleteConfirmOwner(o)} title="Hapus Owner">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Owner Details Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Detail Owner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Owner</p>
                <p className="font-mono text-xs select-all text-foreground">{selectedOwner.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama</p>
                  <p className="font-medium text-foreground">{selectedOwner.name}</p>
                </div>
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</p>
                  <p className="font-medium text-foreground capitalize">{selectedOwner.role}</p>
                </div>
              </div>
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-medium text-foreground break-all">{selectedOwner.email}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${selectedOwner.status?.toUpperCase() === "REJECTED" ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {selectedOwner.status?.toUpperCase() === "REJECTED" ? "BANNED" : "ACTIVE"}
                  </span>
                </div>
              </div>
              {selectedOwner.restaurant && (
                <div className="space-y-2 rounded-lg border border-border/50 bg-primary/5 p-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Data Restoran</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Nama Restoran</p>
                    <p className="font-medium text-foreground">{selectedOwner.restaurant.name}</p>
                  </div>
                </div>
              )}
              <div className="pt-2 flex justify-end">
                <Button onClick={() => setSelectedOwner(null)} className="w-full">
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Hapus Owner?</CardTitle>
              <CardDescription className="text-center mt-2">
                Apakah Anda yakin ingin menghapus owner <span className="font-bold text-foreground">{deleteConfirmOwner.name}</span>?
                (Data histori restoran tetap aman dan tersimpan).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-center">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmOwner(null)}>
                Batal
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirmOwner.id)}>
                Hapus
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
