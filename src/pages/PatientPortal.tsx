
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PatientLogin from '@/components/portal/PatientLogin';
import PatientRegister from '@/components/portal/PatientRegister';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from "@/integrations/supabase/client";
import { UserCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AppointmentTab from '@/components/portal/AppointmentTab';
import AdvisoryTab from '@/components/portal/AdvisoryTab';
import MessagingTab from '@/components/portal/MessagingTab';
import { useToast } from "@/hooks/use-toast";
import Sidebar from '@/components/portal/Sidebar';
import { ThemeProvider } from '@/hooks/use-theme';

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
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
          <Sidebar 
            activeTab={activePortalTab}
            onTabChange={setActivePortalTab}
            userFirstName={clientData.first_name}
            userLastName={clientData.last_name}
          />
          
          <main className="flex-1 p-8">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-lg border-none overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <TabsContent value="appointments" className={activePortalTab === 'appointments' ? 'block' : 'hidden'}>
                    <AppointmentTab clientId={clientData.id} />
                  </TabsContent>
                  
                  <TabsContent value="advisory" className={activePortalTab === 'advisory' ? 'block' : 'hidden'}>
                    <AdvisoryTab clientId={clientData.id} />
                  </TabsContent>
                  
                  <TabsContent value="messaging" className={activePortalTab === 'messaging' ? 'block' : 'hidden'}>
                    <MessagingTab clientId={clientData.id} clientName={`${clientData.first_name} ${clientData.last_name}`} />
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-dental-blue dark:text-blue-400">Dr. Smile Dental Clinic</h1>
          </div>
        </header>
        
        <main className="flex-grow pt-12 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8 animate-fade-up">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-dental-light-blue dark:bg-blue-900 rounded-full mb-4">
                  <UserCircle className="h-10 w-10 text-dental-blue dark:text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2 dark:text-white">Patient Portal</h1>
                <p className="text-muted-foreground dark:text-gray-400">
                  Access your dental records, appointments, and more.
                </p>
              </div>
              
              <Card className="shadow-lg border-none overflow-hidden animate-fade-up dark:bg-gray-800 dark:border-gray-700" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex border-b mb-6">
                      <Button
                        variant="ghost"
                        className={`flex-1 rounded-none border-b-2 ${
                          activeTab === 'login' 
                            ? 'border-dental-blue dark:border-blue-400 text-dental-blue dark:text-blue-400' 
                            : 'border-transparent text-gray-500 dark:text-gray-400'
                        }`}
                        onClick={() => setActiveTab('login')}
                      >
                        Login
                      </Button>
                      <Button
                        variant="ghost"
                        className={`flex-1 rounded-none border-b-2 ${
                          activeTab === 'register' 
                            ? 'border-dental-blue dark:border-blue-400 text-dental-blue dark:text-blue-400' 
                            : 'border-transparent text-gray-500 dark:text-gray-400'
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
        
        <footer className="bg-white dark:bg-gray-800 shadow-sm mt-auto py-6">
          <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Dr. Smile Dental Clinic. All rights reserved.
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default PatientPortal;
