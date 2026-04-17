import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";
import { BarChart3, MapPin, FileText, Loader2, AlertTriangle, CheckCircle2, Clock, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatIMEI } from "@/lib/imei";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

type Statut = "ouvert" | "en_cours" | "resolu";

interface Signalement {
  id: string;
  reference: string;
  imei: string;
  marque: string;
  modele: string;
  quartier: string;
  date_vol: string;
  statut: Statut;
  created_at: string;
}

const STATUT_LABELS: Record<Statut, string> = {
  ouvert: "Ouvert",
  en_cours: "En cours",
  resolu: "Résolu",
};

const STATUT_COLORS: Record<Statut, string> = {
  ouvert: "hsl(var(--destructive))",
  en_cours: "hsl(var(--warning))",
  resolu: "hsl(var(--success))",
};

export default function DashboardEnqueteur() {
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("signalements_vol")
      .select("id, reference, imei, marque, modele, quartier, date_vol, statut, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erreur chargement signalements");
    } else {
      setSignalements((data ?? []) as Signalement[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    // Realtime
    const channel = supabase
      .channel("signalements_enqueteur")
      .on("postgres_changes", { event: "*", schema: "public", table: "signalements_vol" }, () => loadData())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  const updateStatut = async (id: string, nouveauStatut: Statut, imei: string) => {
    setUpdating(id);
    const { error } = await supabase
      .from("signalements_vol")
      .update({ statut: nouveauStatut })
      .eq("id", id);

    if (error) {
      toast.error("Erreur : " + error.message);
      setUpdating(null);
      return;
    }

    // Si résolu, marquer l'appareil comme legitime
    if (nouveauStatut === "resolu") {
      await supabase
        .from("appareils")
        .update({ statut: "legitime", score_anomalie: 0.1 })
        .eq("imei", imei);
    }

    toast.success(`Statut mis à jour : ${STATUT_LABELS[nouveauStatut]}`);
    setUpdating(null);
  };

  // Stats
  const ouverts = signalements.filter((s) => s.statut === "ouvert").length;
  const enCours = signalements.filter((s) => s.statut === "en_cours").length;
  const resolus = signalements.filter((s) => s.statut === "resolu").length;
  const total = signalements.length;
  const tauxResolution = total > 0 ? Math.round((resolus / total) * 100) : 0;

  // Données pour graphiques
  const statutData = [
    { name: "Ouverts", value: ouverts, fill: STATUT_COLORS.ouvert },
    { name: "En cours", value: enCours, fill: STATUT_COLORS.en_cours },
    { name: "Résolus", value: resolus, fill: STATUT_COLORS.resolu },
  ];

  // Hotspots quartiers
  const quartierCounts = signalements.reduce<Record<string, number>>((acc, s) => {
    acc[s.quartier] = (acc[s.quartier] || 0) + 1;
    return acc;
  }, {});
  const quartierData = Object.entries(quartierCounts)
    .map(([name, value]) => ({ name, vols: value }))
    .sort((a, b) => b.vols - a.vols)
    .slice(0, 6);

  // Tendance 30 jours (vols par jour)
  const dailyCounts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dailyCounts[key] = 0;
  }
  signalements.forEach((s) => {
    const key = s.created_at.slice(0, 10);
    if (key in dailyCounts) dailyCounts[key]++;
  });
  const trendData = Object.entries(dailyCounts).map(([date, vols]) => ({
    date: date.slice(5), // MM-DD
    vols,
  }));

  // Liste signalements ouverts (priorité)
  const signalementsOuverts = signalements.filter((s) => s.statut !== "resolu").slice(0, 10);

  const exportCSV = () => {
    const header = "reference,imei,marque,modele,quartier,date_vol,statut\n";
    const rows = signalements
      .map((s) => `${s.reference},${s.imei},${s.marque},${s.modele},${s.quartier},${s.date_vol},${s.statut}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport_enqueteur_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="enqueteur">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-heading font-bold text-2xl text-foreground">📊 Espace Enquêteur</h1>
          <p className="text-sm text-muted-foreground">Données en temps réel · 30 derniers jours</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-heading font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground mt-1">Total signalements</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-heading font-bold text-destructive">{ouverts}</p>
            <p className="text-xs text-muted-foreground mt-1">🔴 Ouverts</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-heading font-bold text-warning">{enCours}</p>
            <p className="text-xs text-muted-foreground mt-1">🟠 En cours</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-heading font-bold text-success">{tauxResolution}%</p>
            <p className="text-xs text-muted-foreground mt-1">🟢 Taux résolution</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Pie statuts */}
          <div className="glass-card p-5">
            <h3 className="font-heading font-semibold text-foreground mb-3">Répartition par statut</h3>
            {total === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={statutData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.value}`}>
                    {statutData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar quartiers hotspots */}
          <div className="glass-card p-5 lg:col-span-2">
            <h3 className="font-heading font-semibold text-foreground mb-3">🔥 Hotspots — Top quartiers</h3>
            {quartierData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Aucune donnée</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={quartierData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="vols" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Trend line */}
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-foreground mb-3">📈 Tendance des signalements (30 jours)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={3} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="vols"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Liste signalements ouverts */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Signalements à traiter ({signalementsOuverts.length})
            </h3>
            <Button variant="outline" size="sm" onClick={exportCSV} disabled={total === 0}>
              <FileText className="h-4 w-4 mr-1" /> Exporter CSV
            </Button>
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement…
            </div>
          ) : signalementsOuverts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucun signalement actif. Bon travail !</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-2 font-semibold">Référence</th>
                    <th className="text-left p-2 font-semibold">IMEI</th>
                    <th className="text-left p-2 font-semibold">Appareil</th>
                    <th className="text-left p-2 font-semibold">Quartier</th>
                    <th className="text-left p-2 font-semibold">Signalé</th>
                    <th className="text-left p-2 font-semibold">Statut</th>
                    <th className="text-left p-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {signalementsOuverts.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-2 font-mono text-primary font-semibold">#{s.reference}</td>
                      <td className="p-2 font-mono text-xs text-muted-foreground">{formatIMEI(s.imei)}</td>
                      <td className="p-2 text-foreground">{s.marque} {s.modele}</td>
                      <td className="p-2 text-foreground">📍 {s.quartier}</td>
                      <td className="p-2 text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(s.created_at), { addSuffix: true, locale: fr })}
                      </td>
                      <td className="p-2">
                        <Badge
                          variant="outline"
                          className={
                            s.statut === "ouvert"
                              ? "border-destructive text-destructive"
                              : "border-warning text-warning"
                          }
                        >
                          {s.statut === "ouvert" ? <AlertTriangle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                          {STATUT_LABELS[s.statut]}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Select
                          value={s.statut}
                          onValueChange={(v) => updateStatut(s.id, v as Statut, s.imei)}
                          disabled={updating === s.id}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ouvert">🔴 Ouvert</SelectItem>
                            <SelectItem value="en_cours">🟠 En cours</SelectItem>
                            <SelectItem value="resolu">🟢 Résolu</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Outils enquêteur */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Vérification rapide</h2>
            <IMEIScanner compact />
          </div>
          <div className="glass-card p-5 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">Actions rapides</h2>
            <div className="space-y-2">
              <Link to="/map">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" /> Carte des incidents
                </Button>
              </Link>
              <Link to="/batch">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" /> Import CSV en lot
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={exportCSV} disabled={total === 0}>
                <FileText className="h-4 w-4 mr-2" /> Exporter rapport ({total})
              </Button>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Récupérés
                  </span>
                  <span className="font-bold text-success">{resolus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
