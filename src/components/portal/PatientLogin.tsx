
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, LogIn, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Separator } from '@/components/ui/separator';

const PatientLogin = () => {
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
      // Attempt to sign in with Supabase Auth
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      // Check if user is admin (in blog_authors table)
      const { data: authorData, error: authorError } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('email', formData.email)
        .single();
      
      if (!authorError && authorData) {
        // User is admin, redirect to admin dashboard
        navigate('/admin-dashboard');
      } else {
        // User is patient, redirect to booking
        navigate('/booking');
      }
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to Dr. Smile Dental Portal.",
        variant: "default",
      });
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

  const loginWithDemo = async () => {
    setIsSubmitting(true);
    
    try {
      // Explicitly create demo accounts if they don't exist
      // This ensures the demo account is always available
      const demoResponse = await supabase.functions.invoke("generate-temp-password", {
        body: { createDemoAccounts: true }
      });
      
      if (demoResponse.error) {
        throw new Error('Failed to ensure demo accounts exist: ' + demoResponse.error.message);
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: 'patient@drsmile.com',
        password: 'password123',
      });
      
      if (error) throw error;
      
      toast({
        title: "Demo Login Successful!",
        description: "You are now logged in as a demo patient.",
        variant: "default",
      });
      
      navigate('/booking');
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo Login Failed",
        description: "Please try again or use regular login.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <div className="flex mt-1.5">
          <div className="bg-dental-light-blue text-dental-blue p-2.5 rounded-l-md">
            <Mail size={18} />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
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
      
      <Button 
        type="submit" 
        className="w-full bg-dental-blue hover:bg-dental-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Logging in..."
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </>
        )}
      </Button>

      <div className="relative my-4">
        <Separator />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          OR TRY DEMO ACCOUNT
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dental-blue/30 hover:bg-dental-light-blue/20"
        onClick={loginWithDemo}
        disabled={isSubmitting}
      >
        <UserCheck className="mr-2 h-4 w-4" />
        Demo Patient Account
      </Button>
    </form>
  );
};

export default PatientLogin;
