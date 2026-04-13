import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { formatIMEI } from "@/lib/imei";
import type { IMEIStatut } from "@/types";

const mockHistory: { imei: string; statut: IMEIStatut; date: string; marque: string; modele: string }[] = [
  { imei: "353325091234560", statut: "legitime", date: "13/04/2026 14:23", marque: "Samsung", modele: "Galaxy A14" },
  { imei: "861508041234567", statut: "vole", date: "13/04/2026 12:05", marque: "Xiaomi", modele: "Redmi Note 12" },
  { imei: "490154201234568", statut: "suspect", date: "12/04/2026 18:30", marque: "Tecno", modele: "Spark 10 Pro" },
  { imei: "357906111234569", statut: "legitime", date: "12/04/2026 09:14", marque: "Apple", modele: "iPhone 13" },
  { imei: "354250071234570", statut: "legitime", date: "11/04/2026 16:45", marque: "Infinix", modele: "Hot 30" },
  { imei: "868829031234571", statut: "suspect", date: "11/04/2026 10:20", marque: "Huawei", modele: "Y9 Prime" },
  { imei: "351611081234572", statut: "legitime", date: "10/04/2026 15:33", marque: "Nokia", modele: "C21 Plus" },
  { imei: "492820101234573", statut: "legitime", date: "10/04/2026 08:50", marque: "Itel", modele: "A58" },
];

export default function HistoryPage() {
  return (
    <DashboardLayout role="dealer">
      <div className="space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">📋 Historique des vérifications</h1>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-semibold text-foreground">IMEI</th>
                  <th className="text-left p-3 font-semibold text-foreground">Appareil</th>
                  <th className="text-left p-3 font-semibold text-foreground">Statut</th>
                  <th className="text-left p-3 font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockHistory.map((h, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-foreground">{formatIMEI(h.imei)}</td>
                    <td className="p-3 text-muted-foreground">{h.marque} {h.modele}</td>
                    <td className="p-3"><StatusBadge statut={h.statut} size="sm" /></td>
                    <td className="p-3 text-muted-foreground">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
