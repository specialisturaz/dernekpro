"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapMarker {
  position: [number, number];
  title: string;
  description?: string;
  href?: string;
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
}

// Marker icon fix (Leaflet default icon issue with bundlers)
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LeafletMap({
  center = [39.0, 35.0],
  zoom = 6,
  markers = [],
  className = "h-[400px] w-full rounded-lg",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    for (const marker of markers) {
      const m = L.marker(marker.position, { icon: defaultIcon }).addTo(map);
      const popupContent = marker.href
        ? `<strong>${marker.title}</strong>${marker.description ? `<br/><span style="font-size:12px">${marker.description}</span>` : ""}<br/><a href="${marker.href}" style="color:#2563eb;font-size:12px">Detay &rarr;</a>`
        : `<strong>${marker.title}</strong>${marker.description ? `<br/><span style="font-size:12px">${marker.description}</span>` : ""}`;
      m.bindPopup(popupContent);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, zoom, markers]);

  return <div ref={mapRef} className={className} />;
}
