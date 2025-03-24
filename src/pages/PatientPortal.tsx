
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from 'lucide-react';

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState("login");
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
      <main className="flex-grow pt-32 pb-20 bg-gradient-to-b from-white to-dental-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 animate-fade-up">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-dental-light-blue rounded-full mb-4">
                <UserCircle className="h-10 w-10 text-dental-blue" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Patient Portal</h1>
              <p className="text-muted-foreground">
                Access your dental records, appointments, and more.
              </p>
            </div>
            
            <Card className="shadow-lg border-none overflow-hidden animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-8">
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
