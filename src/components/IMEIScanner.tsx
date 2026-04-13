import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sanitizeIMEIInput, formatIMEI, validateLuhn, mockVerifyIMEI } from "@/lib/imei";
import type { IMEIVerificationResult } from "@/types";
import IMEIResultModal from "./IMEIResultModal";
import { Search, Camera, Radio } from "lucide-react";

interface IMEIScannerProps {
  compact?: boolean;
  onResult?: (result: IMEIVerificationResult) => void;
}

export default function IMEIScanner({ compact = false, onResult }: IMEIScannerProps) {
  const [rawInput, setRawInput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IMEIVerificationResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeIMEIInput(e.target.value);
    setRawInput(sanitized);
    if (sanitized.length === 15) {
      setIsValid(validateLuhn(sanitized));
    } else {
      setIsValid(null);
    }
  };

  const handleVerify = useCallback(async () => {
    if (rawInput.length !== 15) return;
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));
    const res = mockVerifyIMEI(rawInput);
    setLoading(false);
    if (res) {
      setResult(res);
      setShowModal(true);
      onResult?.(res);
    }
  }, [rawInput, onResult]);

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
            maxLength={17} // 15 digits + 2 spaces
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
              <Button variant="outline" size="lg" className="min-h-[56px]" title="Scanner code-barres">
                <Camera className="h-5 w-5" />
                <span className="hidden sm:inline">Scanner</span>
              </Button>
              <Button variant="outline" size="lg" className="min-h-[56px]" title="Lecture NFC" disabled>
                <Radio className="h-5 w-5" />
                <span className="hidden sm:inline">NFC</span>
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
