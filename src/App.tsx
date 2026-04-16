import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardDealer from "./pages/DashboardDealer";
import DashboardTechnicien from "./pages/DashboardTechnicien";
import DashboardEnqueteur from "./pages/DashboardEnqueteur";
import DashboardAdmin from "./pages/DashboardAdmin";
import Verify from "./pages/Verify";
import Report from "./pages/Report";
import HistoryPage from "./pages/History";
import Profile from "./pages/Profile";
import Batch from "./pages/Batch";
import MapPage from "./pages/MapPage";
import AdminML from "./pages/AdminML";
import AdminUsers from "./pages/AdminUsers";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueRGPD from "./pages/PolitiqueRGPD";
import Contact from "./pages/Contact";
import ApiDoc from "./pages/ApiDoc";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-rgpd" element={<PolitiqueRGPD />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/api-doc" element={<ApiDoc />} />

            {/* Dashboards par rôle */}
            <Route path="/dashboard/dealer" element={<ProtectedRoute allowedRoles={["dealer"]}><DashboardDealer /></ProtectedRoute>} />
            <Route path="/dashboard/technicien" element={<ProtectedRoute allowedRoles={["technicien"]}><DashboardTechnicien /></ProtectedRoute>} />
            <Route path="/dashboard/enqueteur" element={<ProtectedRoute allowedRoles={["enqueteur"]}><DashboardEnqueteur /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={["admin"]}><DashboardAdmin /></ProtectedRoute>} />

            {/* Routes authentifiées (tous rôles) */}
            <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/batch" element={<ProtectedRoute allowedRoles={["dealer", "enqueteur", "admin"]}><Batch /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute allowedRoles={["enqueteur", "admin"]}><MapPage /></ProtectedRoute>} />

            {/* Routes admin */}
            <Route path="/admin/ml" element={<ProtectedRoute allowedRoles={["admin"]}><AdminML /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
