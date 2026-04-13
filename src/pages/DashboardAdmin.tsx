import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Users, MapPin, Settings, Database, RefreshCw } from "lucide-react";

export default function DashboardAdmin() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">⚙️ Administration</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Utilisateurs", value: "156", icon: Users, color: "text-primary" },
            { label: "IMEI en base", value: "12,340", icon: Database, color: "text-success" },
            { label: "Vols signalés", value: "89", icon: Settings, color: "text-destructive" },
            { label: "AUC-ROC", value: "0.912", icon: Cpu, color: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 space-y-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-5 space-y-3">
            <h2 className="font-heading font-semibold text-foreground">Actions admin</h2>
            <div className="space-y-2">
              <Link to="/admin/ml">
                <Button variant="outline" className="w-full justify-start">
                  <Cpu className="h-4 w-4 mr-2" /> Monitoring ML
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" /> Gestion utilisateurs
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" /> Carte incidents
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" /> Réentraîner le modèle
              </Button>
            </div>
          </div>
          <div className="glass-card p-5 space-y-3">
            <h2 className="font-heading font-semibold text-foreground">Activité récente</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Nouveau signalement — Missèbo (il y a 10 min)</p>
              <p>• Utilisateur créé — dealer_045 (il y a 1h)</p>
              <p>• Import CSV — 30 IMEI traités (il y a 3h)</p>
              <p>• Modèle ML — AUC-ROC: 0.912 (ce matin)</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
