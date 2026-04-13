import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";
import StatusBadge from "@/components/StatusBadge";
import { formatIMEI } from "@/lib/imei";
import type { IMEIVerificationResult, IMEIStatut } from "@/types";

const mockRecent: { imei: string; statut: IMEIStatut; time: string }[] = [
  { imei: "353325091234560", statut: "legitime", time: "il y a 5 min" },
  { imei: "861508041234567", statut: "vole", time: "il y a 12 min" },
  { imei: "490154201234568", statut: "suspect", time: "il y a 23 min" },
  { imei: "357906111234569", statut: "legitime", time: "il y a 1h" },
  { imei: "354250071234570", statut: "legitime", time: "il y a 2h" },
];

export default function DashboardDealer() {
  const [recentResults, setRecentResults] = useState(mockRecent);

  const handleResult = (result: IMEIVerificationResult) => {
    setRecentResults((prev) => [
      { imei: result.imei, statut: result.statut, time: "à l'instant" },
      ...prev.slice(0, 9),
    ]);
  };

  const total = recentResults.length;
  const suspects = recentResults.filter((r) => r.statut === "suspect").length;
  const legitimes = recentResults.filter((r) => r.statut === "legitime").length;
  const tauxProprete = total > 0 ? Math.round((legitimes / total) * 100) : 0;

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
          <div className="space-y-2">
            {recentResults.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="font-mono text-sm text-foreground">{formatIMEI(r.imei)}</span>
                <div className="flex items-center gap-3">
                  <StatusBadge statut={r.statut} size="sm" />
                  <span className="text-xs text-muted-foreground">{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone 3: Weekly Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-heading font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">Vérifications</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-heading font-bold text-warning">{suspects}</p>
            <p className="text-xs text-muted-foreground">Suspects</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-heading font-bold text-success">{tauxProprete}%</p>
            <p className="text-xs text-muted-foreground">Taux propreté</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
