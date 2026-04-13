import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sanitizeIMEIInput, formatIMEI, validateLuhn } from "@/lib/imei";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function Report() {
  const [imei, setImei] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [dateVol, setDateVol] = useState("");
  const [quartier, setQuartier] = useState("Missebo");
  const [description, setDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [reference, setReference] = useState("");

  const isValidIMEI = imei.length === 15 && validateLuhn(imei);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIMEI) return;
    const ref = `BJ-2026-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`;
    setReference(ref);
    setShowConfirm(true);
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
              <Input placeholder="ex: Samsung" value={marque} onChange={(e) => setMarque(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Modèle *</Label>
              <Input placeholder="ex: Galaxy A14" value={modele} onChange={(e) => setModele(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Date et heure du vol *</Label>
              <Input type="datetime-local" value={dateVol} onChange={(e) => setDateVol(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Quartier / Lieu *</Label>
              <Select value={quartier} onValueChange={setQuartier}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Missebo">Missèbo</SelectItem>
                  <SelectItem value="Dantokpa">Dantokpa</SelectItem>
                  <SelectItem value="Cadjehoun">Cadjehoun</SelectItem>
                  <SelectItem value="Akpakpa">Akpakpa</SelectItem>
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
            <Input type="file" accept=".jpg,.png,.webp" />
            <p className="text-xs text-muted-foreground">Formats : JPG, PNG, WebP — Max 5 Mo</p>
          </div>

          <Button type="submit" variant="destructive" className="w-full" size="lg" disabled={!isValidIMEI}>
            <AlertTriangle className="h-4 w-4" />
            Soumettre le signalement
          </Button>
        </form>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
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
