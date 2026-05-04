"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import L, { type Map as LeafletMap, type Marker as LeafletMarker } from "leaflet";

interface LeafletLocationMapProps {
  latitude?: number;
  longitude?: number;
  onSelect?: (latitude: number, longitude: number) => void;
  zoom?: number;
  height?: number;
}

const DEFAULT_CENTER: [number, number] = [60.1699, 24.9384];

export default function LeafletLocationMap({
  latitude,
  longitude,
  onSelect,
  zoom = 13,
  height = 260,
}: LeafletLocationMapProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<LeafletMap | null>(null);
  const markerRef = React.useRef<LeafletMarker | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    // Fast Refresh can leave stale leaflet id on container; clear it before creating map.
    delete (container as HTMLElement & { _leaflet_id?: string })._leaflet_id;

    const map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(DEFAULT_CENTER, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (onSelect) {
      map.on("click", (event: L.LeafletMouseEvent) => {
        onSelect(event.latlng.lat, event.latlng.lng);
      });
    }

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.off();
        mapRef.current.remove();
        mapRef.current = null;
      }

      markerRef.current = null;

      const containerWithId = container as HTMLElement & { _leaflet_id?: string };
      if (container && containerWithId._leaflet_id) {
        delete containerWithId._leaflet_id;
      }

      container.innerHTML = "";
    };
  }, [onSelect, zoom]);

  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const center: [number, number] = hasCoordinates
    ? [latitude, longitude]
    : DEFAULT_CENTER;

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.setView(center, zoom);

    if (hasCoordinates) {
      if (!markerRef.current) {
        const blueIcon = new L.Icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          shadowSize: [41, 41],
        });
        markerRef.current = L.marker(center, { icon: blueIcon }).addTo(map);
      } else {
        markerRef.current.setLatLng(center);
      }
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [center, hasCoordinates, zoom]);

  return <div ref={containerRef} style={{ height: `${height}px`, width: "100%" }} />;
}
