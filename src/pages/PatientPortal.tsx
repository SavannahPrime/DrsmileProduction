
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import AdminLogin from '@/components/portal/AdminLogin';
import AdminRegister from '@/components/portal/AdminRegister';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<"patient" | "admin">("patient");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If session exists, check if user is admin
        const { data: authorData, error: authorError } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('email', session.user?.email)
          .single();
        
        if (!authorError && authorData) {
          // User is admin, redirect to admin dashboard
          navigate('/admin-dashboard');
        } else {
          // User is patient, redirect to booking
          navigate('/booking');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
                {userType === "patient" ? "Patient Portal" : "Admin Portal"}
              </span>
              <h1 className="text-3xl font-bold mb-2">Welcome to Dr. Smile</h1>
              <p className="text-muted-foreground">
                {userType === "patient" 
                  ? "Access your dental records, appointments, and more." 
                  : "Access admin dashboard, manage content and appointments."}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setUserType("patient")}
                  className={`px-4 py-1 rounded-l-md ${userType === "patient" 
                    ? "bg-dental-blue text-white" 
                    : "bg-gray-100 text-gray-600"}`}
                >
                  Patient
                </button>
                <button
                  onClick={() => setUserType("admin")}
                  className={`px-4 py-1 rounded-r-md ${userType === "admin" 
                    ? "bg-dental-blue text-white" 
                    : "bg-gray-100 text-gray-600"}`}
                >
                  Admin
                </button>
              </div>
            </div>
            
            <Card className="shadow-lg border-none overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
                {userType === "patient" ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6 w-full">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <PatientLogin />
                    </TabsContent>
                    <TabsContent value="register">
                      <PatientRegister />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <Tabs value="login" className="w-full">
                    <TabsList className="grid grid-cols-1 mb-6 w-full">
                      <TabsTrigger value="login">Admin Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <AdminLogin />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientPortal;
