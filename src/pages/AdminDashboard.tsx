
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Dashboard from '@/components/admin/Dashboard';
import { LogOut, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/hooks/use-theme';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/admin-login');
          return;
        }
        
        // Verify the user is an admin by checking if they're in the blog_authors table
        const { data: authorData, error: authorError } = await supabase
          .from('blog_authors')
          .select('*')
          .eq('email', session.user?.email)
          .single();
        
        if (authorError || !authorData) {
          // Not an admin, log them out and redirect
          await supabase.auth.signOut();
          navigate('/admin-login');
          toast({
            title: "Unauthorized",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive",
          });
          return;
        }
        
        // User is valid admin
        setUser(session.user);
      } catch (error) {
        console.error('Error checking session:', error);
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin-login');
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-dental-blue border-r-dental-blue border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dental-blue">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-dental-blue text-white shadow-md dark:bg-blue-900">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-dental-blue/90 dark:hover:bg-blue-800"
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Website
              </Button>
              <h1 className="text-2xl font-bold">Dr. Smile Dental Admin</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm">
                  Logged in as <span className="font-semibold">{user.email}</span>
                </div>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default AdminDashboard;
