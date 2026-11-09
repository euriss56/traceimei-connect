import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sanitizeIMEIInput, formatIMEI, validateLuhn } from "@/lib/imei";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Zone = "Missebo" | "Dantokpa" | "Cadjehoun" | "Autre";

export default function Report() {
  const { user } = useAuth();
  const [imei, setImei] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [dateVol, setDateVol] = useState("");
  const [quartier, setQuartier] = useState<Zone>("Missebo");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reference, setReference] = useState("");

  const isValidIMEI = imei.length === 15 && validateLuhn(imei);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Connectez-vous pour enregistrer un signalement.");
      return;
    }
    if (!isValidIMEI) {
      toast.error("Veuillez saisir un IMEI valide de 15 chiffres.");
      return;
    }
    if (!dateVol || Number.isNaN(new Date(dateVol).getTime())) {
      toast.error("Veuillez renseigner la date du vol.");
      return;
    }

    setSubmitting(true);
    try {
      const reportReference = `BJ-${Date.now()}`;
      const { data: inserted, error: insertError } = await supabase
        .from("signalements_vol")
        .insert({
          imei,
          marque: marque.trim(),
          modele: modele.trim(),
          date_vol: new Date(dateVol).toISOString(),
          quartier,
          description: description.trim() || null,
          signale_par: user.id,
          reference: reportReference,
        })
        .select("reference")
        .single();

      if (insertError) throw insertError;

      // Synchronise le statut de l'appareil. Le signalement reste consultable
      // même si cette mise à jour secondaire échoue.
      const { error: deviceError } = await supabase
        .from("appareils")
        .upsert({
          imei,
          marque: marque.trim(),
          modele: modele.trim(),
          tac: imei.slice(0, 8),
          statut: "vole",
          score_anomalie: 1,
        }, { onConflict: "imei" });

      if (deviceError) {
        console.error("Signalement enregistré, synchronisation appareil impossible :", deviceError.message);
        toast.warning("Signalement enregistré, mais la fiche appareil n'a pas pu être synchronisée.");
      } else {
        toast.success("Signalement enregistré avec succès.");
      }

      setReference(inserted.reference);
      setShowConfirm(true);
    } catch (error) {
      console.error("Erreur d'enregistrement du signalement :", error);
      toast.error("Le signalement n'a pas pu être enregistré. Vérifiez les informations et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setImei("");
    setMarque("");
    setModele("");
    setDateVol("");
    setQuartier("Missebo");
    setDescription("");
    setShowConfirm(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">Déclaration citoyenne</p>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl flex items-center gap-2 text-foreground">
            <AlertTriangle className="text-destructive" /> Signaler un vol
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Renseignez les informations du téléphone et du vol pour enregistrer le signalement.</p>
        </header>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-border/60 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="report-imei">IMEI *</Label>
            <Input
              id="report-imei"
              value={formatIMEI(imei)}
              onChange={(e) => setImei(sanitizeIMEIInput(e.target.value))}
              maxLength={17}
              inputMode="numeric"
              required
              placeholder="00000 00000 00000"
              className="font-mono tracking-wide"
            />
            {imei.length === 15 && (
              <p className={`text-xs ${isValidIMEI ? "text-success" : "text-destructive"}`}>
                {isValidIMEI ? "Clé de contrôle IMEI valide" : "Clé de contrôle IMEI invalide"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="report-brand">Marque</Label>
              <Input id="report-brand" placeholder="Ex. Samsung" value={marque} onChange={(e) => setMarque(e.target.value)} maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-model">Modèle</Label>
              <Input id="report-model" placeholder="Ex. Galaxy A15" value={modele} onChange={(e) => setModele(e.target.value)} maxLength={100} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-date">Date et heure du vol *</Label>
            <Input id="report-date" type="datetime-local" value={dateVol} onChange={(e) => setDateVol(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Zone / quartier *</Label>
            <Select value={quartier} onValueChange={(value) => setQuartier(value as Zone)}>
              <SelectTrigger><SelectValue placeholder="Choisir une zone" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Missebo">Missèbo</SelectItem>
                <SelectItem value="Dantokpa">Dantokpa</SelectItem>
                <SelectItem value="Cadjehoun">Cadjehoun</SelectItem>
                <SelectItem value="Autre">Autre zone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-description">Description complémentaire</Label>
            <Textarea id="report-description" value={description} onChange={(e) => setDescription(e.target.value.slice(0, 500))} placeholder="Circonstances du vol, signes distinctifs…" rows={4} />
            <p className="text-right text-xs text-muted-foreground">{description.length}/500</p>
          </div>

          <Button type="submit" disabled={!isValidIMEI || !dateVol || submitting} className="w-full rounded-xl py-5 font-semibold shadow-lg shadow-primary/15">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement…</> : "Enregistrer le signalement"}
          </Button>
          <p className="text-xs text-muted-foreground">Le signalement est enregistré dans la base de données du projet. Veuillez vérifier l’exactitude des informations avant l’envoi.</p>
        </form>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-success flex items-center gap-2"><CheckCircle /> Signalement enregistré</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Votre déclaration a été enregistrée sous la référence :</p>
          <p className="rounded-lg bg-muted p-3 font-mono font-semibold">{reference}</p>
          <Button onClick={resetForm} className="w-full">Nouveau signalement</Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
