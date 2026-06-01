"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type User = { id: string; name: string; email: string; banned?: boolean };

const initialUsers: User[] = [
  { id: "u1", name: "Rina", email: "rina@example.com" },
  { id: "u2", name: "Dimas", email: "dimas@example.com" },
  { id: "u3", name: "Tari", email: "tari@example.com" },
];

export default function Page() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  function toggleBan(id: string) {
    setUsers((cur) => cur.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u)));
  }

  function handleDelete(id: string) {
    setUsers((cur) => cur.filter((u) => u.id !== id));
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
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
                {users.map((u) => (
                  <TableRow key={u.id} className="border-border/40">
                    <TableCell className="py-4 pr-4 font-medium">{u.name}</TableCell>
                    <TableCell className="py-4 pr-4 text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="py-4 pr-4">{u.banned ? "Banned" : "Active"}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant={u.banned ? "secondary" : "outline"} onClick={() => toggleBan(u.id)}>
                          {u.banned ? "Unban" : "Ban"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
