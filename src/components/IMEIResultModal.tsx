import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import AnomalyScoreCard from "./AnomalyScoreCard";
import type { IMEIVerificationResult } from "@/types";
import { formatIMEI } from "@/lib/imei";
import { AlertTriangle, MapPin, Calendar, Wrench, Clock } from "lucide-react";

interface IMEIResultModalProps {
  result: IMEIVerificationResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function IMEIResultModal({ result, open, onOpenChange }: IMEIResultModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Résultat de vérification</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 animate-fade-in">
          {/* Status */}
          <div className="text-center space-y-2">
            <StatusBadge statut={result.statut} size="lg" />
            <p className="font-mono text-lg tracking-widest text-foreground">
              {formatIMEI(result.imei)}
            </p>
          </div>

          {/* Device info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="glass-card p-3 space-y-1">
              <p className="text-muted-foreground text-xs">Marque / Modèle</p>
              <p className="font-semibold">{result.marque} {result.modele}</p>
            </div>
            <div className="glass-card p-3 space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Calendar className="h-3 w-3" /> Enregistré le
              </div>
              <p className="font-semibold">{result.dateEnregistrement.toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="glass-card p-3 space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Wrench className="h-3 w-3" /> Réparations
              </div>
              <p className="font-semibold">{result.reparationsCount} entrée(s)</p>
            </div>
            <div className="glass-card p-3 space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <MapPin className="h-3 w-3" /> Localisation
              </div>
              <p className="font-semibold">{result.derniereLocalisation}</p>
            </div>
          </div>

          {/* ML Score */}
          <AnomalyScoreCard score={result.scoreAnomalie} features={result.features} />

          {/* Response time */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Réponse en {result.tempsReponse.toFixed(1)}s
          </div>

          {/* Action button */}
          {result.statut !== 'vole' && (
            <Button variant="destructive" className="w-full" size="lg">
              <AlertTriangle className="h-4 w-4" />
              Signaler comme volé
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
