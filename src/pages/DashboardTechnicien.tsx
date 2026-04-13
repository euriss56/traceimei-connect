import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";
import { Wrench } from "lucide-react";

export default function DashboardTechnicien() {
  return (
    <DashboardLayout role="technicien">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="glass-card p-5">
          <h1 className="font-heading font-bold text-xl text-foreground mb-4">🔧 Espace Technicien</h1>
          <IMEIScanner />
        </div>

        <div className="glass-card p-5">
          <h2 className="font-heading font-semibold text-foreground mb-3">Réparations récentes</h2>
          <div className="space-y-3">
            {[
              { imei: "353325091234560", type: "Écran cassé", date: "12/04/2026" },
              { imei: "861508041234567", type: "Batterie", date: "11/04/2026" },
              { imei: "490154201234568", type: "Connecteur charge", date: "10/04/2026" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-mono text-sm text-foreground">{r.imei}</p>
                  <p className="text-xs text-muted-foreground">{r.type}</p>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
