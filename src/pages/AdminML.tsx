import DashboardLayout from "@/components/DashboardLayout";
import ScoreBar from "@/components/ScoreBar";
import { Button } from "@/components/ui/button";
import { Cpu, AlertTriangle, RefreshCw, Database } from "lucide-react";

export default function AdminML() {
  const metrics = [
    { label: "AUC-ROC", value: 0.912, threshold: 0.85 },
    { label: "Accuracy", value: 0.854, threshold: 0.80 },
    { label: "Precision (clone)", value: 0.837, threshold: 0.80 },
    { label: "Recall (clone)", value: 0.821, threshold: 0.80 },
  ];

  const isPerformanceDegraded = metrics[0].value < metrics[0].threshold;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
          <Cpu className="h-6 w-6 text-primary" /> Monitoring ML
        </h1>

        {isPerformanceDegraded && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p className="text-sm font-medium text-foreground">⚠️ Performances dégradées — Réentraînement recommandé</p>
          </div>
        )}

        {/* Metrics */}
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{m.label}</span>
                <span className="font-mono text-lg font-bold text-foreground">{(m.value * 100).toFixed(1)}%</span>
              </div>
              <ScoreBar score={1 - m.value} showLabel={false} />
              <p className="text-xs text-muted-foreground">Seuil minimum : {(m.threshold * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>

        {/* Training info */}
        <div className="glass-card p-5 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Informations d'entraînement</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Données d'entraînement</p>
              <p className="font-semibold text-foreground">10 000 records (30% terrain, 70% simulé)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dernier entraînement</p>
              <p className="font-semibold text-foreground">10/04/2026 — 4h23min — random_state: 2026</p>
            </div>
            <div>
              <p className="text-muted-foreground">Modèle</p>
              <p className="font-semibold text-foreground">Random Forest 70% + Isolation Forest 30%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Features</p>
              <p className="font-semibold text-foreground">8 features (voir détail)</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="hero" size="lg">
            <RefreshCw className="h-4 w-4" /> Lancer réentraînement
          </Button>
          <Button variant="outline" size="lg">
            <Database className="h-4 w-4" /> Historique métriques
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
