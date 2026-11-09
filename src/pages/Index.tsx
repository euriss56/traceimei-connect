import { Button } from "@/components/ui/button";
import IMEIScanner from "@/components/IMEIScanner";
import { Link } from "react-router-dom";
import { Shield, Smartphone, Search, Cpu, Users, BarChart3, Wrench, ChevronRight, LockKeyhole, ScanLine, ArrowUpRight, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Smartphone, step: "01", title: "Saisissez l'IMEI", desc: "Entrez les 15 chiffres de l'IMEI ou utilisez le scanner compatible pour renseigner le numéro." },
  { icon: Cpu, step: "02", title: "Lancez la vérification", desc: "La plateforme analyse les informations disponibles et les indicateurs associés à l'appareil." },
  { icon: Search, step: "03", title: "Consultez le résultat", desc: "Prenez connaissance du statut retourné et des informations utiles avant toute décision." },
];

const audiences = [
  { icon: Users, title: "Revendeurs & dealers", desc: "Ajoutez une étape de vérification à vos contrôles avant achat ou revente.", tag: "Commerce" },
  { icon: Wrench, title: "Techniciens", desc: "Contribuez à une meilleure traçabilité des appareils pris en charge en atelier.", tag: "Réparation" },
  { icon: BarChart3, title: "Enquêteurs & autorités", desc: "Accédez aux outils de suivi et aux informations autorisées selon votre rôle.", tag: "Enquête" },
];

export default function Index() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <div className="benin-stripe" />
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-[76px] items-center justify-between px-4">
          <Link to="/" className="group flex items-center gap-3" aria-label="TraceIMEI-BJ, accueil">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105"><Shield className="h-6 w-6" /></span>
            <span className="leading-tight"><span className="block font-heading text-lg font-extrabold tracking-tight text-foreground">TraceIMEI<span className="text-primary">-BJ</span></span><span className="text-[10px] font-semibold uppercase tracking-[.2em] text-muted-foreground">Tracer · Vérifier · Protéger</span></span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-muted-foreground md:flex">
            <a href="#fonctionnement" className="hover:text-primary">Fonctionnement</a>
            <a href="#publics" className="hover:text-primary">Utilisateurs</a>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
            <Link to="/register"><Button variant="hero" size="sm" className="rounded-xl">Créer un compte <ArrowUpRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative isolate overflow-hidden bg-[#081426] text-white">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-40 -top-44 h-[36rem] w-[36rem] rounded-full bg-blue-500/20 blur-[100px]" />
            <div className="absolute -bottom-52 -left-40 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-[100px]" />
            <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:56px_56px]" />
          </div>
          <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 md:grid-cols-[1.05fr_.95fr] md:py-28">
            <div className="page-enter">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
                Une initiative numérique au Bénin
              </div>
              <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.8rem]">
                Un téléphone a une histoire. <span className="text-sky-300">Vérifiez-la</span> avant de faire confiance.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                TraceIMEI-BJ facilite la vérification et la traçabilité des téléphones grâce à leur numéro IMEI. Un outil pensé pour renforcer la vigilance et soutenir la lutte contre le vol de téléphones au Bénin.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#scanner"><Button size="lg" className="h-12 rounded-xl bg-sky-500 px-6 font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400">Vérifier un IMEI <ChevronRight className="ml-2 h-4 w-4" /></Button></a>
                <Link to="/report"><Button size="lg" variant="outline" className="h-12 rounded-xl border-white/25 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white">Signaler un téléphone</Button></Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-300">
                <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-emerald-300" /> Accès selon votre profil</span>
                <span className="inline-flex items-center gap-2"><ScanLine className="h-4 w-4 text-sky-300" /> Vérification par IMEI</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl page-enter" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-5 rounded-[2rem] bg-sky-400/10 blur-2xl" />
              <div className="relative rounded-[1.7rem] border border-white/15 bg-white/[.07] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-slate-400">TraceIMEI-BJ / Contrôle</p><p className="mt-1 font-heading text-sm font-bold text-white">Centre de vérification</p></div>
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold text-emerald-200">IMEI</span>
                </div>
                <div className="my-5 rounded-2xl border border-white/10 bg-[#07101e]/80 p-5">
                  <div className="mb-4 flex items-center justify-between"><span className="text-xs font-semibold text-slate-300">Identification de l'appareil</span><Smartphone className="h-5 w-5 text-sky-300" /></div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] p-4">
                    <ScanLine className="h-5 w-5 shrink-0 text-sky-300" /><span className="font-mono text-sm tracking-[.16em] text-slate-400">15 chiffres IMEI</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400"><Shield className="h-4 w-4 text-emerald-300" /> Vérifiez avant d'acheter ou de revendre.</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400">Objectif</p><p className="mt-1 text-sm font-bold text-white">Traçabilité</p></div>
                  <div className="rounded-xl border border-white/10 bg-white/[.04] p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400">Territoire</p><p className="mt-1 text-sm font-bold text-white">Bénin</p></div>
                </div>
              </div>
              <div className="soft-float absolute -right-3 top-12 hidden rounded-xl border border-white/15 bg-[#10243b] px-4 py-3 shadow-xl sm:block"><p className="flex items-center gap-2 text-xs font-bold text-white"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Vigilance numérique</p><p className="mt-1 text-[10px] text-slate-400">Un réflexe avant chaque transaction</p></div>
            </div>
          </div>
        </section>

        <section id="scanner" className="container mx-auto scroll-mt-24 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[.22em] text-primary">Vérification rapide</span>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Commencez par le numéro IMEI</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Renseignez le numéro IMEI de l'appareil pour lancer une vérification.</p>
          </div>
          <div className="mx-auto mt-9 max-w-2xl rounded-3xl border border-border bg-card p-5 shadow-[0_24px_70px_-48px_hsl(var(--primary)/.4)] sm:p-8">
            <div className="mb-5 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Search className="h-5 w-5" /></span><div><h3 className="font-heading font-bold text-foreground">Recherche IMEI</h3><p className="text-xs text-muted-foreground">Saisie ou scan du numéro</p></div></div>
            <IMEIScanner compact />
            <p className="mt-4 text-center text-xs text-muted-foreground">Un résultat de vérification ne remplace pas une confirmation auprès des autorités compétentes.</p>
          </div>
        </section>

        <section id="fonctionnement" className="border-y border-border bg-card/60">
          <div className="container mx-auto px-4 py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-xs font-bold uppercase tracking-[.22em] text-primary">Simple et guidé</span><h2 className="mt-3 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">Comment ça fonctionne ?</h2><p className="mt-4 text-muted-foreground">Trois étapes pour intégrer la vérification IMEI à vos habitudes.</p></div>
            <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
              {steps.map(({ icon: Icon, step, title, desc }) => <article key={step} className="glass-card group p-7"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold tracking-widest text-primary">{step}</span><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-6 w-6" /></span></div><h3 className="mt-7 font-heading text-lg font-bold text-foreground">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{desc}</p></article>)}
            </div>
          </div>
        </section>

        <section id="publics" className="container mx-auto px-4 py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center"><span className="text-xs font-bold uppercase tracking-[.22em] text-primary">Un outil pour plusieurs acteurs</span><h2 className="mt-3 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">À qui s'adresse TraceIMEI-BJ ?</h2><p className="mt-4 text-muted-foreground">Des espaces et des outils adaptés aux missions de chaque profil autorisé.</p></div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {audiences.map(({ icon: Icon, title, desc, tag }) => <article key={title} className="glass-card p-7"><span className="inline-flex rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">{tag}</span><Icon className="mt-6 h-9 w-9 text-primary" /><h3 className="mt-5 font-heading text-xl font-bold text-foreground">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{desc}</p></article>)}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#081426] px-6 py-14 text-center text-white sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="relative"><Shield className="mx-auto h-10 w-10 text-sky-300" /><h2 className="mt-5 font-heading text-3xl font-extrabold sm:text-4xl">Faisons de la vérification un réflexe.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">Créez votre compte pour accéder aux fonctionnalités correspondant à votre profil et contribuer à une meilleure traçabilité des téléphones.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/register"><Button size="lg" className="rounded-xl bg-sky-500 px-6 font-bold text-white hover:bg-sky-400">Rejoindre TraceIMEI-BJ <ChevronRight className="ml-2 h-4 w-4" /></Button></Link><Link to="/contact"><Button size="lg" variant="outline" className="rounded-xl border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white">Nous contacter</Button></Link></div></div>
          </div>
        </section>
      </main>

      <footer className="bg-[#07101e] text-white">
        <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500"><Shield className="h-5 w-5" /></span><span className="font-heading text-lg font-extrabold">TraceIMEI-BJ</span></div><p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">Plateforme de vérification et de traçabilité des téléphones par leur numéro IMEI au Bénin.</p></div>
          <div className="space-y-3 text-sm"><p className="font-bold text-white">Explorer</p><Link to="/contact" className="block text-slate-400 hover:text-white">Contact</Link><Link to="/api-doc" className="block text-slate-400 hover:text-white">Documentation API</Link><Link to="/login" className="block text-slate-400 hover:text-white">Connexion</Link></div>
          <div className="space-y-3 text-sm"><p className="font-bold text-white">Informations</p><Link to="/mentions-legales" className="block text-slate-400 hover:text-white">Mentions légales</Link><Link to="/politique-rgpd" className="block text-slate-400 hover:text-white">Politique de confidentialité</Link><p className="pt-2 text-xs leading-6 text-slate-500">© {new Date().getFullYear()} TraceIMEI-BJ · Bénin</p></div>
        </div>
      </footer>
    </div>
  );
}
