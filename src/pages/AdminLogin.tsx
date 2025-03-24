
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is already logged in as admin
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
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check if the email is in the blog_authors table
      const { data: authorData, error: authorError } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('email', formData.email)
        .single();
      
      if (authorError || !authorData) {
        throw new Error('Unauthorized access. Only administrators can log in here.');
      }
      
      // Proceed with login if the email is authorized
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login Successful!",
        description: "Welcome to the admin dashboard.",
        variant: "default",
      });
      
      // Redirect to admin dashboard page
      navigate('/admin-dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dental-light-blue/30 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-dental-blue/10 rounded-full mb-4">
            <ShieldCheck className="h-10 w-10 text-dental-blue" />
          </div>
          <h1 className="text-3xl font-bold text-dental-blue">Admin Access</h1>
          <p className="text-gray-600 mt-2">Secure login for administrative staff only</p>
        </div>
        
        <Card className="border-2 border-dental-blue/10 shadow-xl">
          <CardHeader className="bg-dental-blue/5 space-y-1">
            <CardTitle className="text-xl text-center">Administrative Login</CardTitle>
            <CardDescription className="text-center">
              Authorized personnel only
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex">
                  <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@drsmile.com"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-dental-blue">
                    Forgot password?
                  </Button>
                </div>
                <div className="flex">
                  <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="******"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4 border-t pt-4">
              <Button 
                type="submit" 
                className="w-full bg-dental-blue hover:bg-dental-blue/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Authenticating..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Admin Sign In
                  </>
                )}
              </Button>
              <div className="text-xs text-center text-gray-500 flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Secured access point
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            className="text-sm text-gray-500 hover:text-dental-blue"
            onClick={() => navigate('/')}
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
