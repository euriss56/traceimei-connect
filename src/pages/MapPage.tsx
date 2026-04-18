import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Download, AlertCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getQuartierCoords, statutToType, type IncidentType } from "@/lib/quartiers";

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
const colorMap: Record<IncidentType, string> = {
  vole: "text-destructive",
  suspect: "text-warning",
  legitime: "text-success",
};

interface Signalement {
  id: string;
  reference: string;
  imei: string;
  quartier: string;
  date_vol: string;
  statut: "ouvert" | "en_cours" | "resolu";
}

interface IncidentGroup {
  quartier: string;
  type: IncidentType;
  count: number;
  lat: number;
  lng: number;
  references: string[];
}

export default function MapPage() {
  const [period, setPeriod] = useState("30");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch + realtime subscription
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - parseInt(period, 10));

      const { data, error } = await supabase
        .from("signalements_vol")
        .select("id, reference, imei, quartier, date_vol, statut")
        .gte("date_vol", since.toISOString())
        .order("date_vol", { ascending: false });

      if (!active) return;

      if (error) {
        toast({
          title: "Erreur de chargement",
          description: error.message,
          variant: "destructive",
        });
        setSignalements([]);
      } else {
        setSignalements((data ?? []) as Signalement[]);
      }
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("signalements-map")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "signalements_vol" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [period, toast]);

  // Agrégation par quartier + statut
  const groups = useMemo<IncidentGroup[]>(() => {
    const map = new Map<string, IncidentGroup>();
    signalements.forEach((s) => {
      const type = statutToType(s.statut);
      const key = `${s.quartier}::${type}`;
      const coords = getQuartierCoords(s.quartier);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (existing.references.length < 5) existing.references.push(s.reference);
      } else {
        map.set(key, {
          quartier: s.quartier || "Inconnu",
          type,
          count: 1,
          lat: coords.lat,
          lng: coords.lng,
          references: [s.reference],
        });
      }
    });
    return Array.from(map.values());
  }, [signalements]);

  // Résumé par quartier (somme des incidents toutes catégories)
  const summary = useMemo(() => {
    const byQuartier = new Map<string, { quartier: string; types: Map<IncidentType, number>; total: number }>();
    groups.forEach((g) => {
      const entry = byQuartier.get(g.quartier) ?? {
        quartier: g.quartier,
        types: new Map(),
        total: 0,
      };
      entry.types.set(g.type, (entry.types.get(g.type) ?? 0) + g.count);
      entry.total += g.count;
      byQuartier.set(g.quartier, entry);
    });
    return Array.from(byQuartier.values()).sort((a, b) => b.total - a.total);
  }, [groups]);

  const handleExport = () => {
    const csv = [
      "reference,imei,quartier,date_vol,statut",
      ...signalements.map((s) =>
        [s.reference, s.imei, s.quartier, s.date_vol, s.statut].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signalements-${period}j-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
            <Button variant="outline" size="sm" onClick={handleExport} disabled={signalements.length === 0}>
              <Download className="h-4 w-4 mr-1" /> Exporter
            </Button>
          </div>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4 text-sm flex-wrap">
          {(Object.keys(labelMap) as IncidentType[]).map((key) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: pinColors[key] }}
              />
              <span className="text-muted-foreground">{labelMap[key]}</span>
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">
            {signalements.length} signalement(s) sur {period}j
          </span>
        </div>

        {/* Carte Leaflet */}
        <div className="glass-card overflow-hidden rounded-xl">
          {!mounted || loading ? (
            <Skeleton className="h-[450px] w-full" />
          ) : (
            <MapContainer
              key="incidents-map"
              center={[6.3654, 2.4183]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "450px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {groups.map((g, i) => (
                <CircleMarker
                  key={`${g.quartier}-${g.type}-${i}`}
                  center={[g.lat, g.lng]}
                  radius={10 + g.count * 3}
                  pathOptions={{
                    color: pinColors[g.type],
                    fillColor: pinColors[g.type],
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm space-y-1">
                      <p className="font-bold">{g.quartier}</p>
                      <p>{labelMap[g.type]}</p>
                      <p className="text-xs">{g.count} incident(s) — {period}j</p>
                      {g.references.length > 0 && (
                        <div className="text-xs pt-1 border-t border-border mt-1">
                          <p className="font-semibold">Références :</p>
                          <ul className="font-mono">
                            {g.references.map((ref) => (
                              <li key={ref}>• {ref}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : summary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Aucun signalement sur les {period} derniers jours
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {summary.map((entry) => (
                <div
                  key={entry.quartier}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0 flex-wrap gap-2"
                >
                  <span className="font-medium text-foreground">{entry.quartier}</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {Array.from(entry.types.entries()).map(([type, count]) => (
                      <span key={type} className={`text-sm ${colorMap[type]}`}>
                        {labelMap[type]} ({count})
                      </span>
                    ))}
                    <span className="text-sm font-mono text-muted-foreground">
                      Total : {entry.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Données anonymisées — localisation au niveau quartier uniquement, jamais d'adresse exacte
        </p>
      </div>
    </DashboardLayout>
  );
}
