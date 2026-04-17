import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, MapPin, Activity, Loader2, Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Marche = "Missebo" | "Dantokpa" | "Cadjehoun" | "Autre";

export default function Profile() {
  const { user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [marche, setMarche] = useState<Marche>("Missebo");
  const [verificationsCount, setVerificationsCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("nom, email, marche, verifications_count")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        toast.error("Erreur chargement profil");
      } else if (data) {
        setNom(data.nom ?? "");
        setEmail(data.email ?? user.email ?? "");
        setMarche((data.marche as Marche) ?? "Missebo");
        setVerificationsCount(data.verifications_count ?? 0);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!nom.trim()) {
      toast.error("Le nom ne peut pas être vide");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nom: nom.trim(), marche })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Échec de la mise à jour : " + error.message);
    } else {
      toast.success("Profil mis à jour");
    }
  };

  const threshold = 20;
  const hasBadge = verificationsCount >= threshold;
  const progressPct = Math.min((verificationsCount / threshold) * 100, 100);

  if (loading) {
    return (
      <DashboardLayout role={role ?? "dealer"}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role ?? "dealer"}>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">👤 Mon profil</h1>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg text-foreground truncate">{nom || "Sans nom"}</h2>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" /> Rôle : <span className="text-foreground font-medium capitalize">{role ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> Marché : <span className="text-foreground font-medium">{marche}</span>
            </div>
          </div>
        </div>

        {/* Édition */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="font-heading font-semibold text-foreground">Modifier mes infos</h2>
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label>Marché principal</Label>
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
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</> : <><Save className="h-4 w-4" /> Enregistrer</>}
          </Button>
        </div>

        {/* Certification */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground">Certification</h2>
            {hasBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-semibold">
                <Shield className="h-4 w-4" /> Certifié TraceIMEI-BJ
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vérifications totales</span>
              <span className="font-mono font-semibold text-foreground">{verificationsCount} / {threshold}</span>
            </div>
            <Progress value={progressPct} className="h-2" />
            {!hasBadge && (
              <p className="text-xs text-muted-foreground">
                Encore {threshold - verificationsCount} vérification(s) pour obtenir le badge "Dealer Traçable ARCEP"
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
