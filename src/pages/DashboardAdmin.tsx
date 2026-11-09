import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Users, MapPin, Database, ArrowUpRight, ShieldCheck, Activity, Settings2 } from "lucide-react";

const actions = [
  { to: "/admin/ml", icon: Cpu, title: "Monitoring ML", description: "Consulter les informations de suivi du modèle et ses indicateurs." },
  { to: "/admin/users", icon: Users, title: "Gestion des utilisateurs", description: "Accéder à l'espace de gestion des comptes et des rôles." },
  { to: "/map", icon: MapPin, title: "Carte des incidents", description: "Visualiser les signalements agrégés par quartier." },
];

export default function DashboardAdmin() {
  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-6xl space-y-7 page-enter">
        <section className="relative overflow-hidden rounded-3xl bg-[#081426] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-200"><ShieldCheck className="h-3.5 w-3.5" /> Accès sécurisé</span>
              <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Administration</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">Centre de pilotage TraceIMEI-BJ. Retrouvez les outils d'administration et de supervision de la plateforme.</p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 sm:self-auto"><Activity className="h-4 w-4" /> Console administrateur</span>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to} className="glass-card group flex min-h-52 flex-col p-6 hover:border-primary/40">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-6 w-6" /></span>
              <h2 className="mt-5 font-heading text-lg font-bold text-foreground">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">Accéder <ArrowUpRight className="ml-1 h-4 w-4" /></span>
            </Link>
          ))}
        </div>

        <section className="glass-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600"><Database className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading font-bold text-foreground">Indicateurs et données</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">Les chiffres de démonstration ont été retirés de cette page. Les statistiques doivent être calculées à partir des données réelles de Supabase et des métriques effectivement retournées par le service de machine learning.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/admin/users"><Button variant="outline" size="sm"><Users className="mr-2 h-4 w-4" /> Utilisateurs</Button></Link>
                <Link to="/admin/ml"><Button variant="outline" size="sm"><Settings2 className="mr-2 h-4 w-4" /> Supervision ML</Button></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
