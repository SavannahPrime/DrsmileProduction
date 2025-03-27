
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import PatientPortal from "./pages/PatientPortal";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Blog from "./pages/Blog";
import BlogAdmin from "./pages/BlogAdmin";
import Index from "./pages/Index";

const App = () => {
  // Create a client inside the component to ensure React context is available
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Index />} />
            
            {/* Main routes */}
            <Route path="/patient-portal" element={<PatientPortal />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog-admin" element={<BlogAdmin />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
