import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Shield, User, MapPin, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Profile() {
  const verificationsThisMonth = 14;
  const threshold = 20;
  const hasBadge = verificationsThisMonth >= threshold;
  const progressPct = Math.min((verificationsThisMonth / threshold) * 100, 100);

  return (
    <DashboardLayout role="dealer">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">👤 Mon profil</h1>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">Euriss Fanou</h2>
              <p className="text-sm text-muted-foreground">euriss@getech.bj</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4" /> Rôle : <span className="text-foreground font-medium">Dealer</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> Marché : <span className="text-foreground font-medium">Missèbo</span>
            </div>
          </div>
        </div>

        {/* Certification */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-foreground">Certification Dealer</h2>
            {hasBadge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-semibold">
                <Shield className="h-4 w-4" /> Certifié TraceIMEI-BJ
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vérifications ce mois</span>
              <span className="font-mono font-semibold text-foreground">{verificationsThisMonth} / {threshold}</span>
            </div>
            <Progress value={progressPct} className="h-2" />
            {!hasBadge && (
              <p className="text-xs text-muted-foreground">
                Encore {threshold - verificationsThisMonth} vérifications pour obtenir le badge "Dealer Traçable ARCEP"
              </p>
            )}
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-card p-6 space-y-3">
          <h2 className="font-heading font-semibold text-foreground">Abonnement</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-primary rounded-lg p-4 bg-primary/5">
              <p className="font-bold text-foreground">Gratuit</p>
              <p className="text-xs text-muted-foreground">Plan actuel</p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="font-bold text-foreground">Premium</p>
              <p className="text-xs text-muted-foreground">&lt; 2 000 FCFA/mois</p>
              <Button variant="outline" size="sm" className="mt-2">Mettre à niveau</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
