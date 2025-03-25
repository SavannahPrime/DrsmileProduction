
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Dashboard from '@/components/admin/Dashboard';
import { LogOut, ArrowLeft, Users, Calendar, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ClientsManager from '@/components/admin/ClientsManager';
import BookingsManager from '@/components/admin/BookingsManager';
import AnalyticsView from '@/components/admin/AnalyticsView';
import MessagesManager from '@/components/admin/MessagesManager';
import BlogManager from '@/components/admin/BlogManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-dental-blue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-dental-blue/90"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
            <h1 className="text-2xl font-bold">Dr. Smile Dental Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-dental-light-blue text-dental-blue">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <span className="font-semibold">{user.email}</span>
                </div>
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
      
      {/* Main Content with Sidebar Navigation */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-dental-blue">Admin Portal</h2>
            <p className="text-xs text-gray-500">Manage your dental practice</p>
          </div>
          
          <nav className="mt-2">
            <Button 
              variant={activeTab === 'overview' ? "default" : "ghost"}
              className={`w-full justify-start rounded-none px-4 py-2 ${activeTab === 'overview' ? 'bg-dental-blue text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard Overview
            </Button>
            
            <Button 
              variant={activeTab === 'clients' ? "default" : "ghost"}
              className={`w-full justify-start rounded-none px-4 py-2 ${activeTab === 'clients' ? 'bg-dental-blue text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('clients')}
            >
              <Users className="mr-2 h-4 w-4" />
              Patient Management
            </Button>
            
            <Button 
              variant={activeTab === 'bookings' ? "default" : "ghost"}
              className={`w-full justify-start rounded-none px-4 py-2 ${activeTab === 'bookings' ? 'bg-dental-blue text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Booking Management
            </Button>
            
            <Button 
              variant={activeTab === 'analytics' ? "default" : "ghost"}
              className={`w-full justify-start rounded-none px-4 py-2 ${activeTab === 'analytics' ? 'bg-dental-blue text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics Dashboard
            </Button>
            
            <Button 
              variant={activeTab === 'messages' ? "default" : "ghost"}
              className={`w-full justify-start rounded-none px-4 py-2 ${activeTab === 'messages' ? 'bg-dental-blue text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('messages')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            
            <Button 
              variant={activeTab === 'blog' ? "default" : "ghost"}
              className={`w-full justify-start rounded-none px-4 py-2 ${activeTab === 'blog' ? 'bg-dental-blue text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('blog')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Blog Management
            </Button>
          </nav>
          
          <div className="absolute bottom-0 w-64 p-4 border-t">
            <div className="text-xs text-gray-500">
              <p>Dr. Smile Dental Admin</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            {activeTab === 'overview' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
                <Dashboard />
              </div>
            )}
            
            {activeTab === 'clients' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
                <ClientsManager />
              </div>
            )}
            
            {activeTab === 'bookings' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
                <BookingsManager />
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
                <AnalyticsView />
              </div>
            )}
            
            {activeTab === 'messages' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Client Messages</h1>
                <MessagesManager />
              </div>
            )}
            
            {activeTab === 'blog' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Blog Management</h1>
                <BlogManager />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
