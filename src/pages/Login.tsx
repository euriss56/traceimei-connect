import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import type { UserRole } from "@/types";

const roles: { value: UserRole; label: string; icon: string }[] = [
  { value: "dealer", label: "Dealer", icon: "👤" },
  { value: "technicien", label: "Technicien", icon: "🔧" },
  { value: "enqueteur", label: "Enquêteur", icon: "🔍" },
  { value: "admin", label: "Administrateur", icon: "⚙️" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("dealer");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth - redirect to appropriate dashboard
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
          <p className="text-muted-foreground">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <Button type="submit" variant="hero" className="w-full" size="lg">
            Se connecter
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Pas de compte ?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">S'inscrire</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
