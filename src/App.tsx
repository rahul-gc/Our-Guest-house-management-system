import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { HotelProvider } from "@/context/HotelContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardNew from "@/pages/DashboardNew";
import RoomStatus from "@/pages/RoomStatus";
import GuestEntryNew from "@/pages/GuestEntryNew";
import CheckoutPageNew from "@/pages/CheckoutPageNew";
import RecordsNew from "@/pages/RecordsNew";
import ReportsNew from "@/pages/ReportsNew";
import UserDashboard from "@/pages/UserDashboard";
import UserBooking from "@/pages/UserBooking";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <LoginPage />;

  // User routes - limited access
  if (role === 'user') {
    return (
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-booking" element={<UserBooking />} />
        <Route path="*" element={<Navigate to="/user-dashboard" replace />} />
      </Routes>
    );
  }

  // Admin/Staff routes - full access
  return (
    <HotelProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardNew />} />
          <Route path="/rooms" element={<RoomStatus />} />
          <Route path="/guest-entry" element={<GuestEntryNew />} />
          <Route path="/checkout" element={<CheckoutPageNew />} />
          <Route path="/records" element={<RecordsNew />} />
          {role === 'admin' && <Route path="/reports" element={<ReportsNew />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </HotelProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
