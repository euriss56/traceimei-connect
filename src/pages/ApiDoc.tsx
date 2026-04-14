import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Code, Lock, Zap, Database } from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/imei/verify",
    description: "Vérifie un numéro IMEI et retourne le statut, le score d'anomalie ML et les 8 features détaillées.",
    params: "imei (string, 15 chiffres)",
    response: '{ statut: "legitime"|"suspect"|"vole", scoreAnomalie: 0.73, features: {...} }',
    auth: true,
    rateLimit: "100 requêtes/heure/IP",
  },
  {
    method: "POST",
    path: "/api/signalement",
    description: "Signaler un téléphone volé. Crée un enregistrement et met à jour le statut de l'IMEI.",
    params: "imei, marque, modele, dateVol, quartier, description?, photo?",
    response: '{ reference: "BJ-2026-00123", statut: "ouvert" }',
    auth: true,
    rateLimit: "20 requêtes/heure",
  },
  {
    method: "GET",
    path: "/api/imei/history",
    description: "Récupère l'historique des vérifications de l'utilisateur connecté.",
    params: "page (int), limit (int, max 50)",
    response: '{ data: [...], total: 234, page: 1 }',
    auth: true,
    rateLimit: "60 requêtes/heure",
  },
  {
    method: "POST",
    path: "/api/batch/verify",
    description: "Vérification en lot via upload CSV. Maximum 50 IMEI par requête.",
    params: "file (CSV, colonne imei)",
    response: '{ results: [{ imei, statut, scoreAnomalie }], processed: 50, duration: "12.4s" }',
    auth: true,
    rateLimit: "10 requêtes/heure",
  },
  {
    method: "GET",
    path: "/api/stats/dashboard",
    description: "Statistiques du tableau de bord pour l'utilisateur connecté.",
    params: "period (7d|30d|3m)",
    response: '{ verificationsCount: 23, suspectsCount: 2, tauxProprete: 0.91 }',
    auth: true,
    rateLimit: "60 requêtes/heure",
  },
];

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

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Documentation API</h1>
          <p className="text-muted-foreground mt-2">API REST TraceIMEI-BJ — Python 3.11 + Flask 3.0</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-start gap-3">
            <Lock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Authentification</p>
              <p className="text-xs text-muted-foreground">JWT Bearer Token dans le header Authorization</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Performance</p>
              <p className="text-xs text-muted-foreground">Temps de réponse &lt; 2s — optimisé 3G</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-start gap-3">
            <Database className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">Base URL</p>
              <p className="text-xs text-muted-foreground font-mono">https://api.traceimei-bj.com/v1</p>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Endpoints</h2>
          {endpoints.map((ep) => (
            <div key={ep.path} className="glass-card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                  ep.method === "GET" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
                }`}>
                  {ep.method}
                </span>
                <code className="font-mono text-sm text-foreground">{ep.path}</code>
                {ep.auth && <span className="ml-auto text-xs bg-warning/20 text-warning px-2 py-0.5 rounded">🔒 Auth requise</span>}
              </div>
              <p className="text-sm text-muted-foreground">{ep.description}</p>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-medium text-foreground mb-1">Paramètres</p>
                  <code className="block bg-muted p-2 rounded text-muted-foreground font-mono">{ep.params}</code>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Réponse</p>
                  <code className="block bg-muted p-2 rounded text-muted-foreground font-mono break-all">{ep.response}</code>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Rate limit : {ep.rateLimit}</p>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Codes d'erreur</h2>
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-foreground">Code</th>
                  <th className="text-left p-3 font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-border"><td className="p-3 font-mono">400</td><td className="p-3">Requête invalide — IMEI malformé ou caractères non autorisés</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-mono">401</td><td className="p-3">Session expirée, veuillez vous reconnecter</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-mono">429</td><td className="p-3">Trop de requêtes — rate limit dépassé</td></tr>
                <tr className="border-t border-border"><td className="p-3 font-mono">500</td><td className="p-3">Erreur interne du serveur</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass-card p-5 space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
            <Code className="h-5 w-5" /> Exemple cURL
          </h2>
          <pre className="bg-muted p-4 rounded-lg text-xs font-mono text-muted-foreground overflow-x-auto">
{`curl -X POST https://api.traceimei-bj.com/v1/api/imei/verify \\
  -H "Authorization: Bearer <votre_token_jwt>" \\
  -H "Content-Type: application/json" \\
  -d '{"imei": "353456789012345"}'`}
          </pre>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          © 2026 TraceIMEI-BJ — GETECH, Cotonou, Bénin. Stack : Python 3.11 + Flask 3.0, PostgreSQL 16, Redis 7.2, Scikit-learn 1.4
        </p>
      </main>
    </div>
  );
}
