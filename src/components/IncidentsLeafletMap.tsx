import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { IncidentType } from "@/lib/quartiers";

export interface MapIncident {
  quartier: string;
  type: IncidentType;
  count: number;
  lat: number;
  lng: number;
  references: string[];
}

interface Props {
  incidents: MapIncident[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  period: string;
}

const pinColors: Record<IncidentType, string> = {
  vole: "#E74C3C",
  suspect: "#F39C12",
  legitime: "#27AE60",
};
const labelMap: Record<IncidentType, string> = {
  vole: "🔴 Volé signalé",
  suspect: "🟠 Suspect / en cours",
  legitime: "🟢 Récupéré",
};

/**
 * Wrapper Leaflet "vanilla" — évite l'incompatibilité de react-leaflet
 * avec la version actuelle de React. Plus stable et plus léger.
 */
export default function IncidentsLeafletMap({
  incidents,
  center = [6.3654, 2.4183],
  zoom = 13,
  height = 450,
  period,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Init map (une seule fois)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    try {
      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      // Fix taille après montage (sinon tuiles grises)
      setTimeout(() => map.invalidateSize(), 100);
    } catch (e) {
      console.error("Leaflet init error:", e);
    }

    return () => {
      try {
        mapRef.current?.remove();
      } catch (e) {
        console.warn("Leaflet cleanup:", e);
      }
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers quand incidents changent
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    incidents.forEach((g) => {
      if (!Number.isFinite(g.lat) || !Number.isFinite(g.lng)) return;
      const marker = L.circleMarker([g.lat, g.lng], {
        radius: 10 + g.count * 3,
        color: pinColors[g.type],
        fillColor: pinColors[g.type],
        fillOpacity: 0.6,
        weight: 2,
      });
      const refsHtml =
        g.references.length > 0
          ? `<div style="font-size:11px;padding-top:4px;border-top:1px solid #eee;margin-top:4px;">
               <div style="font-weight:600;">Références :</div>
               <ul style="font-family:monospace;margin:0;padding-left:14px;">
                 ${g.references.map((r) => `<li>${r}</li>`).join("")}
               </ul>
             </div>`
          : "";
      marker.bindPopup(
        `<div style="font-size:13px;line-height:1.4;">
           <div style="font-weight:700;">${g.quartier}</div>
           <div>${labelMap[g.type]}</div>
           <div style="font-size:11px;">${g.count} incident(s) — ${period}j</div>
           ${refsHtml}
         </div>`
      );
      marker.addTo(layer);
    });
  }, [incidents, period]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px`, width: "100%" }}
      aria-label="Carte des incidents"
    />
  );
}
