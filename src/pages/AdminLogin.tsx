
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import AdminLoginForm from '@/components/portal/AdminLogin';
import { ShieldCheck, Home } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dental-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="h-16"></div> {/* Spacer for fixed navbar */}
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-dental-light-blue rounded-full mr-4">
                <ShieldCheck className="h-6 w-6 text-dental-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="text-gray-500">Access the dental clinic administrative portal</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="border-dental-blue/30 text-dental-blue"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
          </div>
            
          {setupComplete && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <AlertDescription className="py-2">
                <div className="font-medium text-green-800 mb-1">Admin Account Created</div>
                <div className="text-sm text-green-700">
                  <p className="mb-1">Use these credentials to login:</p>
                  <p><strong>Email:</strong> admin@drsmile.com</p>
                  <p><strong>Password:</strong> DrSmile2023!</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
            
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Administrative Login</CardTitle>
              <CardDescription className="text-center">
                Secure access for dental clinic staff only
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminLoginForm />
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-center text-gray-500">
                This portal is for authorized personnel only.
              </p>
            </CardFooter>
          </Card>
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

export default AdminLogin;
