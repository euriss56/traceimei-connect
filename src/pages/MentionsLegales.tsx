import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function MentionsLegales() {
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
        <h1 className="font-heading text-3xl font-bold text-foreground">Mentions Légales</h1>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Éditeur du site</h2>
          <p className="text-muted-foreground">
            <strong className="text-foreground">TraceIMEI-BJ</strong> est une plateforme éditée par <strong className="text-foreground">GETECH — Groupe d'Études en Technologies et Informatique</strong>, basé à Cotonou, Bénin.
          </p>
          <ul className="text-muted-foreground space-y-1 list-disc list-inside">
            <li>Adresse : Cotonou, Bénin</li>
            <li>Responsable de la publication : Euriss FANOU</li>
            <li>Contact : contact@traceimei-bj.com</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Hébergement</h2>
          <p className="text-muted-foreground">
            La plateforme est hébergée sur Oracle Cloud Infrastructure (OCI) — Région Afrique de l'Ouest.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Propriété intellectuelle</h2>
          <p className="text-muted-foreground">
            L'ensemble du contenu de la plateforme TraceIMEI-BJ (textes, images, logos, code source, base de données) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Données personnelles</h2>
          <p className="text-muted-foreground">
            Les données personnelles collectées par TraceIMEI-BJ sont traitées conformément à la <strong className="text-foreground">loi béninoise n° 2017-20</strong> portant code du numérique en République du Bénin et à la réglementation de l'APDP (Autorité de Protection des Données Personnelles).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-foreground">Limitation de responsabilité</h2>
          <p className="text-muted-foreground">
            TraceIMEI-BJ s'efforce de fournir des informations aussi exactes que possible. Toutefois, l'éditeur ne saurait être tenu responsable des omissions, des inexactitudes ou des conséquences de l'utilisation des informations diffusées. Le résultat de vérification IMEI est fourni à titre indicatif.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          © 2026 TraceIMEI-BJ — GETECH, Cotonou, Bénin
        </p>
      </main>
    </div>
  );
}
