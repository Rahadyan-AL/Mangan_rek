"use client";

// React hook untuk menyimpan nilai input durasi dan tampilan itinerary yang dipilih.
import { useState } from "react";

// Leaflet dipakai untuk membuat peta interaktif di panel kanan.
import L from "leaflet";

// Komponen Leaflet untuk merender peta, layer ubin, marker, dan garis rute.
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";

// CSS Leaflet wajib diimpor agar kontrol, marker, dan tile tampil benar.
import "leaflet/dist/leaflet.css";

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

// Import gambar marker bawaan Leaflet supaya icon pin tidak hilang di Next.js.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet perlu konfigurasi icon default karena bundler Next.js tidak selalu menemukannya otomatis.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Use react-leaflet components directly (typed) to avoid `any` usage.

// Koordinat awal dan akhir yang dipakai untuk meniru data Postman.
const itineraryPath: [number, number][] = [
  [-7.9666, 112.6326],
  [-7.9721, 112.6314],
  [-7.9762, 112.6308],
  [-7.9797, 112.6304],
];

// Titik-titik marker yang ingin ditampilkan di peta.
const itineraryMarkers = [
  {
    name: "Bakso President",
    position: [-7.9666, 112.6326] as [number, number],
    time: "12:00 PM",
  },
  {
    name: "Alun-Alun Malang",
    position: [-7.9721, 112.6314] as [number, number],
    time: "02:00 PM",
  },
  {
    name: "Toko Oen",
    position: [-7.9797, 112.6304] as [number, number],
    time: "03:30 PM",
  },
];

// Tipe kecil untuk menjaga struktur data tiap titik perjalanan tetap jelas.
type JourneyStop = {
  // Waktu kunjungan untuk tempat ini.
  time: string;
  // Nama restoran atau destinasi.
  name: string;
  // Penjelasan singkat tempat tersebut.
  description: string;
};

// Data contoh untuk itinerary 4 jam.
const itinerary4Hours: JourneyStop[] = [
  {
    time: "12:00 PM",
    name: "Bakso President",
    description: "Sarapan ringan dengan bakso khas Malang di dekat jalur utama.",
  },
  {
    time: "01:30 PM",
    name: "Alun-Alun Malang",
    description: "Berhenti sebentar untuk istirahat dan menikmati suasana kota.",
  },
  {
    time: "03:00 PM",
    name: "Toko Oen",
    description: "Penutup manis dengan suasana klasik dan menu dessert legendaris.",
  },
];

// Data contoh untuk itinerary 6 jam.
const itinerary6Hours: JourneyStop[] = [
  {
    time: "12:00 PM",
    name: "Bakso President",
    description: "Mulai perjalanan dengan kuliner ikonik yang mudah dijangkau.",
  },
  {
    time: "02:00 PM",
    name: "Alun-Alun Malang",
    description: "Jeda santai sambil eksplor area pusat kota dan foto singkat.",
  },
  {
    time: "03:30 PM",
    name: "Toko Oen",
    description: "Mampir ke tempat klasik untuk minuman dingin dan camilan ringan.",
  },
  {
    time: "05:00 PM",
    name: "Orem-Orem Arema",
    description: "Akhiri itinerary dengan menu tradisional sebelum pulang.",
  },
];

// Helper untuk memilih data itinerary berdasarkan durasi yang dipilih user.
function getItineraryByDuration(duration: number) {
  // Kalau durasi 6 jam, pakai daftar yang lebih panjang.
  if (duration >= 6) {
    return itinerary6Hours;
  }

  // Untuk nilai lain, gunakan versi pendek 4 jam.
  return itinerary4Hours;
}

// Komponen halaman utama untuk rencana perjalanan.
export default function RencanaPerjalananPage() {
  // State untuk menyimpan isi input durasi.
  const [durationInput, setDurationInput] = useState("6");

  // State untuk menyimpan durasi yang benar-benar dipakai saat tombol ditekan.
  const [selectedDuration, setSelectedDuration] = useState(6);

  // Ambil data itinerary sesuai durasi yang dipilih.
  const itinerary = getItineraryByDuration(selectedDuration);

  // Hitung label ringkas untuk badge di panel kiri.
  const durationLabel = `${selectedDuration} Hours`;

  // Konstanta kecil untuk jarak total rute contoh.
  const totalDistance = selectedDuration >= 6 ? "4.2 km" : "2.8 km";

  // Konstanta kecil untuk estimasi waktu total rute contoh.
  const totalTime = selectedDuration >= 6 ? "5h 45m" : "3h 10m";

  // Handler saat tombol generate route ditekan.
  function handleGenerateRoute() {
    // Ubah string input menjadi angka.
    const parsedDuration = Number(durationInput);

    // Kalau input bukan angka valid, pakai default 6 jam.
    if (Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      setSelectedDuration(6);
      return;
    }

    // Simpan durasi terpilih agar itinerary berubah.
    setSelectedDuration(parsedDuration);
  }

  // JSX utama yang membentuk seluruh tampilan halaman.
  return (
    // Pembungkus halaman dengan tinggi penuh dan background lembut.
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Kontainer utama agar isi halaman tetap rapi di tengah layar. */}
      <section className="mx-auto grid w-full max-w-7xl gap-0 px-4 py-4 lg:grid-cols-[360px_1fr] lg:px-6">
        {/* Panel kiri berisi form durasi dan daftar itinerary. */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:rounded-r-none lg:border-r-0">
          {/* Judul besar halaman. */}
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Curated Journeys
          </h1>

          {/* Deskripsi singkat agar user paham fungsi halaman ini. */}
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Tell us how much time you have, and we&apos;ll craft the perfect
            culinary path through Malang.
          </p>

          {/* Label input durasi. */}
          <label htmlFor="duration" className="mt-6 block text-sm font-medium text-slate-800">
            Durasi Waktu (Jam)
          </label>

          {/* Input angka untuk durasi itinerary. */}
          <Input
            id="duration"
            type="number"
            min={1}
            value={durationInput}
            onChange={(event) => setDurationInput(event.target.value)}
            placeholder="e.g. 6"
            className="mt-2 h-12 rounded-xl border-slate-300 bg-slate-50 text-base"
          />

          {/* Tombol untuk membangkitkan itinerary. */}
          <Button
            onClick={handleGenerateRoute}
            className="mt-4 h-12 w-full rounded-xl bg-[#0f3b73] text-base font-semibold text-white hover:bg-[#0b2f5e]"
          >
            Generate Rute
          </Button>

          {/* Garis pemisah visual antara form dan daftar itinerary. */}
          <div className="my-6 h-px w-full bg-slate-200" />

          {/* Header kecil untuk daftar itinerary. */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Your Itinerary</h2>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
              {durationLabel}
            </span>
          </div>

          {/* Daftar titik perjalanan dibuat dengan mapping data. */}
          <div className="mt-4 space-y-5">
            {itinerary.map((stop, index) => (
              // Setiap stop dibungkus dalam row timeline.
              <div key={`${stop.time}-${stop.name}`} className="relative pl-7">
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
                    <CardDescription className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                      {stop.time}
                    </CardDescription>

                    {/* Nama tempat dibuat lebih menonjol. */}
                    <CardTitle className="text-base text-slate-900">
                      {stop.name}
                    </CardTitle>
                  </CardHeader>

                  {/* Isi deskripsi destinasi. */}
                  <CardContent className="px-3 pb-3">
                    <p className="text-xs leading-5 text-slate-600">
                      {stop.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </aside>

        {/* Panel kanan berisi peta dan ringkasan perjalanan. */}
        <div className="relative min-h-180 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:rounded-l-none">
          {/* Container map Leaflet dibuat full size supaya responsif. */}
          <MapContainer
            center={[-7.972, 112.6315]}
            zoom={14}
            scrollWheelZoom
            className="absolute inset-0 z-0 h-full w-full"
          >
            {/* Tile gratis dari OpenStreetMap sebagai layer dasar peta. */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Garis biru yang menandai rute perjalanan. */}
            <Polyline
              positions={itineraryPath}
              pathOptions={{ color: "#2f8bd3", weight: 5 }}
            />

            {/* Marker titik awal, tengah, dan akhir itinerary. */}
            {itineraryMarkers.map((marker) => (
              <Marker key={marker.name} position={marker.position}>
                <Popup>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{marker.name}</p>
                    <p className="text-xs text-slate-600">Waktu kunjungan: {marker.time}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Label status di peta. */}
          <div className="absolute left-6 top-6 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
            Route Optimized for Walking
          </div>

          {/* Card ringkasan total perjalanan di bawah kiri. */}
          <Card className="absolute bottom-6 left-6 w-60 border-slate-200 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 px-4 py-4">
              <CardDescription className="text-sm font-semibold text-slate-700">
                Total Journey
              </CardDescription>
              <CardTitle className="text-sm text-slate-900">
                Ringkasan rute yang dihasilkan.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {/* Baris ringkasan jarak dan waktu. */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Distance</span>
                <span>Est. Time</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm font-semibold text-slate-900">
                <span>{totalDistance}</span>
                <span>{totalTime}</span>
              </div>
              {/* Tombol navigasi simulasi. */}
              <Button className="mt-4 h-10 w-full rounded-lg bg-slate-800 text-sm text-white hover:bg-slate-900">
                Start Navigation
              </Button>
            </CardContent>
          </Card>

          {/* Kontrol visual kecil untuk menjaga kemiripan dengan referensi desain. */}
          <div className="pointer-events-none absolute bottom-8 right-6 flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              +
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
              −
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#0f3b73] shadow-sm ring-1 ring-slate-200">
              ◎
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
