import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanitizeIMEIInput, formatIMEI, validateLuhn, mockVerifyIMEI } from "@/lib/imei";
import type { IMEIVerificationResult } from "@/types";
import IMEIResultModal from "./IMEIResultModal";
import { Search, Camera, Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import QRScannerModal from "./QRScannerModal";

interface IMEIScannerProps {
  compact?: boolean;
  onResult?: (result: IMEIVerificationResult) => void;
}

export default function IMEIScanner({ compact = false, onResult }: IMEIScannerProps) {
  const { user } = useAuth();
  const [rawInput, setRawInput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IMEIVerificationResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [nfcLoading, setNfcLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeIMEIInput(e.target.value);
    setRawInput(sanitized);
    if (sanitized.length === 15) {
      setIsValid(validateLuhn(sanitized));
    } else {
      setIsValid(null);
    }
  };

  const persistVerification = async (res: IMEIVerificationResult) => {
    if (!user) return;
    try {
      // 1) Upsert appareil
      const { error: appErr } = await supabase.from("appareils").upsert(
        [{
          imei: res.imei,
          marque: res.marque,
          modele: res.modele,
          tac: res.imei.slice(0, 8),
          statut: res.statut,
          score_anomalie: res.scoreAnomalie,
        }],
        { onConflict: "imei" }
      );
      if (appErr) console.warn("appareils upsert:", appErr.message);

      // 2) Insert enregistrement with 8 ML features
      const { error: recErr } = await supabase.from("enregistrements_imei").insert([{
        imei: res.imei,
        utilisateur_id: user.id,
        resultat: res.statut,
        score_anomalie: res.scoreAnomalie,
        features: res.features as never,
      }]);
      if (recErr) {
        console.error("enregistrement insert:", recErr);
        toast.error("Échec de l'enregistrement de la vérification");
        return;
      }

      // 3) Increment user verifications_count
      const { data: profile } = await supabase
        .from("profiles")
        .select("verifications_count")
        .eq("user_id", user.id)
        .single();
      if (profile) {
        await supabase
          .from("profiles")
          .update({ verifications_count: (profile.verifications_count ?? 0) + 1 })
          .eq("user_id", user.id);
      }
    } catch (e) {
      console.error("persistVerification error:", e);
    }
  };

  const handleVerifyValue = useCallback(async (value: string) => {
    if (value.length !== 15) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    const res = mockVerifyIMEI(value);
    if (res) {
      await persistVerification(res);
      setResult(res);
      setShowModal(true);
      onResult?.(res);
    }
    setLoading(false);
  }, [onResult, user]);

  const handleVerify = useCallback(() => handleVerifyValue(rawInput), [rawInput, handleVerifyValue]);

  const handleQRResult = (value: string) => {
    const sanitized = sanitizeIMEIInput(value);
    setRawInput(sanitized);
    if (sanitized.length === 15) {
      const ok = validateLuhn(sanitized);
      setIsValid(ok);
      if (ok) {
        toast.success("IMEI scanné, vérification en cours…");
        setTimeout(() => handleVerifyValue(sanitized), 50);
      } else {
        toast.error("IMEI scanné invalide (Luhn)");
      }
    } else {
      toast.message("Code scanné", { description: value });
    }
  };

  const handleNFCScan = async () => {
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      toast.error("NFC non supporté sur cet appareil/navigateur");
      return;
    }
    try {
      setNfcLoading(true);
      // @ts-expect-error - Web NFC types non standard
      const ndef = new window.NDEFReader();
      await ndef.scan();
      toast.message("Approchez un tag NFC du téléphone…");
      ndef.onreadingerror = () => {
        console.error("NFC reading error");
        toast.error("Échec de lecture NFC");
        setNfcLoading(false);
      };
      ndef.onreading = (event: any) => {
        const decoder = new TextDecoder();
        let payload = "";
        for (const record of event.message.records) {
          try { payload += decoder.decode(record.data); } catch {}
        }
        console.log("NFC DATA:", payload, "serial:", event.serialNumber);
        const sanitized = sanitizeIMEIInput(payload);
        if (sanitized.length >= 15) {
          handleQRResult(sanitized.slice(0, 15));
        } else {
          toast.message("Tag NFC lu", { description: payload || event.serialNumber });
        }
        setNfcLoading(false);
      };
    } catch (e: any) {
      console.error("NFC error:", e);
      toast.error("NFC indisponible : " + (e?.message ?? "erreur inconnue"));
      setNfcLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && rawInput.length === 15 && isValid) {
      handleVerify();
    }
  };

  return (
    <>
      <div className={compact ? "space-y-3" : "space-y-4"}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Saisir les 15 chiffres IMEI"
            value={formatIMEI(rawInput)}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-12 h-14 text-lg font-mono tracking-wider border-2 focus:border-primary"
            maxLength={17}
          />
          {isValid !== null && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl ${isValid ? "text-success" : "text-destructive"}`}>
              {isValid ? "✓" : "✗"}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="scan"
            className="flex-1"
            onClick={handleVerify}
            disabled={rawInput.length !== 15 || !isValid || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Vérification…
              </span>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Vérifier l'IMEI
              </>
            )}
          </Button>
          {!compact && (
            <>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-[56px]"
                title="Scanner code-barres / QR"
                onClick={() => setShowQR(true)}
              >
                <Camera className="h-5 w-5" />
                <span className="hidden sm:inline">Scanner</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="min-h-[56px]"
                title="Lecture NFC"
                onClick={handleNFCScan}
                disabled={nfcLoading}
              >
                <Radio className={`h-5 w-5 ${nfcLoading ? "animate-pulse" : ""}`} />
                <span className="hidden sm:inline">{nfcLoading ? "NFC…" : "NFC"}</span>
              </Button>
            </>
          )}
        </div>

        {!compact && (
          <p className="text-xs text-muted-foreground text-center">
            Tapez *#06# sur votre téléphone pour afficher le numéro IMEI
          </p>
        )}
      </div>

      {result && (
        <IMEIResultModal
          result={result}
          open={showModal}
          onOpenChange={setShowModal}
        />
      )}
    </>
  );
}
