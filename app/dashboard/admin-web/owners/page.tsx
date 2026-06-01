"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Owner = { id: string; name: string; restaurant: string; banned?: boolean };

const initialOwners: Owner[] = [
  { id: "o1", name: "Pak Budi", restaurant: "Warung Kopi Jaya" },
  { id: "o2", name: "Bu Siti", restaurant: "Depot Rawon Setan" },
];

export default function Page() {
  const [owners, setOwners] = useState<Owner[]>(initialOwners);

  function toggleBan(id: string) {
    setOwners((cur) => cur.map((o) => (o.id === id ? { ...o, banned: !o.banned } : o)));
  }

  function handleDelete(id: string) {
    setOwners((cur) => cur.filter((o) => o.id !== id));
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
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
            <Table>
              <TableHeader>
                <TableRow className="text-xs uppercase tracking-wide text-muted-foreground">
                  <TableHead>Name</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((o) => (
                  <TableRow key={o.id} className="border-border/40">
                    <TableCell className="py-4 pr-4 font-medium">{o.name}</TableCell>
                    <TableCell className="py-4 pr-4 text-muted-foreground">{o.restaurant}</TableCell>
                    <TableCell className="py-4 pr-4">{o.banned ? "Banned" : "Active"}</TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant={o.banned ? "secondary" : "outline"} onClick={() => toggleBan(o.id)}>
                          {o.banned ? "Unban" : "Ban"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(o.id)}>
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
