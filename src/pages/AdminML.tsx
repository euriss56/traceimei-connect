import DashboardLayout from "@/components/DashboardLayout";
import { Cpu, Database, Activity } from "lucide-react";

export default function AdminML() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-7 animate-fade-in">
        <header className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">Intelligence artificielle</p>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-foreground flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary" /> Monitoring ML
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Suivi de l’état du service d’analyse et des performances du modèle.</p>
        </header>

        <section className="glass-card rounded-2xl border border-border/60 p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Télémétrie non connectée</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Les métriques en temps réel, l’historique des évaluations et le déclenchement d’un réentraînement ne sont pas encore reliés à une source de données dans cette interface. Les valeurs de démonstration ont été retirées pour éviter de présenter des performances non vérifiées.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card rounded-2xl border border-border/60 p-5">
            <Database className="h-5 w-5 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">Source des métriques</h3>
            <p className="text-sm text-muted-foreground mt-1">Connexion à l’API ML à prévoir pour afficher les données réelles.</p>
          </div>
          <div className="glass-card rounded-2xl border border-border/60 p-5">
            <Activity className="h-5 w-5 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">État du suivi</h3>
            <p className="text-sm text-muted-foreground mt-1">Aucune mesure de performance n’est affichée tant qu’elle n’est pas récupérée et vérifiée.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
