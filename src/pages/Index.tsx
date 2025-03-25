import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import { Shield, LogIn } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  React.useEffect(() => {
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
        } else {
          // User is patient, redirect to booking
          navigate('/booking');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Patient Login Button */}
        <section className="pt-20 pb-20 bg-gradient-to-b from-white to-dental-light-blue/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-up">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
                  Professional Dental Care
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Trusted Dental Care for Your Whole Family</h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  Dr. Smile Dental Clinic provides comprehensive dental care with state-of-the-art technology and a gentle touch.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => navigate('/booking')}
                    className="bg-dental-blue hover:bg-dental-blue/90 text-white px-6 py-3 rounded-md font-medium"
                  >
                    Book Appointment
                  </Button>
                  <Button 
                    onClick={() => navigate('/services')}
                    className="bg-white border border-dental-blue text-dental-blue hover:bg-dental-light-blue px-6 py-3 rounded-md font-medium"
                  >
                    Our Services
                  </Button>
                </div>
              </div>
              
              <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-20 h-20 bg-dental-light-blue rounded-full flex items-center justify-center mb-6">
                    <Shield className="w-10 h-10 text-dental-blue" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Patient Portal</h2>
                  <p className="text-center text-muted-foreground mb-6">
                    Access your dental records, manage appointments, and stay connected with your dental health.
                  </p>
                  <Button
                    onClick={() => navigate('/patient-portal')}
                    className="w-full bg-dental-blue hover:bg-dental-blue/90 text-white"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Access Patient Portal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of homepage components */}
        <Features />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
