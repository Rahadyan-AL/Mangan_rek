import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const promos = [
  { name: "Lunch Promo", time: "11:00 - 14:00", discount: "20%" },
  { name: "Happy Hour", time: "15:00 - 17:00", discount: "15%" },
  { name: "Weekend Special", time: "Sat - Sun", discount: "10%" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <Card className="border border-border">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-2xl">Promo Setup</CardTitle>
            <CardDescription>
              Atur jam promo, diskon, dan periode aktif promo.
            </CardDescription>
          </div>
          <Link href="/dashboard/admin-resto" className="text-sm text-primary hover:underline">
            Kembali ke overview
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {promos.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.time} · Diskon {item.discount}
                </p>
              </div>
              <Button size="sm" variant="outline">
                Edit Promo
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
