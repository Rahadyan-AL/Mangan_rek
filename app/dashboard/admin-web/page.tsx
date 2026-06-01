import Link from "next/link";

import { Store, Users, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  {
    label: "Total Users",
    value: "1,240",
    trend: "+12%",
    tone: "bg-primary/10 text-primary",
    icon: Users,
  },
  {
    label: "Active Restaurants",
    value: "85",
    trend: "+5%",
    tone: "bg-secondary/10 text-secondary",
    icon: Store,
  },
  {
    label: "Pending Approvals",
    value: "12",
    trend: "-2%",
    tone: "bg-accent/10 text-accent",
    icon: Clock3,
  },
  {
    label: "Total Revenue",
    value: "Rp 1.2M",
    trend: "+9%",
    tone: "bg-emerald-10 text-emerald-700",
    icon: Store,
  },
];

const approvals = [
  {
    name: "Warung Kopi Jaya",
    owner: "Budi Santoso",
    date: "Oct 24, 2023",
    category: "Cafe",
  },
  {
    name: "Sate Madura Asli Cak Ali",
    owner: "Ali Mahmud",
    date: "Oct 23, 2023",
    category: "Street Food",
  },
  {
    name: "Depot Rawon Setan",
    owner: "Siti Aminah",
    date: "Oct 22, 2023",
    category: "Traditional",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening today.
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

        <Card className="mt-8 border border-border">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">Pending Restaurant Approvals</CardTitle>
              <CardDescription>
                Daftar resto yang menunggu verifikasi.
              </CardDescription>
            </div>
            <Link href="/dashboard/admin-web/restaurants" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <TableHead className="py-3 pr-4">Restaurant Name</TableHead>
                  <TableHead className="py-3 pr-4">Owner</TableHead>
                  <TableHead className="py-3 pr-4">Date Submitted</TableHead>
                  <TableHead className="py-3 pr-4">Category</TableHead>
                  <TableHead className="py-3">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((item) => (
                  <TableRow key={item.name} className="border-border/40">
                    <TableCell className="py-4 pr-4 font-medium text-foreground">
                      {item.name}
                    </TableCell>
                    <TableCell className="py-4 pr-4 text-muted-foreground">
                      {item.owner}
                    </TableCell>
                    <TableCell className="py-4 pr-4 text-muted-foreground">
                      {item.date}
                    </TableCell>
                    <TableCell className="py-4 pr-4">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
