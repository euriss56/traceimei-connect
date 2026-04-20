import { useState, useEffect } from "react";
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

  const [departementId, setDepartementId] = useState("");
  const [communeId, setCommuneId] = useState("");

  const [departements, setDepartements] = useState<any[]>([]);
  const [communes, setCommunes] = useState<any[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reference, setReference] = useState("");

  const isValidIMEI = imei.length === 15 && validateLuhn(imei);
  
const { data, error } = await supabase
  .from("departements")
  .select("*");

if (error) console.error("DEP ERROR:", error);
setDepartements(data || []);


  console.log("DEPARTEMENTS:", departements);
  console.log("COMMUNES:", communes);

  // 📍 LOAD DEPARTEMENTS
  useEffect(() => {
    const loadDepartements = async () => {
      const { data } = await supabase
        .from("departements")
        .select("*")
        .order("nom");

      setDepartements(data || []);
    };

    loadDepartements();
  }, []);

  // 📍 LOAD COMMUNES
  useEffect(() => {
    const loadCommunes = async () => {
      if (!departementId) return;

      const { data } = await supabase
        .from("communes")
        .select("*")
        .eq("departement_id", departementId)
        .order("nom");

      setCommunes(data || []);
    };

    loadCommunes();
  }, [departementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIMEI || !user) return;

    setSubmitting(true);

    try {
      let photoUrl: string | null = null;

      // 📸 Upload image
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
          toast.error("Erreur upload photo");
          setSubmitting(false);
          return;
        }

        const { data: pub } = supabase.storage
          .from("signalements-photos")
          .getPublicUrl(path);

        photoUrl = pub.publicUrl;
      }

      // 📌 INSERT SIGNALMENT
      const { data: ins, error: insErr } = await supabase
        .from("signalements_vol")
        .insert([{
          imei,
          marque,
          modele,
          date_vol: new Date(dateVol).toISOString(),
          quartier,
          departement_id: departementId || null,
          commune_id: communeId || null,
          description: description || null,
          photo_url: photoUrl,
          signale_par: user.id,
          reference: "PENDING",
        }])
        .select("reference")
        .single();

      if (insErr) {
        toast.error(insErr.message);
        setSubmitting(false);
        return;
      }

      // 📱 UPDATE APPAREILS
      const { error: appErr } = await supabase
        .from("appareils")
        .upsert([{
          imei,
          marque,
          modele,
          tac: imei.slice(0, 8),
          statut: "vole",
          score_anomalie: 1.0,
        }], { onConflict: "imei" });

      if (appErr) console.warn(appErr.message);

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
    setDepartementId("");
    setCommuneId("");
    setShowConfirm(false);
  };

  return (
    <DashboardLayout role="dealer">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="font-bold text-2xl flex items-center gap-2">
          <AlertTriangle className="text-destructive" />
          Signaler un vol
        </h1>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">

          {/* IMEI */}
          <div>
            <Label>IMEI *</Label>
            <Input
              value={formatIMEI(imei)}
              onChange={(e) => setImei(sanitizeIMEIInput(e.target.value))}
              maxLength={17}
              className="font-mono"
            />
          </div>

          {/* MARQUE / MODELE */}
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Marque" value={marque} onChange={(e) => setMarque(e.target.value)} />
            <Input placeholder="Modèle" value={modele} onChange={(e) => setModele(e.target.value)} />
          </div>

          {/* DATE */}
          <Input
            type="datetime-local"
            value={dateVol}
            onChange={(e) => setDateVol(e.target.value)}
          />

          {/* 🟡 DEPARTEMENT */}
          <Select value={departementId} onValueChange={setDepartementId}>
            <SelectTrigger>
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              {departements.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 🟢 COMMUNE */}
          <Select value={communeId} onValueChange={setCommuneId} disabled={!departementId}>
            <SelectTrigger>
              <SelectValue placeholder="Commune" />
            </SelectTrigger>
            <SelectContent>
              {communes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* DESCRIPTION */}
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 300))}
            placeholder="Description"
          />

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={!isValidIMEI || submitting || !departementId || !communeId}
            className="w-full"
          >
            {submitting ? <Loader2 className="animate-spin" /> : "Soumettre"}
          </Button>
        </form>
      </div>

      {/* MODAL */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600 flex items-center gap-2">
              <CheckCircle /> Signalement enregistré
            </DialogTitle>
          </DialogHeader>

          <p>Référence : #{reference}</p>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
