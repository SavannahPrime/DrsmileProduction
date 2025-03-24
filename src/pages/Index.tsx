
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import AdminLogin from '@/components/portal/AdminLogin';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

const Index = () => {
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
      <main className="flex-grow">
        {/* Hero Section with Patient Portal */}
        <section className="pt-20 pb-20 bg-gradient-to-b from-white to-dental-light-blue/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
                  Professional Dental Care
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Trusted Dental Care for Your Whole Family</h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  Dr. Smile Dental Clinic provides comprehensive dental care with state-of-the-art technology and a gentle touch.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/booking')}
                    className="bg-dental-blue hover:bg-dental-blue/90 text-white px-6 py-3 rounded-md font-medium"
                  >
                    Book Appointment
                  </button>
                  <button 
                    onClick={() => navigate('/services')}
                    className="bg-white border border-dental-blue text-dental-blue hover:bg-dental-light-blue px-6 py-3 rounded-md font-medium"
                  >
                    Our Services
                  </button>
                </div>
              </div>
              
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
                      {userType === "patient" ? "Patient Portal" : "Admin Portal"}
                    </span>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Dr. Smile</h2>
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
                  
                  <Card className="shadow-lg border-none overflow-hidden">
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
            </div>
          </div>
        </section>

        {/* Rest of homepage components */}
        <Features />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
