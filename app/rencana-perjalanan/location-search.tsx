"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";

export type LocationResult = {
  lat: number;
  lng: number;
  label: string;
};

interface LocationSearchProps {
  placeholder?: string;
  onSelectLocation: (loc: LocationResult | null) => void;
  defaultValue?: string;
  onGetLocation?: () => void;
  className?: string;
  inputClassName?: string;
}

export function LocationSearch({ placeholder = "Cari lokasi...", onSelectLocation, defaultValue = "", onGetLocation, className = "", inputClassName = "" }: LocationSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      setQuery(defaultValue);
    }
  }, [defaultValue]);

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
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground/60" />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`h-14 w-full rounded-2xl border-transparent bg-transparent pl-11 pr-14 text-sm font-medium focus-visible:ring-0 focus-visible:border-transparent focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 ${inputClassName}`}
        />
        <div className="absolute right-3 flex items-center gap-1">
          {query && (
            <button 
              onClick={handleClear}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-border/50 text-xs font-bold text-muted-foreground hover:bg-border"
              title="Hapus"
            >
              ✕
            </button>
          )}
          {!query && onGetLocation && (
            <button 
              onClick={onGetLocation}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground/60 hover:text-primary hover:bg-muted transition-colors"
              title="Gunakan Lokasi Saat Ini"
            >
              <Navigation className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isOpen && (query.length > 2) && (
        <div className="absolute z-[9999] left-0 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl p-1.5 shadow-2xl">
          {isSearching ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground/80">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mencari...
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelect(item)}
                className="flex w-full items-start gap-2 rounded-lg p-2 text-left hover:bg-muted/30"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground/90 line-clamp-2">{item.display_name}</span>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground/80">
              Lokasi tidak ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
