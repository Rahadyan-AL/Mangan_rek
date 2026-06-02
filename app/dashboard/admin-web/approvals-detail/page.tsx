"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/owners/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data owner");
      }
      setRestaurant(data.data || data.owner || data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleAction = async (status: string) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/admin/approvals/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || `Gagal melakukan action: ${status}`);
        return;
      }
      alert(`Berhasil memperbarui status menjadi ${status}`);
      router.push("/dashboard/admin-web/approvals");
    } catch (err) {
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!id) {
    return <div className="p-6">ID tidak ditemukan di URL.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Memuat detail...</div>;
  }

  if (error || !restaurant) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || "Data tidak ditemukan"}</p>
        <Link href="/dashboard/admin-web/approvals" className="text-blue-500 hover:underline">
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Pending Approval Detail
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            {restaurant.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Detail data pemilik restoran yang masih menunggu approval.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild disabled={isUpdating}>
            <Link href="/dashboard/admin-web/approvals">Kembali</Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleAction("REJECTED")} 
            disabled={isUpdating}
          >
            Reject
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90" 
            onClick={() => handleAction("ACTIVE")}
            disabled={isUpdating}
          >
            Approve
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Data Registrasi</CardTitle>
            <CardDescription>
              Data pemilik dan restoran.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Nama Pemilik" value={restaurant.name} />
            <DetailField label="Email" value={restaurant.email} />
            <DetailField label="Status Akun" value={restaurant.status} />
            <DetailField label="Role" value={restaurant.role} />
            <DetailField 
              label="ID Owner" 
              value={restaurant.id} 
              className="sm:col-span-2" 
            />
          </CardContent>
        </Card>

        {restaurant.restaurant && (
          <Card className="border border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Data Restoran & Legalitas</CardTitle>
              <CardDescription>
                Informasi restoran dan foto dokumen legalitas yang diunggah.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <DetailField label="Nama Restoran" value={restaurant.restaurant.name} />
                <DetailField label="Alamat" value={restaurant.restaurant.address} />
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Foto Legalitas</p>
                {restaurant.restaurant.legalPhoto ? (
                  <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={restaurant.restaurant.legalPhoto} 
                      alt="Legalitas Restoran" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-muted/50">
                    <p className="text-sm text-muted-foreground">Tidak ada foto legalitas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
            <CardDescription>
              Informasi singkat untuk review cepat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border border-border/60 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Approval state
              </p>
              <p className="mt-1 font-semibold text-foreground">{restaurant.status}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Email Terdaftar
              </p>
              <p className="mt-1 wrap-break-word text-foreground">{restaurant.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10 md:py-10">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <DetailContent />
      </Suspense>
    </main>
  );
}

function DetailField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | undefined | null;
  className?: string;
}) {
  return (
    <div className={`space-y-1 rounded-xl border border-border/60 bg-background p-4 ${className}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="wrap-break-word text-sm font-medium text-foreground">{value || "-"}</p>
    </div>
  );
}
