import { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { formatIMEI, validateLuhn, mockVerifyIMEI } from "@/lib/imei";
import type { IMEIStatut } from "@/types";
import { Upload, Download, Clock } from "lucide-react";

interface BatchResult {
  imei: string;
  statut: IMEIStatut;
  score: number;
  valid: boolean;
}

export default function Batch() {
  const [results, setResults] = useState<BatchResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    // Skip header if present
    const imeis = lines
      .map((l) => l.replace(/[^0-9]/g, ""))
      .filter((l) => l.length === 15)
      .slice(0, 50);

    if (imeis.length === 0) return;

    setProcessing(true);
    setResults([]);
    const start = Date.now();

    // Process one by one for progressive display
    for (const imei of imeis) {
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 100));
      const res = mockVerifyIMEI(imei);
      setResults((prev) => [
        ...prev,
        {
          imei,
          statut: res?.statut || "suspect",
          score: res?.scoreAnomalie || 0,
          valid: validateLuhn(imei),
        },
      ]);
    }

    setElapsed((Date.now() - start) / 1000);
    setProcessing(false);
  }, []);

  const exportCSV = () => {
    const header = "imei,statut,score_anomalie,luhn_valid\n";
    const rows = results.map((r) => `${r.imei},${r.statut},${r.score},${r.valid}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trace_imei_resultats.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="dealer">
      <div className="space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">📁 Import CSV — Vérification en lot</h1>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Cliquez pour importer un fichier CSV</p>
                <p className="text-xs text-muted-foreground mt-1">Format : une colonne "imei" (15 chiffres par ligne) — Max 50 IMEI</p>
              </div>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={processing} />
            </label>
          </div>

          {processing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Traitement en cours… {results.length} IMEI traité(s)
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {results.length} IMEI traités{elapsed > 0 && ` en ${elapsed.toFixed(1)}s`}
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-1" /> Exporter CSV
              </Button>
            </div>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">IMEI</th>
                    <th className="text-left p-3 font-semibold">Statut</th>
                    <th className="text-left p-3 font-semibold">Score</th>
                    <th className="text-left p-3 font-semibold">Luhn</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-b border-border last:border-0 animate-fade-in">
                      <td className="p-3 text-muted-foreground">{i + 1}</td>
                      <td className="p-3 font-mono text-foreground">{formatIMEI(r.imei)}</td>
                      <td className="p-3"><StatusBadge statut={r.statut} size="sm" /></td>
                      <td className="p-3 font-mono text-foreground">{r.score.toFixed(2)}</td>
                      <td className="p-3">{r.valid ? <span className="text-success">✓</span> : <span className="text-destructive">✗</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
