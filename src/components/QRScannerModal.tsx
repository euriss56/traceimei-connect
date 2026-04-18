import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import { sanitizeIMEIInput } from "@/lib/imei";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (value: string) => void;
}

const READER_ID = "qr-reader-region";

export default function QRScannerModal({ open, onOpenChange, onScan }: QRScannerModalProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);

    const start = async () => {
      try {
        // Petit délai pour s'assurer que le DOM du modal est monté
        await new Promise((r) => setTimeout(r, 100));
        if (cancelled) return;

        const el = document.getElementById(READER_ID);
        if (!el) {
          setError("Zone de scan introuvable");
          return;
        }

        const scanner = new Html5Qrcode(READER_ID, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            console.log("QR RESULT:", decodedText);
            // Tente d'extraire un IMEI (15 chiffres) du contenu scanné
            const sanitized = sanitizeIMEIInput(decodedText);
            const value = sanitized.length >= 15 ? sanitized.slice(0, 15) : decodedText.trim();
            onScan(value);
            onOpenChange(false);
          },
          (scanErrorMsg) => {
            // erreurs continues de frame, ignorer
          }
        );
      } catch (e: any) {
        console.error("QR scanner error:", e);
        const msg = e?.message ?? String(e);
        if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied")) {
          setError("Accès caméra refusé. Autorisez la caméra dans votre navigateur.");
        } else {
          setError("Impossible de démarrer la caméra : " + msg);
        }
        toast.error("Scanner QR indisponible");
      }
    };

    start();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s) {
        s.stop()
          .then(() => s.clear())
          .catch(() => {
            try { s.clear(); } catch {}
          });
        scannerRef.current = null;
      }
    };
  }, [open, onScan, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scanner un code QR / code-barres</DialogTitle>
          <DialogDescription>
            Pointez la caméra vers le code IMEI imprimé sur le téléphone ou la boîte.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div id={READER_ID} className="w-full overflow-hidden rounded-md border border-border bg-muted" />
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <p className="text-xs text-muted-foreground text-center">
            Astuce : si rien ne s'affiche, vérifiez l'autorisation caméra du navigateur.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
