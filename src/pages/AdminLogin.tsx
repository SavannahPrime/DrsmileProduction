
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AdminLoginForm from '@/components/portal/AdminLogin';
import { ShieldCheck } from 'lucide-react';
import { ThemeProvider } from '@/hooks/use-theme';

const AdminLogin = () => {
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if the user is an admin
        const { data: authorData, error: authorError } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('email', session.user?.email)
          .single();
        
        if (!authorError && authorData) {
          // User is already logged in as admin, redirect to admin dashboard
          navigate('/admin-dashboard');
          return;
        }
      }
      
      setLoading(false);
    };
    
    // Setup the admin account
    const setupAdmin = async () => {
      try {
        const response = await supabase.functions.invoke('create-admin');
        if (response.data.success) {
          setSetupComplete(true);
          console.log('Admin setup complete');
        }
      } catch (error) {
        console.error('Error setting up admin:', error);
      } finally {
        checkSession();
      }
    };
    
    setupAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-blue"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-dental-blue dark:text-blue-400">Dr. Smile Dental Clinic</h1>
              <Button 
                variant="outline" 
                onClick={() => navigate('/patient-portal')}
                className="border-dental-blue/30 text-dental-blue dark:border-blue-500/30 dark:text-blue-400"
              >
                Back to Patient Portal
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dental-light-blue dark:bg-blue-900 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-dental-blue dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2 dark:text-white">Admin Login</h1>
              <p className="text-gray-500 dark:text-gray-400">Access the dental clinic administrative portal</p>
            </div>
            
            {setupComplete && (
              <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800">
                <AlertDescription className="py-2">
                  <div className="font-medium text-green-800 dark:text-green-300 mb-1">Admin Account Created</div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    <p className="mb-1">Use these credentials to login:</p>
                    <p><strong>Email:</strong> admin@drsmile.com</p>
                    <p><strong>Password:</strong> DrSmile2023!</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-center dark:text-white">Administrative Login</CardTitle>
                <CardDescription className="text-center dark:text-gray-400">
                  Secure access for dental clinic staff only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminLoginForm />
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  This portal is for authorized personnel only.
                </p>
              </CardFooter>
            </Card>
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

export default AdminLogin;
