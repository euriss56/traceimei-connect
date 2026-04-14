import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const incidents = [
  { quartier: "Missèbo", lat: 6.3654, lng: 2.4183, type: "vole" as const, count: 5 },
  { quartier: "Dantokpa", lat: 6.3616, lng: 2.4260, type: "vole" as const, count: 3 },
  { quartier: "Cadjehoun", lat: 6.3600, lng: 2.3900, type: "suspect" as const, count: 4 },
  { quartier: "Akpakpa", lat: 6.3680, lng: 2.4400, type: "suspect" as const, count: 2 },
  { quartier: "Fidjrossè", lat: 6.3450, lng: 2.3700, type: "legitime" as const, count: 1 },
];

const pinColors = { vole: "#E74C3C", suspect: "#F39C12", legitime: "#27AE60" };
const labelMap = { vole: "🔴 Volé signalé", suspect: "🟠 Suspect", legitime: "🟢 Récupéré" };
const colorMap = { vole: "text-destructive", suspect: "text-warning", legitime: "text-success" };

export default function MapPage() {
  const [period, setPeriod] = useState("30");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <DashboardLayout role="enqueteur">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" /> Carte des Incidents
          </h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 jours</SelectItem>
                <SelectItem value="30">30 jours</SelectItem>
                <SelectItem value="90">3 mois</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Exporter
            </Button>
          </div>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4 text-sm">
          {Object.entries(labelMap).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: pinColors[key as keyof typeof pinColors] }} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Carte Leaflet */}
        <div className="glass-card overflow-hidden rounded-xl">
          {mounted && (
            <MapContainer
              center={[6.3654, 2.4183]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "450px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {incidents.map((inc, i) => (
                <CircleMarker
                  key={i}
                  center={[inc.lat, inc.lng]}
                  radius={10 + inc.count * 3}
                  pathOptions={{
                    color: pinColors[inc.type],
                    fillColor: pinColors[inc.type],
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm space-y-1">
                      <p className="font-bold">{inc.quartier}</p>
                      <p>{labelMap[inc.type]}</p>
                      <p className="text-xs">{inc.count} incident(s) — {period}j</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Résumé par quartier */}
        <div className="glass-card p-5">
          <h2 className="font-heading font-semibold text-foreground mb-3">Résumé par quartier</h2>
          <div className="space-y-2">
            {incidents.map((inc, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="font-medium text-foreground">{inc.quartier}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${colorMap[inc.type]}`}>{labelMap[inc.type]}</span>
                  <span className="text-sm font-mono text-muted-foreground">{inc.count} incident(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Données anonymisées — localisation au niveau quartier uniquement, jamais d'adresse exacte
        </p>
      </div>
    </DashboardLayout>
  );
}
