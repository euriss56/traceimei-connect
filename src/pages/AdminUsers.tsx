import DashboardLayout from "@/components/DashboardLayout";
import { Users, Search, Database } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminUsers() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-7 animate-fade-in">
        <header className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">Administration</p>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Gestion des utilisateurs
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Consultez et gérez les comptes de la plateforme.</p>
        </header>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un utilisateur…" className="pl-9 h-11 rounded-xl bg-background/80" disabled />
        </div>

        <section className="glass-card rounded-2xl border border-border/60 p-8 sm:p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Database className="h-7 w-7" />
          </div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Liste des comptes non connectée</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Cette page ne charge pas encore les utilisateurs depuis la base de données. Aucun compte fictif n’est affiché afin de ne pas fausser les informations d’administration.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
