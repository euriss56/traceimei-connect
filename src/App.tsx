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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/dealer" element={<DashboardDealer />} />
            <Route path="/dashboard/technicien" element={<DashboardTechnicien />} />
            <Route path="/dashboard/enqueteur" element={<DashboardEnqueteur />} />
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/report" element={<Report />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/batch" element={<Batch />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/admin/ml" element={<AdminML />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-rgpd" element={<PolitiqueRGPD />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/api-doc" element={<ApiDoc />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
