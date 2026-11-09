import { useState } from "react";
import { Shield, AlertTriangle, XCircle, Search, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth.tsx";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type VerificationStatus = "safe" | "suspect" | "stolen" | "unknown";

interface VerifyResult {
  status: VerificationStatus;
  score: number | null;
  phone?: { brand: string; model: string; created_at: string; city: string };
  reportCount: number;
}

export default function VerifyIMEI() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [imei, setImei] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [imeiError, setImeiError] = useState("");

  const handleImeiChange = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 15);
    setImei(clean);
    setImeiError(clean.length > 0 && clean.length < 15 ? `${15 - clean.length} chiffres restants` : "");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{15}$/.test(imei)) {
      toast({ title: "IMEI invalide", description: "L'IMEI doit contenir exactement 15 chiffres.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const [{ data: device, error: deviceError }, { data: reports, error: reportsError }] = await Promise.all([
        supabase.from("appareils")
          .select("imei, marque, modele, statut, score_anomalie, created_at")
          .eq("imei", imei)
          .maybeSingle(),
        supabase.from("signalements_vol")
          .select("id, marque, modele, created_at, quartier, reference")
          .eq("imei", imei)
          .order("created_at", { ascending: false }),
      ]);

      if (deviceError) throw deviceError;
      if (reportsError) throw reportsError;

      const reportCount = reports?.length ?? 0;
      const status: VerificationStatus = device?.statut === "vole" || reportCount > 0
        ? "stolen"
        : device?.statut === "suspect"
          ? "suspect"
          : device?.statut === "legitime"
            ? "safe"
            : "unknown";

      const latestReport = reports?.[0];
      const verifyResult: VerifyResult = {
        status,
        score: device ? Number(device.score_anomalie) : null,
        reportCount,
        phone: device ? {
          brand: device.marque || latestReport?.marque || "Non renseignée",
          model: device.modele || latestReport?.modele || "Non renseigné",
          created_at: device.created_at,
          city: latestReport?.quartier || "Non renseigné",
        } : undefined,
      };

      // L'historique n'accepte que les statuts connus du référentiel.
      if (user && device) {
        const { error: historyError } = await supabase.from("enregistrements_imei").insert({
          utilisateur_id: user.id,
          imei,
          resultat: device.statut,
          score_anomalie: Number(device.score_anomalie) || 0,
          features: {},
        });
        if (historyError) console.warn("Historique non enregistré :", historyError.message);
      }

      setResult(verifyResult);
    } catch (error) {
      console.error("Erreur de vérification IMEI :", error);
      toast({
        title: "Vérification impossible",
        description: "La base de données n'a pas pu confirmer le statut de cet IMEI. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    safe: {
      icon: Shield, color: "text-success", bg: "bg-success/10", border: "border-success/30",
      label: "IMEI RÉPERTORIÉ COMME LÉGITIME", gradient: "from-success/20 to-success/5",
    },
    suspect: {
      icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30",
      label: "IMEI SIGNALÉ COMME SUSPECT", gradient: "from-warning/20 to-warning/5",
    },
    stolen: {
      icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30",
      label: "IMEI ASSOCIÉ À UN SIGNALEMENT DE VOL", gradient: "from-destructive/20 to-destructive/5",
    },
    unknown: {
      icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted", border: "border-border",
      label: "IMEI NON RÉPERTORIÉ", gradient: "from-muted to-card",
    },
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in max-w-3xl mx-auto space-y-7">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Vérifier un IMEI</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Consultez les informations réellement présentes dans la base TraceIMEI-BJ.
          </p>
        </div>

        <Card className="border-border/60 shadow-lg shadow-black/[0.03] transition-shadow hover:shadow-xl hover:shadow-black/[0.05]">
          <CardContent className="pt-6 sm:p-7">
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={imei}
                    onChange={e => handleImeiChange(e.target.value)}
                    placeholder="Entrer le numéro IMEI (15 chiffres)"
                    className="pl-10 font-mono h-14 text-base tracking-wider rounded-xl bg-background/80"
                    maxLength={15}
                    inputMode="numeric"
                    aria-label="Numéro IMEI"
                  />
                </div>
                {imeiError && <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1"><Info size={12} />{imeiError}</p>}
                <p className="text-xs text-muted-foreground mt-1.5">
                  💡 Tapez <code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">*#06#</code> sur le téléphone pour obtenir l'IMEI.
                </p>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading || imei.length !== 15}>
                {loading ? "Vérification en cours…" : "Vérifier l'IMEI"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (() => {
          const config = statusConfig[result.status];
          const Icon = config.icon;
          return (
            <Card className={`border-2 ${config.border} animate-fade-in overflow-hidden`}>
              <CardContent className={`pt-6 space-y-5 bg-gradient-to-br ${config.gradient}`}>
                <div className={`flex items-center gap-3 ${config.color}`}>
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}><Icon size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold">{config.label}</h3>
                    <p className="text-xs text-muted-foreground">
                      {result.score !== null ? `Score d'anomalie enregistré : ${(result.score * 100).toFixed(0)}%` : "Aucun score disponible dans la base."}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Signalements associés : <strong className="text-foreground">{result.reportCount}</strong>
                  </p>
                  {result.status === "unknown" && (
                    <p className="rounded-lg bg-muted/70 p-3 text-sm text-muted-foreground">
                      Cet IMEI n’a pas été trouvé dans les enregistrements consultés. Cela ne signifie pas que le téléphone est légitime ou qu’il n’a jamais été volé.
                    </p>
                  )}
                  {result.phone && (
                    <div className="bg-muted/50 rounded-xl p-4 space-y-2 mt-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Détails disponibles</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Marque :</span> <strong className="text-foreground">{result.phone.brand}</strong></div>
                        <div><span className="text-muted-foreground">Modèle :</span> <strong className="text-foreground">{result.phone.model}</strong></div>
                        <div><span className="text-muted-foreground">Zone :</span> <strong className="text-foreground">{result.phone.city}</strong></div>
                        <div><span className="text-muted-foreground">Enregistré le :</span> <strong className="text-foreground">{new Date(result.phone.created_at).toLocaleDateString("fr-FR")}</strong></div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  Résultat basé sur les données disponibles dans TraceIMEI-BJ. Une absence de signalement ne constitue pas une garantie de propriété.
                </p>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    </DashboardLayout>
  );
}
