import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const menuItems = [
  { name: "Nasi Goreng Spesial", price: "35.000", status: "Available" },
  { name: "Sate Ayam Madura", price: "42.000", status: "Available" },
  { name: "Es Teh Manis", price: "8.000", status: "Sold Out" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <Card className="border border-border">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-2xl">Menu Management</CardTitle>
            <CardDescription>
              Atur menu restoran, harga, dan status ketersediaan.
            </CardDescription>
          </div>
          <Link href="/dashboard/admin-resto" className="text-sm text-primary hover:underline">
            Kembali ke overview
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">Rp {item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {item.status}
                </span>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
