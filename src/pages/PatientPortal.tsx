
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { UserCircle, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AppointmentTab from '@/components/portal/AppointmentTab';
import AdvisoryTab from '@/components/portal/AdvisoryTab';
import MessagingTab from '@/components/portal/MessagingTab';
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/portal/Sidebar';
import Navbar from '@/components/layout/Navbar';

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

  if (isAuthenticated && clientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16"></div> {/* Spacer for fixed navbar */}
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar 
            activeTab={activePortalTab}
            onTabChange={setActivePortalTab}
            userFirstName={clientData.first_name}
            userLastName={clientData.last_name}
          />
          
          <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-dental-blue">My Patient Portal</h1>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-dental-blue border-dental-blue/30"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Main Website
              </Button>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-lg border-none overflow-hidden">
                <CardContent className="p-6">
                  <Tabs value={activePortalTab} onValueChange={setActivePortalTab}>
                    <TabsContent value="appointments">
                      <AppointmentTab clientId={clientData.id} />
                    </TabsContent>
                    
                    <TabsContent value="advisory">
                      <AdvisoryTab clientId={clientData.id} />
                    </TabsContent>
                    
                    <TabsContent value="messaging">
                      <MessagingTab clientId={clientData.id} clientName={`${clientData.first_name} ${clientData.last_name}`} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="h-16"></div> {/* Spacer for fixed navbar */}
      <Navbar />
      
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
                  <div className="flex border-b mb-6">
                    <Button
                      variant="ghost"
                      className={`flex-1 rounded-none border-b-2 ${
                        activeTab === 'login' 
                          ? 'border-dental-blue text-dental-blue' 
                          : 'border-transparent text-gray-500'
                      }`}
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </Button>
                    <Button
                      variant="ghost"
                      className={`flex-1 rounded-none border-b-2 ${
                        activeTab === 'register' 
                          ? 'border-dental-blue text-dental-blue' 
                          : 'border-transparent text-gray-500'
                      }`}
                      onClick={() => setActiveTab('register')}
                    >
                      Register
                    </Button>
                  </div>
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
