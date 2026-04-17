import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";
import StatusBadge from "@/components/StatusBadge";
import { formatIMEI } from "@/lib/imei";
import type { IMEIVerificationResult, IMEIStatut } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentRow {
  id: string;
  imei: string;
  statut: IMEIStatut;
  date: string;
}

export default function DashboardDealer() {
  const { user } = useAuth();
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [weekStats, setWeekStats] = useState({ total: 0, suspects: 0, voles: 0, legitimes: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Activité récente (10 dernières)
    const { data: recentData } = await supabase
      .from("enregistrements_imei")
      .select("id, imei, resultat, date_verification")
      .eq("utilisateur_id", user.id)
      .order("date_verification", { ascending: false })
      .limit(10);

    setRecent(
      (recentData ?? []).map((r) => ({
        id: r.id,
        imei: r.imei,
        statut: r.resultat,
        date: r.date_verification,
      }))
    );

    // Stats sur 7 jours
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: weekData } = await supabase
      .from("enregistrements_imei")
      .select("resultat")
      .eq("utilisateur_id", user.id)
      .gte("date_verification", since);

    const total = weekData?.length ?? 0;
    const suspects = weekData?.filter((r) => r.resultat === "suspect").length ?? 0;
    const voles = weekData?.filter((r) => r.resultat === "vole").length ?? 0;
    const legitimes = weekData?.filter((r) => r.resultat === "legitime").length ?? 0;
    setWeekStats({ total, suspects, voles, legitimes });

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResult = (_result: IMEIVerificationResult) => {
    // Recharger après chaque scan
    loadData();
  };

  const tauxProprete = weekStats.total > 0 ? Math.round((weekStats.legitimes / weekStats.total) * 100) : 0;

  return (
    <DashboardLayout role="dealer">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Zone 1: Quick Scan */}
        <div className="glass-card p-5">
          <h1 className="font-heading font-bold text-xl text-foreground mb-4">🔍 Scan IMEI rapide</h1>
          <IMEIScanner onResult={handleResult} />
        </div>

        {/* Zone 2: Recent Activity */}
        <div className="glass-card p-5">
          <h2 className="font-heading font-semibold text-foreground mb-3">Activité récente</h2>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Aucune vérification pour l'instant. Lance ton premier scan !</p>
          ) : (
            <div className="space-y-2">
              {recent.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-mono text-sm text-foreground">{formatIMEI(r.imei)}</span>
                  <div className="flex items-center gap-3">
                    <StatusBadge statut={r.statut} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(r.date), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone 3: Weekly Stats */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Stats sur 7 jours</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-heading font-bold text-foreground">{weekStats.total}</p>
              <p className="text-xs text-muted-foreground">Vérifications</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-heading font-bold text-warning">{weekStats.suspects + weekStats.voles}</p>
              <p className="text-xs text-muted-foreground">Suspects/Volés</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-heading font-bold text-success">{tauxProprete}%</p>
              <p className="text-xs text-muted-foreground">Taux propreté</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
