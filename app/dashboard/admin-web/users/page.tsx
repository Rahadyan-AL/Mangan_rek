"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";

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
    fetchUsers();
  }, [fetchUsers]);

  async function toggleBan(id: string) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users/${id}/ban`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Gagal mengubah status ban");
        return;
      }
      fetchUsers();
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini secara permanen?")) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Gagal menghapus user");
        return;
      }
      setUsers((cur) => cur.filter((u) => u.id !== id));
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
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
                    const isBanned = u.status === "BANNED";
                    return (
                      <TableRow key={u.id} className="border-border/40">
                        <TableCell className="py-4 pr-4 font-medium">{u.name}</TableCell>
                        <TableCell className="py-4 pr-4 text-muted-foreground">{u.email}</TableCell>
                        <TableCell className="py-4 pr-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${isBanned ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {u.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex gap-2">
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
    </main>
  );
}
