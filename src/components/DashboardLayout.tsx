import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Search, AlertTriangle, History, User, LogOut, BarChart3, MapPin, Upload, Settings, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

interface DashboardLayoutProps {
  role: UserRole;
  children: ReactNode;
}

const roleLabels: Record<UserRole, string> = {
  dealer: "Dealer",
  technicien: "Technicien",
  enqueteur: "Enquêteur",
  admin: "Administrateur",
};

const navItems: Record<UserRole, { to: string; icon: typeof Search; label: string }[]> = {
  dealer: [
    { to: "/dashboard/dealer", icon: Search, label: "Tableau de bord" },
    { to: "/verify", icon: Search, label: "Vérifier IMEI" },
    { to: "/report", icon: AlertTriangle, label: "Signaler un vol" },
    { to: "/batch", icon: Upload, label: "Import CSV" },
    { to: "/history", icon: History, label: "Historique" },
    { to: "/profile", icon: User, label: "Profil" },
  ],
  technicien: [
    { to: "/dashboard/technicien", icon: Search, label: "Tableau de bord" },
    { to: "/verify", icon: Search, label: "Vérifier IMEI" },
    { to: "/report", icon: AlertTriangle, label: "Signaler" },
    { to: "/history", icon: History, label: "Historique" },
    { to: "/profile", icon: User, label: "Profil" },
  ],
  enqueteur: [
    { to: "/dashboard/enqueteur", icon: BarChart3, label: "Tableau de bord" },
    { to: "/verify", icon: Search, label: "Vérifier IMEI" },
    { to: "/map", icon: MapPin, label: "Carte" },
    { to: "/batch", icon: Upload, label: "Import CSV" },
    { to: "/report", icon: AlertTriangle, label: "Signaler" },
    { to: "/history", icon: History, label: "Historique" },
    { to: "/profile", icon: User, label: "Profil" },
  ],
  admin: [
    { to: "/dashboard/admin", icon: Settings, label: "Tableau de bord" },
    { to: "/verify", icon: Search, label: "Vérifier IMEI" },
    { to: "/map", icon: MapPin, label: "Carte" },
    { to: "/admin/ml", icon: Cpu, label: "Monitoring ML" },
    { to: "/admin/users", icon: Users, label: "Utilisateurs" },
    { to: "/report", icon: AlertTriangle, label: "Signaler" },
    { to: "/history", icon: History, label: "Historique" },
    { to: "/profile", icon: User, label: "Profil" },
  ],
};

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-primary-foreground">
        <div className="p-4 flex items-center gap-2 border-b border-primary-foreground/20">
          <Shield className="h-6 w-6" />
          <span className="font-heading font-bold">TraceIMEI-BJ</span>
        </div>
        <div className="px-4 py-3 border-b border-primary-foreground/10">
          <p className="text-xs opacity-60">Connecté en tant que</p>
          <p className="text-sm font-semibold">{roleLabels[role]}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems[role].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3">
          <Button variant="ghost" className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/")}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-foreground">TraceIMEI-BJ</span>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{roleLabels[role]}</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden flex items-center justify-around border-t border-border bg-card py-2">
          {navItems[role].slice(0, 5).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 p-1 text-xs ${
                location.pathname === item.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
