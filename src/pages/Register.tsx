import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import type { UserRole, Marche, TypeActivite } from "@/types";

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: "dealer", label: "Dealer", icon: "👤" },
  { value: "technicien", label: "Technicien d'atelier", icon: "🔧" },
  { value: "enqueteur", label: "Enquêteur (ARCEP/Police)", icon: "🔍" },
  { value: "admin", label: "Administrateur", icon: "⚙️" },
];

export default function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("dealer");
  const [marche, setMarche] = useState<Marche>("Missebo");
  const [typeActivite, setTypeActivite] = useState<TypeActivite>("revente");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-2xl text-foreground">TraceIMEI-BJ</span>
          </Link>
          <p className="text-muted-foreground">Créez votre compte TraceIMEI-BJ</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>Rôle</Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
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
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Marché / Zone</Label>
              <Select value={marche} onValueChange={(v) => setMarche(v as Marche)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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

          <Button type="submit" variant="hero" className="w-full" size="lg">
            Créer mon compte
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
