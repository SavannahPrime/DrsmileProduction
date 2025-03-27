
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, Calendar, MessageSquare, Stethoscope, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AppointmentTab from '@/components/portal/AppointmentTab';
import AdvisoryTab from '@/components/portal/AdvisoryTab';
import MessagingTab from '@/components/portal/MessagingTab';
import { useToast } from "@/hooks/use-toast";

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [activePortalTab, setActivePortalTab] = useState("appointments");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Check if user is admin
        const { data: authorData, error: authorError } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('email', session.user?.email)
          .single();
        
        if (!authorError && authorData) {
          // User is admin, redirect to admin dashboard
          navigate('/admin-dashboard');
          return;
        }
        
        // Fetch client data
        const { data: client, error } = await supabase
          .from('clients')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching client data:', error);
        } else {
          setClientData(client);
        }
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setIsAuthenticated(true);
          checkSession(); // Refetch client data
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          setClientData(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setClientData(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (isAuthenticated && clientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <UserCircle className="h-8 w-8 text-dental-blue" />
              <div>
                <h1 className="text-xl font-semibold text-dental-blue">Dr. Smile Dental Clinic</h1>
                <p className="text-sm text-gray-500">Welcome, {clientData.first_name} {clientData.last_name}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <Card className="shadow-lg border-none overflow-hidden">
            <Tabs value={activePortalTab} onValueChange={setActivePortalTab} className="w-full">
              <TabsList className="grid grid-cols-3 p-0 h-auto">
                <TabsTrigger value="appointments" className="py-3 data-[state=active]:bg-dental-light-blue">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="advisory" className="py-3 data-[state=active]:bg-dental-light-blue">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Doctor's Advice
                </TabsTrigger>
                <TabsTrigger value="messaging" className="py-3 data-[state=active]:bg-dental-light-blue">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <CardContent className="p-6">
                <TabsContent value="appointments" className="mt-0 pt-4">
                  <AppointmentTab clientId={clientData.id} />
                </TabsContent>
                
                <TabsContent value="advisory" className="mt-0 pt-4">
                  <AdvisoryTab clientId={clientData.id} />
                </TabsContent>
                
                <TabsContent value="messaging" className="mt-0 pt-4">
                  <MessagingTab clientId={clientData.id} clientName={`${clientData.first_name} ${clientData.last_name}`} />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </main>
        
        <footer className="bg-white shadow-sm mt-auto py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Dr. Smile Dental Clinic. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-dental-blue">Dr. Smile Dental Clinic</h1>
        </div>
      </header>
      
      <main className="flex-grow pt-12 pb-20">
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
      
      <footer className="bg-white shadow-sm mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Dr. Smile Dental Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PatientPortal;
