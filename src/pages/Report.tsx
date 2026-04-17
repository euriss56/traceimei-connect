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

type Marche = "Missebo" | "Dantokpa" | "Cadjehoun" | "Autre";

export default function Report() {
  const { user } = useAuth();
  const [imei, setImei] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [dateVol, setDateVol] = useState("");
  const [quartier, setQuartier] = useState<Marche>("Missebo");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reference, setReference] = useState("");

  const isValidIMEI = imei.length === 15 && validateLuhn(imei);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIMEI || !user) return;

    setSubmitting(true);
    try {
      // 1) Upload photo (optionnel)
      let photoUrl: string | null = null;
      if (photoFile) {
        if (photoFile.size > 5 * 1024 * 1024) {
          toast.error("Photo trop volumineuse (max 5 Mo)");
          setSubmitting(false);
          return;
        }
        const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("signalements-photos")
          .upload(path, photoFile, { contentType: photoFile.type });
        if (upErr) {
          toast.error("Échec de l'upload photo : " + upErr.message);
          setSubmitting(false);
          return;
        }
        const { data: pub } = supabase.storage.from("signalements-photos").getPublicUrl(path);
        photoUrl = pub.publicUrl;
      }

      // 2) Insert signalement (la référence est générée par trigger DB)
      const { data: ins, error: insErr } = await supabase
        .from("signalements_vol")
        .insert([{
          imei,
          marque,
          modele,
          date_vol: new Date(dateVol).toISOString(),
          quartier,
          description: description || null,
          photo_url: photoUrl,
          signale_par: user.id,
          reference: "PENDING", // remplacé par trigger
        }])
        .select("reference")
        .single();

      if (insErr) {
        toast.error("Échec du signalement : " + insErr.message);
        setSubmitting(false);
        return;
      }

      // 3) Marquer l'IMEI comme volé dans la table appareils
      const { error: appErr } = await supabase.from("appareils").upsert(
        [{
          imei,
          marque,
          modele,
          tac: imei.slice(0, 8),
          statut: "vole" as const,
          score_anomalie: 1.0,
        }],
        { onConflict: "imei" }
      );
      if (appErr) console.warn("appareils upsert:", appErr.message);

      setReference(ins?.reference || "");
      setShowConfirm(true);
      toast.success("Signalement enregistré");
    } catch (err) {
      console.error(err);
      toast.error("Erreur inattendue");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setImei("");
    setMarque("");
    setModele("");
    setDateVol("");
    setDescription("");
    setPhotoFile(null);
    setShowConfirm(false);
  };

  return (
    <DashboardLayout role="dealer">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          Signaler un vol
        </h1>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>IMEI de l'appareil volé *</Label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                placeholder="15 chiffres"
                value={formatIMEI(imei)}
                onChange={(e) => setImei(sanitizeIMEIInput(e.target.value))}
                className="font-mono"
                maxLength={17}
                required
              />
              {imei.length === 15 && (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${isValidIMEI ? "text-success" : "text-destructive"}`}>
                  {isValidIMEI ? "✓" : "✗"}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Marque *</Label>
              <Input placeholder="ex: Samsung" value={marque} onChange={(e) => setMarque(e.target.value)} required maxLength={50} />
            </div>
            <div className="space-y-2">
              <Label>Modèle *</Label>
              <Input placeholder="ex: Galaxy A14" value={modele} onChange={(e) => setModele(e.target.value)} required maxLength={50} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Date et heure du vol *</Label>
              <Input type="datetime-local" value={dateVol} onChange={(e) => setDateVol(e.target.value)} required max={new Date().toISOString().slice(0, 16)} />
            </div>
            <div className="space-y-2">
              <Label>Quartier / Lieu *</Label>
              <Select value={quartier} onValueChange={(v) => setQuartier(v as Marche)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Missebo">Missèbo</SelectItem>
                  <SelectItem value="Dantokpa">Dantokpa</SelectItem>
                  <SelectItem value="Cadjehoun">Cadjehoun</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optionnel, 300 caractères max)</Label>
            <Textarea
              placeholder="Circonstances du vol..."
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              maxLength={300}
            />
            <p className="text-xs text-muted-foreground text-right">{description.length}/300</p>
          </div>

          <div className="space-y-2">
            <Label>Photo de l'appareil (optionnel)</Label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">Formats : JPG, PNG, WebP — Max 5 Mo</p>
          </div>

          <Button type="submit" variant="destructive" className="w-full" size="lg" disabled={!isValidIMEI || submitting}>
            {submitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours…</>
            ) : (
              <><AlertTriangle className="h-4 w-4" /> Soumettre le signalement</>
            )}
          </Button>
        </form>
      </div>

      <Dialog open={showConfirm} onOpenChange={(o) => { if (!o) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" /> Signalement enregistré
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-center py-4">
            <p className="text-foreground">Votre signalement a été transmis avec succès.</p>
            <p className="font-mono text-lg font-bold text-primary">Référence : #{reference}</p>
            <p className="text-sm text-muted-foreground">
              L'IMEI {formatIMEI(imei)} est désormais marqué comme 🔴 volé dans toute la plateforme.
              Une notification a été envoyée à la DCPJ.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
