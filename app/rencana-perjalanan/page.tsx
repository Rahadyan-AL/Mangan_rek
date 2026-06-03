"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { MapPin, Clock, Utensils, Search, Sparkles, Navigation, ArrowRight, ArrowLeft } from "lucide-react";
import { LocationSearch, type LocationResult } from "./location-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

type RecommendedMenu = { id: string; name: string; description: string; price: number; image: string; };
type ItineraryStop = {
  order: number; restaurantId: string; restaurantName: string; address: string; latitude: number; longitude: number;
  distanceFromPrev: number; travelTimeMinutes: number; diningTimeMinutes: number; arrivalTimeMinutes: number;
  arrivalTimeLabel: string; isPromoActive: boolean; discountDisplay: string | null; recommendedMenus: RecommendedMenu[];
};
type ItineraryMeta = { totalStops: number; durationHours: number; startCoordinate: { lat: number; lng: number }; endCoordinate: { lat: number; lng: number }; };

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
  const [isEditMode, setIsEditMode] = useState(false); // Used in Split View to toggle form

  function handleGetLocation() {
    if (!navigator.geolocation) { toast.error("Geolocation tidak didukung oleh browser Anda."); return; }
    const timeoutId = setTimeout(() => {
      setStartLoc({ lat: -7.9826, lng: 112.6308, label: "Pusat Kota Malang (Default)" });
      toast.warning("Pencarian lokasi memakan waktu terlalu lama. Menggunakan lokasi default.");
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
        if (err.code === err.PERMISSION_DENIED) reason = "Izin ditolak. Pada Mac, pastikan System Settings > Privacy & Security > Location Services mengizinkan browser Anda.";
        else if (err.code === err.POSITION_UNAVAILABLE) reason = "Informasi lokasi tidak tersedia (kemungkinan tidak ada sinyal Wi-Fi/GPS).";
        else if (err.code === err.TIMEOUT) reason = "Waktu pencarian lokasi habis.";
        toast.error(`Gagal mendapatkan lokasi. Kode: ${err.code}. ${reason}`);
      },
      { timeout: 8000 }
    );
  }

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
      } catch (e) { console.error("Failed to parse saved itinerary state"); }
    }
  }, []);

  useEffect(() => {
    if (meta && itinerary.length > 0) {
      const stateToSave = { startLoc, endLoc, durationInput, itinerary, meta, durationLabel, routePath };
      sessionStorage.setItem("manganrek-itin-data", JSON.stringify(stateToSave));
    }
  }, [startLoc, endLoc, durationInput, itinerary, meta, durationLabel, routePath]);

  function handleReset() {
    setStartLoc(null); setEndLoc(null); setDurationInput("4");
    setItinerary([]); setMeta(null); setDurationLabel(""); setRoutePath([]);
    sessionStorage.removeItem("manganrek-itin-data");
    setResetKey(prev => prev + 1);
    setIsEditMode(false);
  }

  async function handleGenerateRoute() {
    if (!startLoc) { toast.warning("Silakan tentukan Lokasi Awal terlebih dahulu."); return; }
    if (!endLoc) { toast.warning("Silakan pilih Tujuan Akhir terlebih dahulu."); return; }
    const parsedDuration = Number(durationInput);
    if (Number.isNaN(parsedDuration) || parsedDuration <= 0) { toast.error("Durasi waktu tidak valid."); return; }

    setIsLoading(true); setRoutePath([]);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${baseUrl}/api/itinerary?startLat=${startLoc.lat}&startLng=${startLoc.lng}&endLat=${endLoc.lat}&endLng=${endLoc.lng}&duration=${parsedDuration}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setItinerary(data.data); setMeta(data.meta);
        setDurationLabel(`${data.meta.durationHours} Jam, ${data.meta.totalStops} Tempat`);
        toast.success("Rute perjalanan berhasil dibuat!");
        setIsEditMode(false);

        try {
          const waypoints = [];
          waypoints.push(`${data.meta.startCoordinate.lng},${data.meta.startCoordinate.lat}`);
          data.data.forEach((stop: ItineraryStop) => waypoints.push(`${stop.longitude},${stop.latitude}`));
          waypoints.push(`${data.meta.endCoordinate.lng},${data.meta.endCoordinate.lat}`);
          const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${waypoints.join(';')}?overview=full&geometries=geojson`);
          const osrmData = await osrmRes.json();
          if (osrmData.routes && osrmData.routes.length > 0) {
            const path = osrmData.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
            setRoutePath(path);
          }
        } catch (e) { console.error("OSRM Error:", e); }
      } else { toast.error("Gagal membuat rencana perjalanan: " + (data.message || "Unknown Error")); }
    } catch (err) { console.error(err); toast.error("Terjadi kesalahan jaringan saat mengambil rencana perjalanan."); }
    finally { setIsLoading(false); }
  }

  function handleStartNavigation() {
    if (!meta || itinerary.length === 0) return;
    const origin = `${meta.startCoordinate.lat},${meta.startCoordinate.lng}`;
    const destination = `${meta.endCoordinate.lat},${meta.endCoordinate.lng}`;
    const waypoints = itinerary.map(stop => `${stop.latitude},${stop.longitude}`).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;
    window.open(url, "_blank");
  }

  const mapMarkers = [];
  if (meta) {
    mapMarkers.push({ id: "start", name: "Titik Awal Anda", position: [Number(meta.startCoordinate.lat), Number(meta.startCoordinate.lng)] as [number, number], timeLabel: "Mulai Perjalanan" });
    itinerary.forEach(stop => {
      mapMarkers.push({ id: stop.restaurantId, name: stop.restaurantName, position: [Number(stop.latitude), Number(stop.longitude)] as [number, number], timeLabel: stop.arrivalTimeLabel });
    });
    mapMarkers.push({ id: "end", name: endLoc?.label || "Titik Akhir", position: [Number(meta.endCoordinate.lat), Number(meta.endCoordinate.lng)] as [number, number], timeLabel: `Tiba setelah ${meta.durationHours} jam` });
  }

  const hasRoute = itinerary.length > 0;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      {/* Dynamic Radial Gradient Background for Hero */}
      {!hasRoute && (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70 pointer-events-none" />
      )}

      {/* Main Content Area */}
      <section className={`relative z-10 w-full flex-1 flex flex-col ${hasRoute ? '' : ''}`}>
        
        {!hasRoute ? (
          // ==============================
          // FASE 1: HERO SEARCH
          // ==============================
          <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28 flex flex-col items-center justify-center min-h-[75vh]">
            
            {/* Header Text */}
            <div className="text-center space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm border border-primary/20">
                <Sparkles className="h-4 w-4" />
                <span>Smart Itinerary Planner</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Rancang Rute Kuliner <br className="hidden md:block"/> Sempurna di Malang
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Beri tahu kami dari mana Anda mulai, ke mana tujuan akhir, dan berapa banyak waktu yang Anda miliki. Algoritma kami akan menyusun rute perjalanan yang lezat.
              </p>
            </div>

            {/* Horizontal Glassmorphism Form */}
            <div className="mt-12 w-full max-w-5xl rounded-[2rem] bg-card/60 backdrop-blur-2xl border border-border/60 shadow-2xl p-2 md:p-3 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-both relative z-[100]">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                
                {/* Lokasi Awal */}
                <div className="flex-[1.5] bg-background/60 hover:bg-background/90 transition-colors rounded-xl md:rounded-l-2xl border border-transparent hover:border-border/50 focus-within:bg-background focus-within:border-primary/50 group">
                  <div className="px-5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Lokasi Awal</span>
                  </div>
                  <LocationSearch 
                    key={`start-${resetKey}`}
                    defaultValue={startLoc?.label || ""}
                    placeholder={startLoc ? `${startLoc.label}` : "Di mana Anda sekarang?"}
                    onSelectLocation={setStartLoc}
                    onGetLocation={handleGetLocation}
                    className="w-full" 
                    inputClassName="h-10 text-base font-semibold" 
                  />
                </div>
                
                <div className="hidden md:block w-px h-12 bg-border/60" />
                
                {/* Lokasi Tujuan */}
                <div className="flex-[1.5] bg-background/60 hover:bg-background/90 transition-colors rounded-xl border border-transparent hover:border-border/50 focus-within:bg-background focus-within:border-primary/50">
                  <div className="px-5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Lokasi Tujuan</span>
                  </div>
                  <LocationSearch 
                    key={`end-${resetKey}`}
                    defaultValue={endLoc?.label || ""}
                    placeholder="Ke mana arah tujuan Anda?" 
                    onSelectLocation={setEndLoc}
                    className="w-full" 
                    inputClassName="h-10 text-base font-semibold" 
                  />
                </div>
                
                <div className="hidden md:block w-px h-12 bg-border/60" />
                
                {/* Durasi */}
                <div className="flex-1 relative bg-background/60 hover:bg-background/90 transition-colors rounded-xl md:rounded-r-2xl border border-transparent hover:border-border/50 focus-within:bg-background focus-within:border-primary/50">
                  <div className="px-5 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Durasi Perjalanan</span>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input 
                      type="number" 
                      min={1} 
                      value={durationInput} 
                      onChange={(e) => setDurationInput(e.target.value)}
                      className="h-10 w-full rounded-2xl border-transparent bg-transparent pl-11 text-base font-semibold focus-visible:ring-0 focus-visible:border-transparent focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Jam</span>
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button 
                  onClick={handleGenerateRoute} 
                  disabled={isLoading}
                  className="h-16 w-full md:w-20 rounded-xl md:rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg group ml-auto transition-all hover:shadow-primary/25 hover:shadow-xl shrink-0"
                >
                  {isLoading ? (
                    <span className="animate-pulse text-lg">⏳</span>
                  ) : (
                    <Search className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  )}
                </Button>
              </div>
            </div>

            {/* Feature Narrative Cards */}
            <div className="mt-16 w-full max-w-5xl grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">
              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 shadow-sm text-center space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-foreground text-xl">Rute Otomatis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cukup tentukan titik awal dan akhir. Sistem kami akan mendata area pencarian berdasarkan jalur perjalanan Anda.
                </p>
              </div>
              
              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 shadow-sm text-center space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-foreground text-xl">Manajemen Waktu</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Waktu Anda berharga. Algoritma kami memperhitungkan durasi berkendara dan singgah agar jadwal Anda tertata presisi.
                </p>
              </div>

              <div className="rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 shadow-sm text-center space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Utensils className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-foreground text-xl">Kuliner Pilihan</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nikmati rekomendasi tempat makan terbaik yang otomatis diurutkan searah rute tanpa perlu memutar balik.
                </p>
              </div>
            </div>
            
          </div>
        ) : (
          // ==============================
          // FASE 2: SPLIT VIEW RESULTS
          // ==============================
          <div className="flex flex-col lg:flex-row w-full" style={{ height: 'calc(100vh - 72px)' }}>
             
             {/* LEFT PANEL: TIMELINE & SUMMARY */}
             <div className="w-full lg:w-[480px] xl:w-[550px] flex flex-col h-[50vh] lg:h-full border-r border-border/50 bg-background z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 overflow-hidden">
                
                {/* Header Top Bar */}
                <div className="p-5 border-b border-border/50 bg-card/95 backdrop-blur-xl z-20 shrink-0">
                  {!isEditMode ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Rencana Anda</h2>
                        <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{meta?.totalStops} Tempat</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <Clock className="h-3.5 w-3.5" />
                          <span>{meta?.durationHours} Jam</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsEditMode(true)} className="rounded-full bg-muted/50 hover:bg-muted text-muted-foreground">
                          <Search className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-full bg-red-50 hover:bg-red-100 text-red-600">
                          <span className="font-bold">✕</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-foreground">Ubah Pencarian</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditMode(false)} className="h-8 px-2 text-muted-foreground">Batal</Button>
                      </div>
                      <div className="space-y-3">
                        <LocationSearch placeholder="Lokasi Awal..." onSelectLocation={setStartLoc} defaultValue={startLoc?.label} onGetLocation={handleGetLocation} inputClassName="h-12 bg-muted/30" />
                        <LocationSearch placeholder="Tujuan Akhir..." onSelectLocation={setEndLoc} defaultValue={endLoc?.label} inputClassName="h-12 bg-muted/30" />
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Input type="number" min={1} value={durationInput} onChange={(e) => setDurationInput(e.target.value)} className="h-12 w-full bg-muted/30 pl-4 pr-12 focus-visible:ring-1 focus-visible:border-primary [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="Durasi (Jam)" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">Jam</span>
                          </div>
                          <Button onClick={handleGenerateRoute} disabled={isLoading} className="h-12 flex-[0.8] rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                            {isLoading ? "Update..." : "Update Rute"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scrollable Timeline */}
                {!isEditMode && (
                  <div className="flex-1 overflow-y-auto bg-[#f8f9fc] dark:bg-background/40 relative">
                    {/* Navigation Button Container (Sticky to bottom) */}
                    <div className="sticky bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background/95 to-transparent z-30 pb-8">
                      <Button onClick={handleStartNavigation} className="w-full h-14 rounded-2xl bg-primary text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                        <Navigation className="mr-2 h-5 w-5" />
                        Mulai Navigasi di Maps
                      </Button>
                    </div>

                    <div className="p-6 pb-24 space-y-6">
                      
                      {/* START NODE */}
                      <div className="relative pl-10 flex gap-4">
                        <span className="absolute left-2.5 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-[0_0_0_4px_#f8f9fc]">
                          <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                        </span>
                        <span className="absolute left-[19px] top-7 bottom-[-24px] w-0.5 bg-blue-200" />
                        <div>
                          <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-200 shadow-none mb-1">Titik Awal</Badge>
                          <h4 className="font-bold text-foreground text-lg">{startLoc?.label || "Lokasi Awal"}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">Mulai perjalanan Anda dari sini</p>
                        </div>
                      </div>

                      {/* STOPS */}
                      {itinerary.map((stop, index) => (
                        <div key={stop.restaurantId} className="relative pl-10">
                          {/* Timeline Line */}
                          <span className="absolute left-2.5 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-primary shadow-[0_0_0_4px_#f8f9fc] z-10">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          </span>
                          <span className="absolute left-[19px] top-8 bottom-[-24px] w-0.5 bg-blue-200" />

                          {/* Itinerary Card */}
                          <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl group">
                            <CardHeader className="p-4 pb-2 border-b border-border/30 bg-muted/20">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <Link href={`/restaurants/restaurants-detail?restaurantId=${stop.restaurantId}`}>
                                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                                      {stop.restaurantName}
                                    </CardTitle>
                                  </Link>
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{stop.address}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-sm font-black text-orange-600">
                                    {(() => {
                                      const prevName = index === 0 ? (startLoc?.label || "Awal") : itinerary[index - 1].restaurantName;
                                      const mins = stop.travelTimeMinutes || Math.round(stop.distanceFromPrev / 40 * 60) || 1;
                                      const h = Math.floor(mins / 60);
                                      let m = Math.round(mins % 60);
                                      if (h === 0 && m === 0) m = 1; // Minimal 1 menit
                                      const timeStr = h > 0 ? (m > 0 ? `${h} jam ${m} mnt` : `${h} jam`) : `${m} mnt`;
                                      return `+${timeStr} dari ${prevName}`;
                                    })()}
                                  </div>
                                  <div className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded mt-1">⏳ Singgah {stop.diningTimeMinutes} mnt</div>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-3">
                              {stop.recommendedMenus && stop.recommendedMenus.length > 0 && (
                                <div className="space-y-2.5">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                    Rekomendasi Menu
                                  </p>
                                  <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                    {stop.recommendedMenus.map(menu => (
                                      <Link key={menu.id} href={`/restaurants/menu-detail?restaurantId=${stop.restaurantId}&menuId=${menu.id}`}>
                                        <div className="min-w-[130px] max-w-[130px] flex-shrink-0 group/menu cursor-pointer">
                                          <div className="relative h-24 w-full overflow-hidden rounded-xl border border-border/50">
                                            <img src={menu.image} alt={menu.name} className="h-full w-full object-cover group-hover/menu:scale-105 transition-transform duration-500" />
                                            {stop.discountDisplay && (
                                              <div className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                -{stop.discountDisplay}%
                                              </div>
                                            )}
                                          </div>
                                          <div className="mt-2 space-y-0.5">
                                            <p className="truncate text-xs font-bold text-foreground/90">{menu.name}</p>
                                            <p className="text-xs font-black text-primary">Rp {menu.price.toLocaleString("id-ID")}</p>
                                          </div>
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

                      {/* END NODE */}
                      <div className="relative pl-10 flex gap-4 pt-2">
                        <span className="absolute left-2.5 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-[0_0_0_4px_#f8f9fc]">
                          <MapPin className="h-3 w-3" />
                        </span>
                        <div className="mt-2">
                          <Badge variant="outline" className="bg-green-50/50 text-green-600 border-green-200 shadow-none mb-1">Tujuan Akhir</Badge>
                          <h4 className="font-bold text-foreground text-lg">{endLoc?.label || "Titik Akhir"}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">Perjalanan selesai dalam {meta?.durationHours} Jam</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
             </div>
             
             {/* RIGHT PANEL: MAP */}
             <div className="flex-1 relative h-[50vh] lg:h-auto w-full bg-muted/20 z-0">
                <div className="absolute inset-0">
                  <LeafletMap markers={mapMarkers} routePath={routePath} />
                </div>
             </div>

          </div>
        )}
      </section>
    </main>
  );
}
