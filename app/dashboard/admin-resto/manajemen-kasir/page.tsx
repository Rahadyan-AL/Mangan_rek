"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Cashier = { id: string; name: string; email: string };

const initialCashiers: Cashier[] = [
  { id: "c1", name: "Aldi Putra", email: "aldi@example.com" },
  { id: "c2", name: "Sinta W", email: "sinta@example.com" },
];

export default function Page() {
  const [cashiers, setCashiers] = useState<Cashier[]>(initialCashiers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState<Cashier | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    const id = `c${Date.now().toString().slice(-4)}`;
    setCashiers((cur) => [{ id, name, email }, ...cur]);
    setName("");
    setEmail("");
  }

  function handleSaveEdit(updated: Cashier) {
    setCashiers((current) => current.map((c) => (c.id === updated.id ? updated : c)));
    setEditing(null);
  }

  function handleDelete(id: string) {
    setCashiers((current) => current.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Manajemen Kasir</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tambah, edit, atau hapus akun kasir.</p>
        </header>

        <Card className="mb-6 border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Kasir</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nama</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" className="bg-[#00458B] text-white">Buat Kasir</Button>
                <Button type="button" variant="outline" onClick={() => { setName(""); setEmail(""); }}>Batal</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-lg">Daftar Kasir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {cashiers.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeletingId(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {editing ? (
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 text-sm font-semibold">Edit Kasir</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement & { name: { value: string }; email: { value: string } };
                    handleSaveEdit({ id: editing.id, name: form.name.value, email: form.email.value });
                  }}
                  className="grid gap-3"
                >
                  <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input id="name" name="name" defaultValue={editing.name} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" defaultValue={editing.email} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="submit" className="bg-[#00458B] text-white">Simpan</Button>
                    <Button type="button" variant="outline" onClick={() => setEditing(null)}>Batal</Button>
                  </div>
                </form>
              </div>
            ) : null}

            {deletingId ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="mb-3">Yakin ingin menghapus kasir ini?</div>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={() => handleDelete(deletingId)}>Hapus</Button>
                  <Button variant="outline" onClick={() => setDeletingId(null)}>Batal</Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
