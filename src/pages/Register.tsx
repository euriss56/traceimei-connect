import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { UserRole, Marche, TypeActivite } from "@/types";

// Whitelist UI: admin role NEVER selectable via self-signup (security)
// Admin must be granted manually by an existing admin
const roles: { value: Exclude<UserRole, "admin">; label: string; icon: string }[] = [
  { value: "dealer", label: "Dealer", icon: "👤" },
  { value: "technicien", label: "Technicien d'atelier", icon: "🔧" },
  { value: "enqueteur", label: "Enquêteur (ARCEP/Police)", icon: "🔍" },
];

export default function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("dealer");
  const [marche, setMarche] = useState<Marche>("Missebo");
  const [typeActivite, setTypeActivite] = useState<TypeActivite>("revente");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, { name: nom, role, marche, type_activite: typeActivite });
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="benin-stripe" />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-3px)]">
        <div className="w-full max-w-xl space-y-7 animate-fade-in">
          <div className="text-center space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="h-12 w-12 rounded-2xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center"><Shield className="h-7 w-7 text-primary" /></span>
              <span className="font-heading font-bold text-2xl tracking-tight text-foreground">TraceIMEI-BJ</span>
            </Link>
            <p className="text-muted-foreground">Créez votre compte TraceIMEI-BJ</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-border/60 p-6 sm:p-7 space-y-5 shadow-xl shadow-black/[0.04]">
            <div className="space-y-2">
              <Label>Rôle</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center gap-2 p-3 sm:p-4 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5 ${
                      role === r.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span>{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input id="nom" placeholder="Euriss Fanou" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Marché / Zone</Label>
                <Select value={marche} onValueChange={(v) => setMarche(v as Marche)}>
                  <SelectTrigger className="h-11 rounded-xl bg-background/80"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Missebo">Missèbo</SelectItem>
                    <SelectItem value="Dantokpa">Dantokpa</SelectItem>
                    <SelectItem value="Cadjehoun">Cadjehoun</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Activité</Label>
                <Select value={typeActivite} onValueChange={(v) => setTypeActivite(v as TypeActivite)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revente">Revente</SelectItem>
                    <SelectItem value="reparation">Réparation</SelectItem>
                    <SelectItem value="les_deux">Les deux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full h-12 rounded-xl shadow-md transition-all hover:-translate-y-0.5" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Créer mon compte
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Déjà inscrit ?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
