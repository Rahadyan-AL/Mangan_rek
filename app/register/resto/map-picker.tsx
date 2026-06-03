"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Locate, Loader2 } from "lucide-react";

// Use CDN for Leaflet marker images to fix Next.js 404 errors
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    const container = map.getContainer();
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map]);
  return null;
}

function FlyToMarker({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0.5 });
    }
  }, [position, map]);
  return null;
}

type MapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
};

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
  // Default center: Malang
  const defaultCenter: [number, number] = [-7.9826, 112.6308];
  const markerPosition: [number, number] | null =
    latitude !== null && longitude !== null ? [latitude, longitude] : null;

  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        onLocationSelect(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Gagal mendapatkan lokasi.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Izin akses lokasi ditolak. Silakan izinkan akses lokasi di pengaturan browser Anda.";
        }
        alert(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <MapContainer
        center={markerPosition ?? defaultCenter}
        zoom={13}
        scrollWheelZoom
        zoomControl={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapResizer />
        <FlyToMarker position={markerPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>

      {/* Button to get current location */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        className="absolute right-2 top-2 z-[1000] flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Gunakan Lokasi Saat Ini"
      >
        {isLocating ? (
          <Loader2 className="h-5 w-5 animate-spin text-[#00458B]" />
        ) : (
          <Locate className="h-5 w-5 text-[#00458B]" />
        )}
      </button>

      <div className="pointer-events-none absolute bottom-2 left-2 z-[1000] rounded-md bg-white/90 px-2.5 py-1 text-[11px] text-slate-500 shadow-sm backdrop-blur-sm">
        Klik pada peta untuk memilih lokasi restoran
      </div>
    </div>
  );
}
