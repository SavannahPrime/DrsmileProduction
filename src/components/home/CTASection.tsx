
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Dental clinic interior" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dental-blue/80 to-dental-blue/60 backdrop-blur-sm"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 px-6 py-16 md:py-20 lg:py-24 flex flex-col items-center text-center">
            <div className="max-w-3xl mx-auto text-white animate-fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your Best Smile Ever?</h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Schedule your appointment today and take the first step towards a healthier, more beautiful smile. Our team is ready to provide you with exceptional dental care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-dental-blue hover:bg-white/90 shadow-lg group">
                  <Link to="/booking" className="flex items-center gap-2">
                    <span className="bg-dental-blue text-white p-1.5 rounded-full transition-transform group-hover:scale-110">
                      <PhoneCall size={16} />
                    </span>
                    Book an Appointment
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-white/80">
                Or call us directly at{' '}
                <a href="tel:+15551234567" className="font-medium hover:underline">
                  +1 (555) 123-4567
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
