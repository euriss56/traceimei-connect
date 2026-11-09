import { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { formatIMEI, validateLuhn } from "@/lib/imei";
import { Upload, Download, Clock, FileSpreadsheet, ShieldAlert } from "lucide-react";

interface BatchResult {
  imei: string;
  valid: boolean;
}

export default function Batch() {
  const [results, setResults] = useState<BatchResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setProcessing(true);
    setResults([]);
    const start = Date.now();
    try {
      const content = await file.text();
      const imeis = content.split(/\r?\n/)
        .map((line) => line.replace(/[^0-9]/g, ""))
        .filter((value) => value.length === 15)
        .slice(0, 50);
      setResults(imeis.map((imei) => ({ imei, valid: validateLuhn(imei) })));
      setElapsed((Date.now() - start) / 1000);
    } finally {
      setProcessing(false);
      e.target.value = "";
    }
  }, []);

  const exportCSV = () => {
    const header = "imei,luhn_valid,verification_status\n";
    const rows = results.map((r) => `${r.imei},${r.valid},non_verifie`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "traceimei_controle_format_imei.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = results.filter((result) => result.valid).length;

  return (
    <DashboardLayout role="dealer">
      <div className="space-y-7 animate-fade-in">
        <header className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">Outil professionnel</p>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-foreground">Import CSV — Contrôle en lot</h1>
          <p className="text-sm text-muted-foreground mt-2">Importez jusqu’à 50 numéros IMEI pour contrôler leur format et leur clé de contrôle.</p>
        </header>

        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
          <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <p className="text-sm leading-6 text-foreground">
            <strong>À savoir :</strong> cette page vérifie uniquement la structure des IMEI (algorithme de Luhn). Elle ne consulte pas la base des téléphones signalés et ne détermine donc pas si un appareil est volé ou suspect.
          </p>
        </div>

        <section className="glass-card rounded-2xl border border-border/60 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><FileSpreadsheet className="h-5 w-5" /></div>
            <div><h2 className="font-semibold text-foreground">Importer un fichier</h2><p className="text-xs text-muted-foreground">CSV contenant une colonne IMEI — 15 chiffres par ligne</p></div>
          </div>
          <label className="block cursor-pointer">
            <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 sm:p-10 text-center transition-all hover:border-primary/50 hover:bg-primary/[0.03]">
              <Upload className="h-9 w-9 mx-auto text-primary mb-3" />
              <p className="text-sm font-semibold text-foreground">Cliquez pour sélectionner votre fichier CSV</p>
              <p className="text-xs text-muted-foreground mt-2">50 IMEI maximum · Format .csv</p>
              {fileName && <p className="mt-3 text-xs font-medium text-primary">{fileName}</p>}
            </div>
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFileUpload} disabled={processing} />
          </label>
          {processing && <p className="text-sm text-muted-foreground">Lecture du fichier en cours…</p>}
        </section>

        {results.length > 0 && (
          <section className="glass-card overflow-hidden rounded-2xl border border-border/60 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-border">
              <div>
                <h2 className="font-semibold text-foreground">Résultats du contrôle de format</h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {results.length} IMEI analysés en {elapsed.toFixed(2)} s · {validCount} format(s) valide(s)</p>
              </div>
              <Button variant="outline" size="sm" onClick={exportCSV} className="rounded-xl">
                <Download className="h-4 w-4 mr-1" /> Exporter CSV
              </Button>
            </div>
            <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">#</th>
                    <th className="text-left p-3 font-semibold">IMEI</th>
                    <th className="text-left p-3 font-semibold">Clé Luhn</th>
                    <th className="text-left p-3 font-semibold">Statut de vérification</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.imei + index} className="border-b border-border/70 last:border-0 hover:bg-primary/[0.03] transition-colors">
                      <td className="p-3 text-muted-foreground">{index + 1}</td>
                      <td className="p-3 font-mono text-foreground tracking-wide">{formatIMEI(result.imei)}</td>
                      <td className="p-3"><span className={result.valid ? "text-success font-semibold" : "text-destructive font-semibold"}>{result.valid ? "Valide" : "Invalide"}</span></td>
                      <td className="p-3 text-muted-foreground">Non vérifié dans la base</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
