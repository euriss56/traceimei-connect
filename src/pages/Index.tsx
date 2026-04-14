import { Button } from "@/components/ui/button";
import IMEIScanner from "@/components/IMEIScanner";
import { Link } from "react-router-dom";
import { Shield, Smartphone, Search, Cpu, Users, BarChart3, MapPin, Wrench, ChevronRight } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="benin-stripe" />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-heading font-bold text-xl text-foreground">TraceIMEI-BJ</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#fonctionnement" className="hover:text-foreground transition-colors">Comment ça marche</a>
            <a href="#pour-qui" className="hover:text-foreground transition-colors">Pour qui</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
            <Link to="/register"><Button variant="hero" size="sm">S'inscrire</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/20" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <Shield className="h-4 w-4" />
              Plateforme hybride de traçabilité
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              TraceIMEI-BJ — Protégez vos téléphones contre le vol
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              La première plateforme ML de traçabilité des téléphones volés au Bénin. Pour dealers, ateliers de réparation et forces de l'ordre.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#scanner"><Button variant="hero" size="lg">Vérifier un IMEI gratuitement <ChevronRight className="h-4 w-4" /></Button></a>
              <a href="#fonctionnement"><Button variant="hero-outline" size="lg">En savoir plus</Button></a>
            </div>
          </div>

          {/* Quick Scanner */}
          <div id="scanner" className="max-w-xl mx-auto mt-12 glass-card p-6 animate-slide-up">
            <h2 className="font-heading font-bold text-lg text-foreground mb-4 text-center">
              🔍 Vérification rapide IMEI
            </h2>
            <IMEIScanner compact />
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,9M", label: "Abonnés mobiles au Bénin", sub: "ARCEP 2025" },
              { value: "85,4%", label: "Précision du modèle ML", sub: "Anti-clonage" },
              { value: "< 2s", label: "Temps de réponse moyen", sub: "Réseau 3G" },
              { value: "50+", label: "Dealers partenaires", sub: "Cotonou" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="font-heading text-3xl md:text-4xl font-extrabold text-primary">{s.value}</p>
                <p className="text-sm font-medium text-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="fonctionnement" className="container mx-auto px-4 py-20">
        <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">Comment ça marche</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Smartphone, step: "1", title: "Saisissez ou scannez l'IMEI", desc: "Entrez les 15 chiffres du numéro IMEI du téléphone ou scannez le code-barres." },
            { icon: Cpu, step: "2", title: "Notre IA analyse 8 critères", desc: "Le modèle ML vérifie la cohérence Luhn, le TAC, les changements SIM et plus encore." },
            { icon: Search, step: "3", title: "Résultat instantané", desc: "Recevez immédiatement un indicateur vert, orange ou rouge avec le détail des analyses." },
          ].map((item) => (
            <div key={item.step} className="glass-card p-6 text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-primary-foreground text-xl font-bold">
                {item.step}
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For who */}
      <section id="pour-qui" className="bg-card border-y border-border">
        <div className="container mx-auto px-4 py-20">
          <h2 className="font-heading text-3xl font-bold text-center text-foreground mb-12">Pour qui ?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Dealers", desc: "Vérifiez avant d'acheter, protégez votre business et obtenez la certification ARCEP.", color: "text-success" },
              { icon: Wrench, title: "Techniciens d'atelier", desc: "Enregistrez vos réparations, construisez la traçabilité et détectez les anomalies.", color: "text-warning" },
              { icon: BarChart3, title: "ARCEP / Police", desc: "Cartographiez les incidents, générez des rapports et coordonnez les enquêtes.", color: "text-primary" },
            ].map((item) => (
              <div key={item.title} className="glass-card p-6 space-y-4 hover:shadow-md transition-shadow">
                <item.icon className={`h-10 w-10 ${item.color}`} />
                <h3 className="font-heading font-bold text-xl text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Authentifier. Protéger. Tracer.
          </h2>
          <p className="text-muted-foreground">
            Rejoignez la plateforme de traçabilité IMEI au Bénin et contribuez à la lutte contre le vol de téléphones.
          </p>
          <Link to="/register">
            <Button variant="hero" size="lg">Créer un compte gratuit <ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-6 w-6" />
                <span className="font-heading font-bold text-lg">TraceIMEI-BJ</span>
              </div>
              <p className="text-sm opacity-80">
                Plateforme hybride de traçabilité des téléphones volés au Bénin.
              </p>
            </div>
            <div className="space-y-2 text-sm opacity-80">
              <p className="font-semibold opacity-100">Liens</p>
              <Link to="/mentions-legales" className="block hover:opacity-100">Mentions légales</Link>
              <Link to="/politique-rgpd" className="block hover:opacity-100">Politique RGPD</Link>
              <Link to="/contact" className="block hover:opacity-100">Contact</Link>
              <Link to="/api-doc" className="block hover:opacity-100">Documentation API</Link>
            </div>
            <div className="space-y-2 text-sm opacity-80">
              <p className="font-semibold opacity-100">Conformité</p>
              <p>Données traitées conformément à la loi béninoise n° 2017-20</p>
              <p className="mt-4">Développé par Euriss FANOU — GETECH Cotonou 2026</p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-4 text-center text-xs opacity-60">
            © 2026 TraceIMEI-BJ — GETECH, Groupe d'Études en Technologies et Informatique, Cotonou, Bénin
          </div>
        </div>
      </footer>
    </div>
  );
}
