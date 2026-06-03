"use client";

import { useEffect, useState } from "react";
import { Loader2, Store, MapPin, Clock, Info } from "lucide-react";
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

  // Form states
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

  async function handleToggleStatus() {
    if (!profile) return;
    
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
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Status Operasional</span>
            <span className={`text-sm font-bold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
              {isOpen ? "BUKA" : "TUTUP"}
            </span>
          </div>
          <Button
            onClick={handleToggleStatus}
            variant={isOpen ? "destructive" : "default"}
            className={isOpen ? "" : "bg-green-600 hover:bg-green-700"}
          >
            {isOpen ? "Tutup Restoran" : "Buka Restoran"}
          </Button>
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
                <Label htmlFor="name">Nama Restoran (Tidak dapat diubah)</Label>
                <Input id="name" value={profile.name} disabled className="bg-slate-50" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Alamat (Tidak dapat diubah)</Label>
                <Input id="address" value={profile.address} disabled className="bg-slate-50" />
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
        </div>
      </div>
    </main>
  );
}
