import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function PolitiqueRGPD() {
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

      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Politique de Protection des Données</h1>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Cadre juridique</h2>
          <p className="text-muted-foreground">
            La présente politique est établie conformément à la <strong className="text-foreground">loi n° 2017-20 du 20 avril 2018</strong> portant code du numérique en République du Bénin et aux recommandations de l'<strong className="text-foreground">APDP</strong> (Autorité de Protection des Données Personnelles du Bénin).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Données collectées</h2>
          <ul className="text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong className="text-foreground">Données d'identification</strong> : nom, email, rôle professionnel, marché/zone d'activité</li>
            <li><strong className="text-foreground">Données IMEI</strong> : numéro IMEI (15 chiffres), résultat de vérification, score d'anomalie</li>
            <li><strong className="text-foreground">Données de signalement</strong> : IMEI volé, marque, modèle, quartier (jamais de coordonnées GPS exactes)</li>
            <li><strong className="text-foreground">Données techniques</strong> : historique de réparations, changements de SIM</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Finalités du traitement</h2>
          <ul className="text-muted-foreground space-y-1 list-disc list-inside">
            <li>Vérification de la légitimité des appareils mobiles</li>
            <li>Détection d'anomalies par algorithmes de Machine Learning</li>
            <li>Suivi des signalements de vol en coordination avec les autorités</li>
            <li>Établissement de statistiques anonymisées sur le marché</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Géolocalisation et anonymisation</h2>
          <p className="text-muted-foreground">
            TraceIMEI-BJ ne collecte ni ne diffuse jamais de coordonnées GPS exactes. Les données de localisation sont limitées au <strong className="text-foreground">niveau quartier</strong> (Missèbo, Dantokpa, Cadjehoun, Akpakpa, Fidjrossè) afin de garantir l'anonymat des utilisateurs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Durée de conservation</h2>
          <p className="text-muted-foreground">
            Les données de vérification IMEI sont conservées pendant 24 mois. Les signalements de vol sont conservés jusqu'à résolution de l'enquête, avec un maximum de 5 ans. Les données de compte sont supprimées 6 mois après la fermeture du compte.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Droits des utilisateurs</h2>
          <p className="text-muted-foreground">
            Conformément à la loi béninoise, vous disposez des droits suivants : accès, rectification, suppression, opposition et portabilité de vos données. Pour exercer ces droits, contactez-nous à <strong className="text-foreground">dpo@traceimei-bj.com</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Sécurité</h2>
          <p className="text-muted-foreground">
            Les données sont protégées par chiffrement TLS en transit et au repos. L'authentification utilise des tokens JWT avec expiration automatique. Les politiques RLS (Row Level Security) garantissent que chaque utilisateur n'accède qu'à ses propres données.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          Dernière mise à jour : avril 2026 — © TraceIMEI-BJ, GETECH Cotonou
        </p>
      </main>
    </div>
  );
}
