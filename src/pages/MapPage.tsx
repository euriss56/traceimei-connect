import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Download } from "lucide-react";
import { useState } from "react";

const incidents = [
  { quartier: "Missèbo", lat: 6.3654, lng: 2.4183, type: "vole" as const, count: 5 },
  { quartier: "Dantokpa", lat: 6.3616, lng: 2.4260, type: "vole" as const, count: 3 },
  { quartier: "Cadjehoun", lat: 6.3600, lng: 2.3900, type: "suspect" as const, count: 4 },
  { quartier: "Akpakpa", lat: 6.3680, lng: 2.4400, type: "vole" as const, count: 2 },
  { quartier: "Fidjrossè", lat: 6.3450, lng: 2.3700, type: "legitime" as const, count: 1 },
];

const colorMap = { vole: "text-destructive", suspect: "text-warning", legitime: "text-success" };
const labelMap = { vole: "🔴 Volé", suspect: "🟠 Suspect", legitime: "🟢 Récupéré" };

export default function MapPage() {
  const [period, setPeriod] = useState("30");

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

        {/* Map placeholder — Leaflet would go here */}
        <div className="glass-card overflow-hidden">
          <div className="h-96 bg-accent/30 flex items-center justify-center relative">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-primary mx-auto" />
              <p className="text-foreground font-semibold">Carte interactive — Cotonou, Bénin</p>
              <p className="text-sm text-muted-foreground">Centré sur 6.3654°N, 2.4183°E</p>
              <p className="text-xs text-muted-foreground">Intégration Leaflet.js requise pour la carte interactive</p>
            </div>

            {/* Mock pins overlay */}
            <div className="absolute inset-0 p-8">
              {incidents.map((inc, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${25 + (i % 3) * 20}%`,
                  }}
                >
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-card shadow-md text-xs font-medium ${colorMap[inc.type]}`}>
                    <MapPin className="h-3 w-3" />
                    {inc.quartier} ({inc.count})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incident summary by quartier */}
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
