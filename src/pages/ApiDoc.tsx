import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Code, Lock, Database, Info } from "lucide-react";

export default function ApiDoc() {
  return (
    <div className="min-h-screen bg-background">
      <div className="benin-stripe" />
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-heading font-bold text-xl text-foreground">TraceIMEI-BJ</span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10 sm:py-14 max-w-5xl space-y-8 animate-fade-in">
        <header className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">Espace développeurs</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Documentation API</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">Informations sur l’intégration technique de TraceIMEI-BJ. Cette page sera complétée avec les contrats d’API vérifiés.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl border border-border/60 p-4 flex items-start gap-3 shadow-sm">
            <Lock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Authentification</p>
              <p className="text-xs text-muted-foreground">L’application utilise Supabase Auth pour les sessions utilisateur.</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl border border-border/60 p-4 flex items-start gap-3 shadow-sm">
            <Database className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Données</p>
              <p className="text-xs text-muted-foreground">La couche de données du frontend est connectée à Supabase.</p>
            </div>
          </div>
          <div className="glass-card rounded-2xl border border-border/60 p-4 flex items-start gap-3 shadow-sm">
            <Code className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Technologies</p>
              <p className="text-xs text-muted-foreground">React, TypeScript, Vite et Supabase JS.</p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-warning/30 bg-warning/5 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <Info className="h-5 w-5 text-warning" />
            <h2 className="font-heading text-xl font-semibold">Documentation des routes en cours de validation</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Le dépôt frontend actuellement publié ne contient pas le code source du serveur Flask ni un contrat OpenAPI permettant de confirmer les routes, paramètres, formats de réponse, règles d’authentification ou limites de requêtes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pour éviter de fournir des exemples inexacts, les anciennes routes et URL non vérifiées ne sont plus présentées comme des interfaces disponibles. Elles seront publiées ici après vérification du backend et des réponses réellement retournées.
          </p>
        </section>

        <section className="glass-card rounded-2xl border border-border/60 p-5 sm:p-6 space-y-3 shadow-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Avant d’intégrer l’API</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Confirmer l’URL publique et la version du serveur API.</li>
            <li>Vérifier les routes directement dans le code backend ou dans son schéma OpenAPI.</li>
            <li>Documenter les champs obligatoires, les réponses et les codes d’erreur réels.</li>
            <li>Préciser le mécanisme d’authentification et les permissions par rôle.</li>
            <li>Publier des exemples de requêtes uniquement après un test sur l’environnement actif.</li>
          </ul>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          © 2026 TraceIMEI-BJ — GETECH, Cotonou, Bénin.
        </p>
      </main>
    </div>
  );
}
