"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2 } from "lucide-react";

export type LocationResult = {
  lat: number;
  lng: number;
  label: string;
};

interface LocationSearchProps {
  placeholder?: string;
  onSelectLocation: (loc: LocationResult | null) => void;
  defaultValue?: string;
}

export function LocationSearch({ placeholder = "Cari lokasi...", onSelectLocation, defaultValue = "" }: LocationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tutup dropdown jika klik di luar
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(async () => {
      if (query.length > 2 && isOpen) {
        setIsSearching(true);
        try {
          const searchQuery = query.toLowerCase().includes("malang") ? query : `${query} Malang`;
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=id`);
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error("Geocoding error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (item: any) => {
    const loc: LocationResult = {
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      label: item.display_name,
    };
    setQuery(item.display_name);
    setIsOpen(false);
    onSelectLocation(loc);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    onSelectLocation(null);
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 pl-9 pr-10 text-sm shadow-sm focus:border-primary focus:ring-primary"
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute right-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-300"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (query.length > 2) && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {isSearching ? (
            <div className="flex items-center justify-center p-4 text-sm text-slate-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mencari...
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-slate-50"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-slate-700 line-clamp-2">{item.display_name}</span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              Lokasi tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
