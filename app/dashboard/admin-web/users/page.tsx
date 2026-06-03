"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
};

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data user");
      }

      let items = [];
      if (Array.isArray(data)) items = data;
      else if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data.users)) items = data.users;
      else if (data.data && Array.isArray(data.data.data)) items = data.data.data;
      else if (data.data && Array.isArray(data.data.users)) items = data.data.users;

      setUsers(items);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  async function toggleBan(id: string) {
    const userObj = users.find((u) => u.id === id);
    const name = userObj ? userObj.name : "User";
    const currentIsBanned = userObj?.status?.toUpperCase() === "BANNED";
    const actionText = currentIsBanned ? "unban" : "ban";

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users/${id}/ban`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || `Gagal melakukan ${actionText} pada ${name}`);
        return;
      }

      const newStatus = currentIsBanned ? "ACTIVE" : "BANNED";
      toast.success(`Berhasil mengubah status ${name} menjadi ${newStatus === "BANNED" ? "Banned" : "Aktif"}`);
      fetchUsers();
    } catch (err) {
      toast.error(`Terjadi kesalahan jaringan saat melakukan ${actionText}`);
    }
  }

  async function handleDelete(id: string) {
    const userObj = users.find((u) => u.id === id);
    const name = userObj ? userObj.name : "User";
    if (!confirm(`Apakah Anda yakin ingin menghapus user "${name}" secara permanen?`)) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || `Gagal menghapus user ${name}`);
        return;
      }
      toast.success(`User "${name}" berhasil dihapus secara permanen`);
      setUsers((cur) => cur.filter((u) => u.id !== id));
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daftar pengguna terdaftar.</p>
        </header>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada user yang terdaftar.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-xs uppercase tracking-wide text-muted-foreground">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const isBanned = u.status?.toUpperCase() === "BANNED";
                    return (
                      <TableRow key={u.id} className="border-border/40">
                        <TableCell className="py-4 pr-4 font-medium">{u.name}</TableCell>
                        <TableCell className="py-4 pr-4 text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="py-4 pr-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isBanned ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {isBanned ? "BANNED" : "ACTIVE"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedUser(u)} title="Detail User">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant={isBanned ? "secondary" : "outline"} onClick={() => toggleBan(u.id)}>
                              {isBanned ? "Unban" : "Ban"}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Detail User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID User</p>
                <p className="font-mono text-xs select-all text-foreground">{selectedUser.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nama</p>
                  <p className="font-medium text-foreground">{selectedUser.name}</p>
                </div>
                <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</p>
                  <p className="font-medium text-foreground capitalize">{selectedUser.role}</p>
                </div>
              </div>
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-medium text-foreground break-all">{selectedUser.email}</p>
              </div>
              <div className="space-y-1 rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${selectedUser.status?.toUpperCase() === "BANNED" ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {selectedUser.status?.toUpperCase() === "BANNED" ? "BANNED" : "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button onClick={() => setSelectedUser(null)} className="w-full">
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
