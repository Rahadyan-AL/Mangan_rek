"use client";

import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export type MapMarker = {
  id: string;
  name: string;
  position: [number, number];
  timeLabel: string;
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
    // Memicu Leaflet untuk menghitung ulang ukurannya setelah render DOM selesai (mengatasi map terpotong/abu-abu).
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [center, map]);
  return null;
}

function CustomMapControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-8 right-6 flex flex-col gap-2 z-[400]">
      <button 
        onClick={(e) => { e.preventDefault(); map.zoomIn(); }}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
      >
        +
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); map.zoomOut(); }}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
      >
        −
      </button>
      <button 
        onClick={(e) => { e.preventDefault(); map.setView([-7.9826, 112.6308], 13); }}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-semibold text-[#0f3b73] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition-colors"
        title="Kembali ke Malang"
      >
        ◎
      </button>
    </div>
  );
}

export default function LeafletMap({ markers, routePath = [] }: { markers: MapMarker[], routePath?: [number, number][] }) {
  const mapCenter: [number, number] = markers.length > 0 ? markers[0].position : [-7.972, 112.6315];
  // Fallback ke garis lurus antar marker jika routePath dari OSRM kosong
  const displayPath = routePath.length > 0 ? routePath : markers.map(m => m.position);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      className="absolute inset-0 z-0 h-full w-full"
    >
      <CustomMapControls />
      <MapUpdater center={mapCenter} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {displayPath.length > 1 && (
        <Polyline
          positions={displayPath}
          pathOptions={{ color: "#2f8bd3", weight: 5 }}
        />
      )}

      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">{marker.name}</p>
              <p className="text-xs text-slate-600">{marker.timeLabel}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
