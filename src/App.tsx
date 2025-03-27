
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PatientPortal from "./pages/PatientPortal";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import { ThemeProvider } from "./hooks/use-theme";
import Blog from "./pages/Blog";
import BlogAdmin from "./pages/BlogAdmin";
import Index from "./pages/Index";

const App = () => {
  // Create a client inside the component to ensure React context is available
  const [queryClient] = useState(() => new QueryClient());
  
  // Initialize dark mode based on user preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('dentalTheme');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
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
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
