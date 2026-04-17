import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { formatIMEI } from "@/lib/imei";
import type { IMEIStatut } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Inbox } from "lucide-react";

interface Row {
  id: string;
  imei: string;
  resultat: IMEIStatut;
  score_anomalie: number;
  date_verification: string;
  marque?: string;
  modele?: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [statutFilter, setStatutFilter] = useState<"all" | IMEIStatut>("all");
  const [periodFilter, setPeriodFilter] = useState<"7" | "30" | "90" | "all">("30");

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      setLoading(true);
      let query = supabase
        .from("enregistrements_imei")
        .select("id, imei, resultat, score_anomalie, date_verification")
        .eq("utilisateur_id", user.id)
        .order("date_verification", { ascending: false })
        .limit(200);

      if (statutFilter !== "all") query = query.eq("resultat", statutFilter);
      if (periodFilter !== "all") {
        const days = parseInt(periodFilter, 10);
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("date_verification", since);
      }

      const { data, error } = await query;
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Enrich with appareils info
      const imeis = [...new Set((data ?? []).map((d) => d.imei))];
      let appareilsMap: Record<string, { marque: string; modele: string }> = {};
      if (imeis.length > 0) {
        const { data: app } = await supabase
          .from("appareils")
          .select("imei, marque, modele")
          .in("imei", imeis);
        appareilsMap = Object.fromEntries((app ?? []).map((a) => [a.imei, { marque: a.marque, modele: a.modele }]));
      }

      setRows(
        (data ?? []).map((d) => ({
          ...d,
          marque: appareilsMap[d.imei]?.marque,
          modele: appareilsMap[d.imei]?.modele,
        }))
      );
      setLoading(false);
    };
    fetchHistory();
  }, [user, statutFilter, periodFilter]);

  return (
    <DashboardLayout role="dealer">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-heading font-bold text-2xl text-foreground">📋 Historique des vérifications</h1>
          <div className="flex gap-2">
            <Select value={periodFilter} onValueChange={(v) => setPeriodFilter(v as typeof periodFilter)}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 jours</SelectItem>
                <SelectItem value="30">30 jours</SelectItem>
                <SelectItem value="90">90 jours</SelectItem>
                <SelectItem value="all">Tout</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statutFilter} onValueChange={(v) => setStatutFilter(v as typeof statutFilter)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="legitime">Légitime</SelectItem>
                <SelectItem value="suspect">Suspect</SelectItem>
                <SelectItem value="vole">Volé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement…
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Inbox className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucune vérification sur cette période.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-semibold text-foreground">IMEI</th>
                    <th className="text-left p-3 font-semibold text-foreground">Appareil</th>
                    <th className="text-left p-3 font-semibold text-foreground">Statut</th>
                    <th className="text-left p-3 font-semibold text-foreground">Score</th>
                    <th className="text-left p-3 font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((h) => (
                    <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-foreground">{formatIMEI(h.imei)}</td>
                      <td className="p-3 text-muted-foreground">{h.marque ? `${h.marque} ${h.modele ?? ""}` : "—"}</td>
                      <td className="p-3"><StatusBadge statut={h.resultat} size="sm" /></td>
                      <td className="p-3 font-mono text-foreground">{Number(h.score_anomalie).toFixed(2)}</td>
                      <td className="p-3 text-muted-foreground">{new Date(h.date_verification).toLocaleString("fr-FR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
