import { BadgePercent, Sandwich, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    label: "Total Orders",
    value: "245",
    trend: "+8%",
    tone: "bg-primary/10 text-primary",
    icon: ShoppingCart,
  },
  {
    label: "Menu Items",
    value: "32",
    trend: "+3%",
    tone: "bg-secondary/10 text-secondary",
    icon: Sandwich,
  },
  {
    label: "Active Promos",
    value: "4",
    trend: "+1%",
    tone: "bg-accent/10 text-accent",
    icon: BadgePercent,
  },
  {
    label: "Total Revenue",
    value: "Rp 85.400.000",
    trend: "+12%",
    tone: "bg-emerald-10 text-emerald-700",
    icon: ShoppingCart,
  },
];

const menuItems = [
  { name: "Nasi Goreng Spesial", price: "35.000", status: "Available" },
  { name: "Sate Ayam Madura", price: "42.000", status: "Available" },
  { name: "Es Teh Manis", price: "8.000", status: "Sold Out" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Resto</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan aktivitas dan menu populer hari ini.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <Card key={item.label} className="border border-border">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}>
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <CardDescription>{item.label}</CardDescription>
                    <CardTitle className="text-2xl font-semibold">
                      {item.value}
                    </CardTitle>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {item.trend}
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Menu Management</CardTitle>
              <CardDescription>
                Kelola menu dan status ketersediaan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Rp {item.price}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {item.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Promo Setup</CardTitle>
              <CardDescription>Atur jam promo dan diskon.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Start Time</p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  --:--
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">End Time</p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  --:--
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Discount (%)</p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  e.g. 20
                </div>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Set Promo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
