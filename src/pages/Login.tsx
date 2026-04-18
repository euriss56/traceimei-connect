import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, role, user } = useAuth();
  const navigate = useNavigate();

  // Redirection automatique vers le dashboard correspondant au rôle
  useEffect(() => {
    if (user && role) {
      console.log("[Login] Redirection vers /dashboard/" + role);
      navigate(`/dashboard/${role}`, { replace: true });
    }
  }, [user, role, navigate]);

  // Garde-fou : si l'utilisateur est connecté mais qu'aucun rôle n'a pu être chargé après 5s
  useEffect(() => {
    if (!user || role) return;
    const t = setTimeout(() => {
      if (!role) {
        toast.error("Impossible de récupérer votre rôle. Contactez l'administrateur.");
      }
    }, 5000);
    return () => clearTimeout(t);
  }, [user, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      if (error.includes("Invalid login")) {
        toast.error("Email ou mot de passe incorrect");
      } else {
        toast.error(error);
      }
      return;
    }
    toast.success("Connexion réussie !");
    // La redirection se fera automatiquement via useEffect dès que role est chargé
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="benin-stripe" />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-3px)]">
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Se connecter
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Pas de compte ?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline">S'inscrire</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
