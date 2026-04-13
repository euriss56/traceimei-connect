import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { UserRole } from "@/types";

const mockUsers: { id: string; nom: string; email: string; role: UserRole; marche: string; date: string }[] = [
  { id: "1", nom: "Kofi Mensah", email: "kofi@mail.bj", role: "dealer", marche: "Missèbo", date: "01/03/2026" },
  { id: "2", nom: "Ama Koudjo", email: "ama@mail.bj", role: "technicien", marche: "Dantokpa", date: "15/02/2026" },
  { id: "3", nom: "Ibrahim Saka", email: "ibrahim@arcep.bj", role: "enqueteur", marche: "Cadjehoun", date: "01/01/2026" },
  { id: "4", nom: "Grace Houssou", email: "grace@getech.bj", role: "admin", marche: "Autre", date: "10/12/2025" },
  { id: "5", nom: "Pierre Dossou", email: "pierre@mail.bj", role: "dealer", marche: "Akpakpa", date: "20/03/2026" },
];

const roleBadge: Record<UserRole, string> = {
  dealer: "bg-success/10 text-success",
  technicien: "bg-warning/10 text-warning",
  enqueteur: "bg-primary/10 text-primary",
  admin: "bg-destructive/10 text-destructive",
};

const roleLabel: Record<UserRole, string> = {
  dealer: "Dealer",
  technicien: "Technicien",
  enqueteur: "Enquêteur",
  admin: "Admin",
};

export default function AdminUsers() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Gestion des utilisateurs
          </h1>
          <Button variant="hero" size="sm">
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un utilisateur…" className="pl-9" />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-semibold">Nom</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Rôle</th>
                  <th className="text-left p-3 font-semibold">Marché</th>
                  <th className="text-left p-3 font-semibold">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{u.nom}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>
                        {roleLabel[u.role]}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{u.marche}</td>
                    <td className="p-3 text-muted-foreground">{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
