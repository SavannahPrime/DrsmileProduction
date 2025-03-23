
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Phone } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-white via-dental-light-blue/30 to-dental-light-green/30 pt-32 pb-20 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-dental-light-blue/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-dental-light-green/20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-up">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
              Welcome to Dr. Smile Dental
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Your <span className="text-dental-blue">Healthy Smile</span> is Our Priority
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Experience exceptional dental care in a comfortable environment. Our team of experts is dedicated to providing you with the highest quality treatment for a perfect smile.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-dental-blue hover:bg-dental-blue/90 shadow-lg hover:shadow-xl transition-all group">
                <Link to="/booking" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Book Appointment
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-dental-blue text-dental-blue hover:bg-dental-light-blue/50 hover:text-dental-blue">
                <a href="tel:+15551234567" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item} 
                    className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-xs">😊</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium">4.9/5 Rating</p>
                <p className="text-muted-foreground">from 500+ patients</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-dental-blue/10 rounded-3xl -rotate-6 transform-gpu"></div>
              <div className="glass-card rounded-3xl overflow-hidden shadow-xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="Dentist with patient" 
                  className="w-full h-auto object-cover rounded-3xl transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-dental-blue flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl">🦷</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Modern Dental Technology</h3>
                      <p className="text-sm text-muted-foreground">Advanced care for optimal results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 md:mt-24">
          {[
            { label: "Years Experience", value: "15+" },
            { label: "Dental Specialists", value: "12" },
            { label: "Happy Patients", value: "5000+" },
            { label: "Success Rate", value: "99%" },
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className="glass-card p-6 rounded-xl text-center animate-fade-up hover-lift"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-dental-blue mb-2">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
