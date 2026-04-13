import DashboardLayout from "@/components/DashboardLayout";
import IMEIScanner from "@/components/IMEIScanner";
import { BarChart3, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DashboardEnqueteur() {
  return (
    <DashboardLayout role="enqueteur">
      <div className="space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">📊 Espace Enquêteur</h1>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-heading font-bold text-destructive">12</p>
            <p className="text-sm text-muted-foreground">Vols signalés (30j)</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-heading font-bold text-warning">5</p>
            <p className="text-sm text-muted-foreground">IMEI suspects</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-heading font-bold text-success">3</p>
            <p className="text-sm text-muted-foreground">Récupérés</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h2 className="font-heading font-semibold text-foreground mb-4">Vérification rapide</h2>
            <IMEIScanner compact />
          </div>
          <div className="glass-card p-5 space-y-4">
            <h2 className="font-heading font-semibold text-foreground">Actions rapides</h2>
            <div className="space-y-2">
              <Link to="/map">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" /> Carte des incidents
                </Button>
              </Link>
              <Link to="/batch">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" /> Import CSV en lot
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" /> Exporter rapport
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
