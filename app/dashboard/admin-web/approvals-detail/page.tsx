"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Check, X, Eye, ArrowLeft, Building2, Mail, Shield, User, MapPin } from "lucide-react";
import { toast } from "sonner";

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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    const isApprove = status === "ACTIVE";
    const actionLabel = isApprove ? "menyetujui" : "menolak";
    const actionSuccessLabel = isApprove ? "disetujui" : "ditolak";
    
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
        toast.error(data.message || `Gagal ${actionLabel} pendaftaran`);
        return;
      }
      toast.success(`Berhasil ${actionSuccessLabel} pendaftaran restoran`);
      router.push("/dashboard/admin-web/approvals");
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!id) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground font-medium">ID tidak ditemukan di URL.</p>
        <Button asChild>
          <Link href="/dashboard/admin-web/approvals">Kembali</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Memuat detail pendaftaran...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium">{error || "Data tidak ditemukan"}</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/admin-web/approvals">Kembali ke Daftar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div>
          <Link 
            href="/dashboard/admin-web/approvals" 
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Kembali ke Daftar Approvals
          </Link>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {restaurant.restaurant?.name || restaurant.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review pendaftaran oleh pemilik: <span className="font-medium text-foreground">{restaurant.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="destructive" 
            className="shadow-sm gap-1.5"
            onClick={() => handleAction("REJECTED")} 
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
            Tolak
          </Button>
          <Button 
            className="bg-[#00458B] hover:bg-[#00356b] text-white shadow-sm gap-1.5"
            onClick={() => handleAction("ACTIVE")}
            disabled={isUpdating}
          >
            <Check className="h-4 w-4" />
            Setujui
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Data Registrasi */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Data Akun Pemilik (Owner)
              </CardTitle>
              <CardDescription>
                Informasi detail akun pemilik restoran.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <DetailField icon={<User className="h-4 w-4 text-muted-foreground" />} label="Nama Pemilik" value={restaurant.name} />
              <DetailField icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email Pemilik" value={restaurant.email} />
              <DetailField icon={<Shield className="h-4 w-4 text-muted-foreground" />} label="Role Sistem" value={restaurant.role} />
              <DetailField icon={<Check className="h-4 w-4 text-muted-foreground" />} label="Status Akun" value={restaurant.status} />
              <DetailField 
                icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                label="ID Owner" 
                value={restaurant.id} 
                className="sm:col-span-2 font-mono text-xs select-all bg-muted/20" 
              />
            </CardContent>
          </Card>

          {restaurant.restaurant && (
            <Card className="border border-border shadow-sm">
              <CardHeader className="bg-muted/10 border-b border-border/40">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Data Restoran & Foto Legalitas
                </CardTitle>
                <CardDescription>
                  Informasi operasional restoran dan dokumen pendukung.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField icon={<Building2 className="h-4 w-4 text-muted-foreground" />} label="Nama Restoran" value={restaurant.restaurant.name} />
                  <DetailField icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Alamat Restoran" value={restaurant.restaurant.address} />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Foto Restoran / Legalitas</p>
                  {restaurant.restaurant.legalPhoto ? (
                    <div className="relative group max-w-xl mx-auto overflow-hidden rounded-xl border border-border bg-muted/40 shadow-inner flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={restaurant.restaurant.legalPhoto} 
                        alt="Legalitas Restoran" 
                        className="max-h-72 w-full object-contain cursor-zoom-in transition-all duration-300 hover:scale-102"
                        onClick={() => setIsLightboxOpen(true)}
                        title="Klik untuk memperbesar gambar"
                      />
                      <div 
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/65 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white cursor-pointer hover:bg-black/80 transition-colors"
                        onClick={() => setIsLightboxOpen(true)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Perbesar Foto
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
                      <p className="text-sm text-muted-foreground">Tidak ada foto legalitas restoran yang diunggah.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Ringkasan Status */}
        <div className="space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle className="text-lg font-bold">Ringkasan</CardTitle>
              <CardDescription>Pemeriksaan cepat status review.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-sm">
              <div className="rounded-xl border border-border/80 bg-background p-4 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status Review
                </p>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {restaurant.status}
                  </span>
                </div>
              </div>
              
              <div className="rounded-xl border border-border/80 bg-background p-4 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Owner
                </p>
                <p className="font-medium text-foreground break-all">{restaurant.email}</p>
              </div>

              <div className="rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground space-y-2">
                <p className="font-bold text-foreground">Panduan Super Admin:</p>
                <p>1. Pastikan nama pemilik dan email sudah valid.</p>
                <p>2. Periksa kecocokan foto restoran dengan alamat tertera.</p>
                <p>3. Klik "Setujui" untuk mengaktifkan akun dan memberikan akses ke dashboard admin-resto.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && restaurant.restaurant?.legalPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={restaurant.restaurant.legalPhoto} 
              alt="Pratinjau Legalitas Restoran" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()} 
            />
            <Button 
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/25 rounded-full h-10 w-10 p-0 flex items-center justify-center"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10 md:py-10">
      <Suspense fallback={
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat Halaman...</p>
        </div>
      }>
        <DetailContent />
      </Suspense>
    </main>
  );
}

function DetailField({
  icon,
  label,
  value,
  className = "",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | undefined | null;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 rounded-xl border border-border/80 bg-background p-4 flex flex-col justify-between ${className}`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="wrap-break-word text-sm font-medium text-foreground mt-1">{value || "-"}</p>
    </div>
  );
}
