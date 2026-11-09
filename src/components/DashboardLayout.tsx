import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Search, AlertTriangle, History, User, LogOut, BarChart3, MapPin, Upload, Settings, Cpu, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#081426] text-white shadow-xl lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20"><Shield className="h-5 w-5" /></span>
          <span className="font-heading text-base font-extrabold tracking-tight">TraceIMEI<span className="text-sky-300">-BJ</span></span>
        </div>
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Connecté en tant que</p>
          <p className="mt-1 text-sm font-bold text-white">{roleLabels[role]}</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 pt-5">
          {navItems[role].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-sky-400/15 text-sky-100 shadow-inner"
                  : "text-slate-300 hover:bg-white/[.07] hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-white/10 hover:text-white" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Shield className="h-5 w-5" /></span>
            <span className="font-heading font-bold text-foreground">TraceIMEI-BJ</span>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{roleLabels[role]}</span>
        </header>

        {/* Content */}
        <main className="min-w-0 flex-1 overflow-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 py-2 pb-[max(.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
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
