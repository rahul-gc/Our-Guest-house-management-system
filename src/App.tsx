import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { HotelProvider } from "@/context/HotelContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import RoomStatus from "@/pages/RoomStatus";
import GuestEntry from "@/pages/GuestEntry";
import CheckoutPage from "@/pages/CheckoutPage";
import Records from "@/pages/Records";
import Reports from "@/pages/Reports";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <LoginPage />;

  return (
    <HotelProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<RoomStatus />} />
          <Route path="/guest-entry" element={<GuestEntry />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/records" element={<Records />} />
          {role === 'admin' && <Route path="/reports" element={<Reports />} />}
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
