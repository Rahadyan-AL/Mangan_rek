"use client";

import { useEffect, useState } from "react";
import { Loader2, Store, MapPin, Clock, Info, LogOut, Power } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RestoProfile = {
  id: string;
  name: string;
  address: string;
  description: string | null;
  category: string | null;
  openingHours: string | null;
  branches: string | null;
  googleMapsUrl: string | null;
  isOpen: boolean;
};

export default function ProfileRestoPage() {
  const [profile, setProfile] = useState<RestoProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [branches, setBranches] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${baseUrl}/api/restaurants/profile`, {
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          const data: RestoProfile = json.data;
          setProfile(data);
          setName(data.name || "");
          setAddress(data.address || "");
          setDescription(data.description || "");
          setCategory(data.category || "");
          setOpeningHours(data.openingHours || "");
          setBranches(data.branches || "");
          setGoogleMapsUrl(data.googleMapsUrl || "");
          setIsOpen(data.isOpen || false);
        } else {
          toast.error("Gagal memuat profil restoran");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan jaringan");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function executeToggleStatus() {
    if (!profile) return;
    
    setConfirmStatusModal(false);
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isOpen: newStatus }),
      });

      if (res.ok) {
        toast.success(`Restoran kini ${newStatus ? "Buka" : "Tutup"}`);
      } else {
        setIsOpen(!newStatus); // revert
        toast.error("Gagal mengubah status restoran");
      }
    } catch (err) {
      setIsOpen(!newStatus); // revert
      toast.error("Terjadi kesalahan saat mengubah status");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSaving(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${baseUrl}/api/restaurants/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          address,
          description,
          category,
          openingHours,
          branches,
          googleMapsUrl,
        }),
      });

      if (res.ok) {
        toast.success("Profil restoran berhasil diperbarui");
      } else {
        const json = await res.json();
        toast.error(json.message || "Gagal memperbarui profil restoran");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan saat menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          Gagal memuat profil restoran. Pastikan Anda memiliki restoran yang terdaftar.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6 md:p-10 space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Profil Restoran
          </h1>
          <p className="text-sm text-slate-500">
            Kelola informasi dan status buka/tutup restoran Anda.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-4 bg-white p-2 pl-4 pr-2 rounded-full border border-slate-200 shadow-sm whitespace-nowrap">
            <div className="flex items-center gap-3">
              <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {isOpen && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
                <Store className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Status Resto</span>
                <span className={`text-sm font-bold ${isOpen ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isOpen ? "SEDANG BUKA" : "SEDANG TUTUP"}
                </span>
              </div>
            </div>
            
            <div className="w-px h-8 bg-slate-200"></div>

            <Button
              onClick={() => setConfirmStatusModal(true)}
              variant={isOpen ? "outline" : "default"}
              size="sm"
              className={`rounded-full px-5 font-semibold transition-all h-9 ${
                isOpen 
                  ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" 
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200"
              }`}
            >
              <Power className="mr-1.5 h-4 w-4" />
              {isOpen ? "Tutup Sekarang" : "Buka Sekarang"}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-[#00458B]" />
              Informasi Utama
            </CardTitle>
            <CardDescription>
              Detail ini akan ditampilkan kepada pelanggan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Restoran</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori Makanan</Label>
                <Input 
                  id="category" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="Contoh: Makanan & Minuman, Cepat Saji..." 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours">Jam Operasional</Label>
                <Input 
                  id="openingHours" 
                  value={openingHours} 
                  onChange={(e) => setOpeningHours(e.target.value)} 
                  placeholder="Contoh: Senin - Jumat 09:00 - 22:00 WIB" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan tentang restoran Anda..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branches">Cabang Restoran</Label>
                <textarea
                  id="branches"
                  rows={3}
                  value={branches}
                  onChange={(e) => setBranches(e.target.value)}
                  placeholder="Contoh: Cabang Utama (Ijen)\nJl. Ijen No. 10"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">Link Google Maps</Label>
                <Input 
                  id="googleMapsUrl" 
                  type="url"
                  value={googleMapsUrl} 
                  onChange={(e) => setGoogleMapsUrl(e.target.value)} 
                  placeholder="https://maps.google.com/..." 
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#00458B] hover:bg-[#003a76] text-white"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-50 border-none shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-700">
                <Info className="h-4 w-4" />
                Tips Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-slate-600">
              <p>
                Informasi yang lengkap membantu pelanggan menemukan dan mengetahui detail restoran Anda.
              </p>
              <ul className="list-disc pl-4 space-y-2 text-slate-500">
                <li>Pastikan kategori sesuai dengan hidangan utama.</li>
                <li>Tuliskan jam operasional dengan jelas.</li>
                <li>Jika tutup sementara/libur, segera ubah status di atas menjadi <strong>Tutup</strong> agar pelanggan tidak memesan.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                <LogOut className="h-4 w-4" />
                Keluar dari Akun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-600 mb-4">
                Akhiri sesi Anda dan keluar dari dashboard admin resto.
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => window.location.href = "/logout"}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Status Modal */}
      {confirmStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm border border-border bg-background/95 shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 text-center">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${isOpen ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <Power className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl">{isOpen ? 'Tutup Restoran?' : 'Buka Restoran?'}</CardTitle>
              <CardDescription className="text-center mt-2">
                Apakah Anda yakin ingin mengubah status operasional restoran menjadi <strong className={isOpen ? 'text-red-600' : 'text-emerald-600'}>{isOpen ? 'TUTUP' : 'BUKA'}</strong>?
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-center">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmStatusModal(false)}>
                Batal
              </Button>
              <Button 
                variant={isOpen ? "destructive" : "default"} 
                className={`flex-1 ${!isOpen && "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
                onClick={executeToggleStatus}
              >
                Ya, Lanjutkan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
