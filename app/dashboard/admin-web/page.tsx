"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
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

export default function Page() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalOwners, setTotalOwners] = useState<number>(0);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const options = { credentials: "include" as RequestCredentials };

      const [usersRes, ownersRes, approvalsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/users`, options).catch(() => null),
        fetch(`${baseUrl}/api/admin/owners`, options).catch(() => null),
        fetch(`${baseUrl}/api/admin/approvals`, options).catch(() => null),
      ]);

      if (usersRes?.ok) {
        const usersData = await usersRes.json();
        let usersArray = [];
        if (Array.isArray(usersData)) usersArray = usersData;
        else if (Array.isArray(usersData.data)) usersArray = usersData.data;
        else if (Array.isArray(usersData.users)) usersArray = usersData.users;
        else if (usersData.data && Array.isArray(usersData.data.data)) usersArray = usersData.data.data;
        else if (usersData.data && Array.isArray(usersData.data.users)) usersArray = usersData.data.users;
        setTotalUsers(usersArray.length);
      }

      if (ownersRes?.ok) {
        const ownersData = await ownersRes.json();
        let ownersArray = [];
        if (Array.isArray(ownersData)) ownersArray = ownersData;
        else if (Array.isArray(ownersData.data)) ownersArray = ownersData.data;
        else if (Array.isArray(ownersData.owners)) ownersArray = ownersData.owners;
        else if (ownersData.data && Array.isArray(ownersData.data.data)) ownersArray = ownersData.data.data;
        else if (ownersData.data && Array.isArray(ownersData.data.owners)) ownersArray = ownersData.data.owners;
        setTotalOwners(ownersArray.length);
      }

      if (approvalsRes?.ok) {
        const approvalsData = await approvalsRes.json();
        let approvalsArray = [];
        if (Array.isArray(approvalsData)) approvalsArray = approvalsData;
        else if (Array.isArray(approvalsData.data)) approvalsArray = approvalsData.data;
        else if (Array.isArray(approvalsData.approvals)) approvalsArray = approvalsData.approvals;
        else if (approvalsData.data && Array.isArray(approvalsData.data.data)) approvalsArray = approvalsData.data.data;
        else if (approvalsData.data && Array.isArray(approvalsData.data.approvals)) approvalsArray = approvalsData.data.approvals;
        setApprovals(approvalsArray);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    {
      label: "Total Users",
      value: isLoading ? "..." : totalUsers.toString(),
      trend: "+0%",
      tone: "bg-primary/10 text-primary",
      icon: Users,
    },
    {
      label: "Active Restaurants",
      value: isLoading ? "..." : totalOwners.toString(),
      trend: "+0%",
      tone: "bg-secondary/10 text-secondary",
      icon: Store,
    },
    {
      label: "Pending Approvals",
      value: isLoading ? "..." : approvals.length.toString(),
      trend: "+0%",
      tone: "bg-accent/10 text-accent",
      icon: Clock3,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10 md:py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening today.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <Link href="/dashboard/admin-web/approvals" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            ) : approvals.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada pendaftaran yang menunggu verifikasi.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <TableHead className="py-3 pr-4">Legalitas</TableHead>
                    <TableHead className="py-3 pr-4">Name</TableHead>
                    <TableHead className="py-3 pr-4">Email</TableHead>
                    <TableHead className="py-3 pr-4">Status</TableHead>
                    <TableHead className="py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.slice(0, 5).map((item) => (
                    <TableRow key={item.id} className="border-border/40">
                      <TableCell className="py-4 pr-4">
                        {item.restaurant?.legalPhoto ? (
                          <div className="h-10 w-14 overflow-hidden rounded border border-border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={item.restaurant.legalPhoto} 
                              alt="Foto Legalitas" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded border border-border bg-muted/50 text-[8px] text-muted-foreground">
                            Tanpa Foto
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4 pr-4 font-medium text-foreground">
                        {item.restaurant?.name || item.name}
                      </TableCell>
                      <TableCell className="py-4 pr-4 text-muted-foreground">
                        {item.email}
                      </TableCell>
                      <TableCell className="py-4 pr-4">
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/admin-web/approvals-detail?id=${item.id}`}>Detail</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
