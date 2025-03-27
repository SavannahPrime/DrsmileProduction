
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First, attempt to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (signInError) throw signInError;
      
      if (!signInData.user) {
        throw new Error('Login failed. User data not found.');
      }
      
      // Now, check if the email is in the blog_authors table
      const { data: authorData, error: authorError } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('email', formData.email)
        .single();
      
      if (authorError || !authorData) {
        // If not an admin, sign out and show error
        await supabase.auth.signOut();
        throw new Error('Unauthorized access. Only administrators can log in here.');
      }
      
      toast({
        title: "Login Successful!",
        description: "Welcome to the admin dashboard.",
        variant: "default",
      });
      
      // Redirect to admin dashboard page
      navigate('/admin-dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For development use, pre-fill with admin credentials
  const fillAdminCreds = () => {
    setFormData({
      email: 'admin@drsmile.com',
      password: 'DrSmile2023!'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-dental-light-blue p-3 rounded-full">
          <ShieldCheck className="h-8 w-8 text-dental-blue" />
        </div>
      </div>
      
      <Card className="border-blue-100">
        <CardHeader className="bg-blue-50 pb-3 dark:bg-blue-900/30">
          <CardTitle className="text-center text-blue-800 dark:text-blue-300">Administrative Login</CardTitle>
          <CardDescription className="text-center text-blue-600 dark:text-blue-400">
            Secure access for administrative staff only
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <div className="flex mt-1.5">
                <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md dark:bg-blue-800 dark:text-blue-200">
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
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="p-0 h-auto text-xs text-dental-blue">
                  Forgot password?
                </Button>
              </div>
              <div className="flex mt-1.5">
                <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md dark:bg-blue-800 dark:text-blue-200">
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
          </div>
        </CardContent>
        <CardFooter className="flex-col border-t pt-4">
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
          
          <Button
            type="button"
            variant="link"
            size="sm"
            className="mt-2 text-xs text-gray-500"
            onClick={fillAdminCreds}
          >
            Use default admin credentials
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            This portal is for authorized personnel only. 
            Unauthorized access attempts may be monitored and reported.
          </p>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AdminLogin;
