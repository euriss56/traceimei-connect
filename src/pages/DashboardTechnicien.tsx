import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, ShieldCheck, ClipboardList, History, ArrowUpRight, Smartphone } from "lucide-react";

export default function DashboardTechnicien() {
  return (
    <DashboardLayout role="technicien">
      <div className="mx-auto max-w-6xl space-y-7 page-enter">
        <section className="relative overflow-hidden rounded-3xl bg-[#081426] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-sky-200"><Wrench className="h-3.5 w-3.5" /> Espace professionnel</span>
              <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Espace Technicien</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">Vérifiez l'identité des appareils avant une intervention et consultez votre historique de contrôles.</p>
            </div>
            <Link to="/history"><Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">Mon historique <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <section className="glass-card min-w-0 p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Smartphone className="h-5 w-5" /></span>
              <div><h2 className="font-heading text-lg font-bold text-foreground">Contrôle d'un appareil</h2><p className="text-xs text-muted-foreground">Vérification par numéro IMEI</p></div>
            </div>
            <IMEIScanner />
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="glass-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600"><ShieldCheck className="h-5 w-5" /></span>
              <h3 className="mt-4 font-heading font-bold text-foreground">Avant toute réparation</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Contrôlez l'IMEI et prenez connaissance du résultat disponible avant de prendre en charge un appareil.</p>
            </article>
            <article className="glass-card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><ClipboardList className="h-5 w-5" /></span>
              <h3 className="mt-4 font-heading font-bold text-foreground">Suivi des contrôles</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Retrouvez les vérifications associées à votre compte dans votre historique personnel.</p>
              <Link to="/history" className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline">Ouvrir l'historique <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </article>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/70 p-4 text-sm text-muted-foreground">
          <History className="h-4 w-4 text-primary" /> Les interventions fictives de démonstration ont été retirées : seules les données réellement enregistrées doivent apparaître dans votre espace.
        </div>
      </div>
    </DashboardLayout>
  );
}
