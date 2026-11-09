import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#081426] px-4 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>
      <div className="w-full max-w-xl text-center page-enter">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-sky-300/20 bg-sky-300/10 text-sky-200"><ShieldAlert className="h-8 w-8" /></div>
        <p className="mt-8 font-mono text-sm font-bold tracking-[.35em] text-sky-300">ERREUR 404</p>
        <h1 className="mt-4 font-heading text-5xl font-extrabold tracking-tight sm:text-7xl">Page introuvable<span className="text-sky-400">.</span></h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-300">Cette adresse ne correspond à aucune page disponible. Revenez à l'accueil pour continuer à utiliser TraceIMEI-BJ.</p>
        <Link to="/" className="mt-9 inline-flex"><Button size="lg" className="h-12 rounded-xl bg-sky-500 px-6 font-bold text-white hover:bg-sky-400"><ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil</Button></Link>
        <p className="mt-12 text-xs font-semibold tracking-[.22em] text-slate-500">TRACEIMEI-BJ · BÉNIN</p>
      </div>
    </main>
  );
};

export default NotFound;
