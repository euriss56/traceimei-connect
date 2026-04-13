import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";

export default function Verify() {
  return (
    <DashboardLayout role="dealer">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">🔍 Vérifier un IMEI</h1>
        <div className="glass-card p-6">
          <IMEIScanner />
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Conseil :</strong> Tapez <span className="font-mono bg-muted px-1 rounded">*#06#</span> sur le clavier du téléphone pour afficher son IMEI. Vous pouvez aussi le trouver dans les paramètres ou sur l'étiquette sous la batterie.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
