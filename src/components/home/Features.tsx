
import { Link } from 'react-router-dom';
import { ArrowRight, Smile, PenTool, HeartPulse, Shield, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const serviceItems = [
  {
    title: "General Dentistry",
    description: "Comprehensive care for your entire family, including cleanings, fillings, and preventive treatments.",
    icon: Smile,
    color: "text-dental-blue",
    bgColor: "bg-dental-light-blue",
    link: "/services#general"
  },
  {
    title: "Cosmetic Dentistry",
    description: "Transform your smile with whitening, veneers, and aesthetic procedures for a perfect look.",
    icon: PenTool,
    color: "text-dental-green",
    bgColor: "bg-dental-light-green",
    link: "/services#cosmetic"
  },
  {
    title: "Orthodontics",
    description: "Straighten your teeth with modern braces and clear aligners for a beautiful, aligned smile.",
    icon: HeartPulse,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    link: "/services#orthodontics"
  },
  {
    title: "Pediatric Dentistry",
    description: "Specialized care for children in a comfortable, friendly environment they'll love.",
    icon: Users,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    link: "/services#pediatric"
  },
  {
    title: "Emergency Care",
    description: "Immediate attention for dental emergencies with same-day appointments available.",
    icon: Clock,
    color: "text-red-500",
    bgColor: "bg-red-100",
    link: "/services#emergency"
  },
  {
    title: "Dental Implants",
    description: "Permanent tooth replacement solutions that look, feel, and function like natural teeth.",
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
    link: "/services#implants"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Dental Services</h2>
          <p className="text-muted-foreground">
            We offer a wide range of dental services to meet all your oral health needs in one convenient location.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {serviceItems.map((service, index) => (
            <div
              key={service.title}
              className="glass-card p-6 md:p-8 rounded-xl hover-lift animate-fade-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-6", service.bgColor)}>
                <service.icon className={cn("w-6 h-6", service.color)} />
              </div>
              <h3 className="text-xl font-medium mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-5">{service.description}</p>
              <Link 
                to={service.link} 
                className="inline-flex items-center text-sm font-medium text-dental-blue hover:underline group"
              >
                Learn more 
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-dental-blue text-dental-blue hover:bg-dental-light-blue transition-colors"
          >
            View All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
