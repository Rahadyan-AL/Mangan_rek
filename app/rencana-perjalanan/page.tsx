"use client";

// React hook untuk menyimpan nilai input durasi dan tampilan itinerary yang dipilih.
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { LocationSearch, type LocationResult } from "./location-search";

// Komponen tombol dari design system project.
import { Button } from "@/components/ui/button";

// Komponen input dari design system project.
import { Input } from "@/components/ui/input";

// Komponen card untuk membuat panel terlihat rapi dan konsisten.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Dynamic import untuk komponen peta Leaflet — SSR dimatikan karena Leaflet butuh `window`.
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

type RecommendedMenu = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

type ItineraryStop = {
  order: number;
  restaurantId: string;
  restaurantName: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceFromPrev: number;
  travelTimeMinutes: number;
  diningTimeMinutes: number;
  arrivalTimeMinutes: number;
  arrivalTimeLabel: string;
  isPromoActive: boolean;
  discountDisplay: string | null;
  recommendedMenus: RecommendedMenu[];
};

type ItineraryMeta = {
  totalStops: number;
  durationHours: number;
  startCoordinate: { lat: number; lng: number };
  endCoordinate: { lat: number; lng: number };
};

const DESTINATIONS = [
  { label: "Pilih Tujuan Akhir", value: "" },
  { label: "Alun-Alun Malang", lat: -7.9826, lng: 112.6308 },
  { label: "Stasiun Kota Baru Malang", lat: -7.9774, lng: 112.6370 },
  { label: "Universitas Brawijaya", lat: -7.9525, lng: 112.6135 },
  { label: "Balai Kota Malang", lat: -7.9786, lng: 112.6341 },
];

export default function RencanaPerjalananPage() {
  const [startLoc, setStartLoc] = useState<LocationResult | null>(null);
  const [endLoc, setEndLoc] = useState<LocationResult | null>(null);
  const [durationInput, setDurationInput] = useState("4");
  const [isLoading, setIsLoading] = useState(false);
  
  const [itinerary, setItinerary] = useState<ItineraryStop[]>([]);
  const [meta, setMeta] = useState<ItineraryMeta | null>(null);
  const [durationLabel, setDurationLabel] = useState("");
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [resetKey, setResetKey] = useState(0);

  function handleGetLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung oleh browser Anda.");
      return;
    }
    
    // Fallback timer just in case geolocation hangs
    const timeoutId = setTimeout(() => {
      setStartLoc({ lat: -7.9826, lng: 112.6308, label: "Pusat Kota Malang (Default)" });
      toast.warning("Pencarian lokasi memakan waktu terlalu lama. Menggunakan lokasi default (Pusat Kota Malang).");
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        setStartLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Lokasi Saya Saat Ini" });
        toast.success("Berhasil mendapatkan lokasi Anda.");
      },
      (err) => {
        clearTimeout(timeoutId);
        setStartLoc({ lat: -7.9826, lng: 112.6308, label: "Pusat Kota Malang (Default)" });
        
        let reason = "Penyebab tidak diketahui.";
        if (err.code === err.PERMISSION_DENIED) {
          reason = "Izin ditolak. Pada Mac, pastikan System Settings > Privacy & Security > Location Services mengizinkan browser Anda.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reason = "Informasi lokasi tidak tersedia (kemungkinan tidak ada sinyal Wi-Fi/GPS).";
        } else if (err.code === err.TIMEOUT) {
          reason = "Waktu pencarian lokasi habis.";
        }
        
        toast.error(`Gagal mendapatkan lokasi. Kode: ${err.code}. ${reason} Pesan sistem: ${err.message}`, { duration: 10000 });
      },
      { timeout: 8000 }
    );
  }

  // Session storage sync
  useEffect(() => {
    const savedItin = sessionStorage.getItem("manganrek-itin-data");
    if (savedItin) {
      try {
        const parsed = JSON.parse(savedItin);
        if (parsed.startLoc) setStartLoc(parsed.startLoc);
        if (parsed.endLoc) setEndLoc(parsed.endLoc);
        if (parsed.durationInput) setDurationInput(parsed.durationInput);
        if (parsed.itinerary) setItinerary(parsed.itinerary);
        if (parsed.meta) setMeta(parsed.meta);
        if (parsed.durationLabel) setDurationLabel(parsed.durationLabel);
        if (parsed.routePath) setRoutePath(parsed.routePath);
      } catch (e) {
        console.error("Failed to parse saved itinerary state");
      }
    }
  }, []);

  useEffect(() => {
    if (meta && itinerary.length > 0) {
      const stateToSave = { startLoc, endLoc, durationInput, itinerary, meta, durationLabel, routePath };
      sessionStorage.setItem("manganrek-itin-data", JSON.stringify(stateToSave));
    }
  }, [startLoc, endLoc, durationInput, itinerary, meta, durationLabel, routePath]);

  function handleReset() {
    setStartLoc(null);
    setEndLoc(null);
    setDurationInput("4");
    setItinerary([]);
    setMeta(null);
    setDurationLabel("");
    setRoutePath([]);
    sessionStorage.removeItem("manganrek-itin-data");
    setResetKey(prev => prev + 1);
  }

  async function handleGenerateRoute() {
    if (!startLoc) {
      toast.warning("Silakan tentukan Lokasi Awal terlebih dahulu.");
      return;
    }
    if (!endLoc) {
      toast.warning("Silakan pilih Tujuan Akhir terlebih dahulu.");
      return;
    }
    const parsedDuration = Number(durationInput);

    if (Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      toast.error("Durasi waktu tidak valid.");
      return;
    }

    setIsLoading(true);
    setRoutePath([]);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${baseUrl}/api/itinerary?startLat=${startLoc.lat}&startLng=${startLoc.lng}&endLat=${endLoc.lat}&endLng=${endLoc.lng}&duration=${parsedDuration}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setItinerary(data.data);
        setMeta(data.meta);
        setDurationLabel(`${data.meta.durationHours} Jam, ${data.meta.totalStops} Tempat`);
        toast.success("Rute perjalanan berhasil dibuat!");

        // Ambil rute mengikuti jalan (OSRM)
        try {
          const waypoints = [];
          waypoints.push(`${data.meta.startCoordinate.lng},${data.meta.startCoordinate.lat}`);
          data.data.forEach((stop: ItineraryStop) => waypoints.push(`${stop.longitude},${stop.latitude}`));
          waypoints.push(`${data.meta.endCoordinate.lng},${data.meta.endCoordinate.lat}`);

          const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${waypoints.join(';')}?overview=full&geometries=geojson`);
          const osrmData = await osrmRes.json();
          if (osrmData.routes && osrmData.routes.length > 0) {
            // OSRM returns GeoJSON coordinates in [lng, lat]. Leaflet Polyline expects [lat, lng].
            const path = osrmData.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            setRoutePath(path);
          }
        } catch (e) {
          console.error("OSRM Error:", e);
        }

      } else {
        toast.error("Gagal membuat rencana perjalanan: " + (data.message || "Unknown Error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan saat mengambil rencana perjalanan.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartNavigation() {
    if (!meta || itinerary.length === 0) return;
    const origin = `${meta.startCoordinate.lat},${meta.startCoordinate.lng}`;
    const destination = `${meta.endCoordinate.lat},${meta.endCoordinate.lng}`;
    const waypoints = itinerary.map(stop => `${stop.latitude},${stop.longitude}`).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;
    window.open(url, "_blank");
  }

  // Siapkan marker untuk LeafletMap
  const mapMarkers = [];
  if (meta) {
    mapMarkers.push({
      id: "start",
      name: "Titik Awal Anda",
      position: [meta.startCoordinate.lat, meta.startCoordinate.lng] as [number, number],
      timeLabel: "Mulai Perjalanan",
    });
  }
  itinerary.forEach(stop => {
    mapMarkers.push({
      id: stop.restaurantId,
      name: stop.restaurantName,
      position: [stop.latitude, stop.longitude] as [number, number],
      timeLabel: stop.arrivalTimeLabel,
    });
  });
  if (meta) {
    mapMarkers.push({
      id: "end",
      name: endLoc?.label || "Titik Akhir",
      position: [meta.endCoordinate.lat, meta.endCoordinate.lng] as [number, number],
      timeLabel: `Tiba setelah ${meta.durationHours} jam`,
    });
  }

  const hasRoute = itinerary.length > 0;

  // JSX utama yang membentuk seluruh tampilan halaman.
  return (
    // Pembungkus halaman dengan tinggi penuh dan background lembut.
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Kontainer utama agar isi halaman tetap rapi di tengah layar. */}
      <section className={`mx-auto w-full px-4 py-4 lg:px-6 ${hasRoute ? 'max-w-7xl grid gap-0 lg:grid-cols-[360px_1fr]' : 'max-w-md flex flex-col pt-12'}`}>
        {/* Panel kiri berisi form durasi dan daftar itinerary. */}
        <aside className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm w-full ${hasRoute ? 'lg:rounded-r-none lg:border-r-0' : ''}`}>
          {/* Judul besar halaman. */}
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Curated Journeys
          </h1>

          {/* Deskripsi singkat agar user paham fungsi halaman ini. */}
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Tell us how much time you have, and we&apos;ll craft the perfect
            culinary path through Malang.
          </p>

          {/* Form UI */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800">Lokasi Awal</label>
              <div className="mt-2 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleGetLocation} 
                  className="w-full justify-start text-left h-12 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  {startLoc ? `✅ ${startLoc.label || "Lokasi Tersimpan"} (${startLoc.lat.toFixed(3)}, ${startLoc.lng.toFixed(3)})` : "📍 Gunakan Lokasi Saat Ini"}
                </Button>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">ATAU</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <LocationSearch 
                  key={`start-${resetKey}`}
                  placeholder="Ketik lokasi awal..." 
                  onSelectLocation={setStartLoc}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-800">Lokasi Tujuan</label>
              <div className="mt-2">
                <LocationSearch 
                  key={`end-${resetKey}`}
                  placeholder="Ketik lokasi tujuan..." 
                  onSelectLocation={setEndLoc}
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-slate-800">Durasi Waktu (Jam)</label>
              <Input
                id="duration"
                type="number"
                min={1}
                value={durationInput}
                onChange={(event) => setDurationInput(event.target.value)}
                placeholder="e.g. 4"
                className="mt-2 h-12 rounded-xl border-slate-300 bg-slate-50 text-base"
              />
            </div>
          </div>

          {/* Tombol untuk membangkitkan itinerary. */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleGenerateRoute}
              disabled={isLoading}
              className="h-12 flex-1 rounded-xl bg-[#0f3b73] text-base font-semibold text-white hover:bg-[#0b2f5e]"
            >
              {isLoading ? "Membuat Rute..." : "Generate Rute"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-12 px-6 rounded-xl text-slate-700 border-slate-300 hover:bg-slate-50 font-semibold shadow-sm"
            >
              Reset Data
            </Button>
          </div>

          {hasRoute && (
            <>
              {/* Garis pemisah visual antara form dan daftar itinerary. */}
              <div className="my-6 h-px w-full bg-slate-200" />

              {/* Card ringkasan total perjalanan diletakkan di atas daftar. */}
              {meta && (
                <Card className="mb-6 border-slate-200 bg-slate-50 shadow-sm">
                  <CardHeader className="space-y-1 px-4 py-4">
                    <CardDescription className="text-sm font-semibold text-slate-700">
                      Total Journey
                    </CardDescription>
                    <CardTitle className="text-sm text-slate-900">
                      Ringkasan rute yang dihasilkan.
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Destinasi</span>
                      <span>Est. Time</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm font-semibold text-slate-900">
                      <span>{meta.totalStops} Tempat</span>
                      <span>{meta.durationHours} Jam</span>
                    </div>
                    <Button 
                      onClick={handleStartNavigation}
                      className="mt-4 h-10 w-full rounded-lg bg-slate-800 text-sm text-white hover:bg-slate-900"
                    >
                      Start Navigation
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Header kecil untuk daftar itinerary. */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Your Itinerary</h2>
                {durationLabel && (
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                    {durationLabel}
                  </span>
                )}
              </div>

              {/* Daftar titik perjalanan dibuat dengan mapping data. */}
              <div className="mt-4 space-y-5">
                {itinerary.map((stop, index) => (
                  // Setiap stop dibungkus dalam row timeline.
                  <div key={stop.restaurantId} className="relative pl-7">
                    {/* Titik di sisi kiri sebagai penanda timeline. */}
                    <span className="absolute left-0 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0f3b73] bg-white">
                      <span className="h-2 w-2 rounded-full bg-[#0f3b73]" />
                    </span>

                    {/* Garis vertikal timeline hanya muncul di item yang bukan terakhir. */}
                    {index !== itinerary.length - 1 ? (
                      <span className="absolute left-2.25 top-7 h-full w-px bg-slate-200" />
                    ) : null}

                    {/* Card kecil untuk detail satu destinasi. */}
                    <Card className="border-slate-200 bg-slate-50 shadow-none">
                      <CardHeader className="space-y-1 px-3 py-3">
                        {/* Waktu kunjungan ditulis paling atas. */}
                        <CardDescription className="flex justify-between items-center text-xs font-semibold uppercase tracking-wide text-orange-700">
                          <span>Tiba: {stop.arrivalTimeLabel}</span>
                          <span className="text-[10px] text-slate-500 font-medium normal-case">⏳ {stop.diningTimeMinutes} menit</span>
                        </CardDescription>

                        {/* Nama tempat dibuat lebih menonjol dan bisa diklik. */}
                        <Link href={`/restaurants/restaurants-detail?restaurantId=${stop.restaurantId}`}>
                          <CardTitle className="text-base text-slate-900 hover:text-primary transition-colors cursor-pointer">
                            {stop.restaurantName}
                          </CardTitle>
                        </Link>
                      </CardHeader>

                      {/* Isi deskripsi destinasi. */}
                      <CardContent className="px-3 pb-3 space-y-3">
                        <p className="text-xs leading-5 text-slate-600 line-clamp-2">
                          {stop.address}
                        </p>

                        {stop.recommendedMenus && stop.recommendedMenus.length > 0 && (
                          <div className="flex flex-col gap-2 rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Rekomendasi Menu
                            </p>
                            <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                              {stop.recommendedMenus.map(menu => (
                                <Link key={menu.id} href={`/restaurants/menu-detail?restaurantId=${stop.restaurantId}&menuId=${menu.id}`}>
                                  <div className="min-w-[120px] max-w-[120px] flex-shrink-0 space-y-1 hover:opacity-80 transition-opacity cursor-pointer">
                                    <div className="relative h-20 w-full overflow-hidden rounded-lg bg-slate-100">
                                      <img src={menu.image} alt={menu.name} className="h-full w-full object-cover" />
                                    </div>
                                    <p className="truncate text-xs font-semibold text-slate-800">{menu.name}</p>
                                    <p className="text-xs font-bold text-[#0f3b73]">Rp {menu.price.toLocaleString("id-ID")}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Panel kanan berisi peta. */}
        {hasRoute && (
          <div className="relative min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:rounded-l-none">
            {/* Container map Leaflet dibuat full size supaya responsif. */}
            <LeafletMap markers={mapMarkers} routePath={routePath} />
          </div>
        )}
      </section>
    </main>
  );
}
