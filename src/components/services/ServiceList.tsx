
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Check, Sparkles, Stethoscope, Baby, Calendar, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const services = {
  general: {
    title: "General Dentistry",
    icon: Stethoscope, // Changed from non-existent tooth to Stethoscope
    color: "text-dental-blue",
    bgColor: "bg-dental-light-blue",
    description: "Our general dentistry services focus on maintaining your oral health through preventive care and treating common dental issues.",
    services: [
      {
        name: "Comprehensive Dental Exams",
        description: "Thorough evaluation of your oral health, including teeth, gums, and oral tissues.",
        price: "$75 - $150",
        features: ["Digital X-rays", "Oral cancer screening", "Periodontal evaluation"]
      },
      {
        name: "Professional Teeth Cleaning",
        description: "Remove plaque and tartar to prevent tooth decay and gum disease.",
        price: "$85 - $150",
        features: ["Plaque removal", "Polishing", "Fluoride treatment"]
      },
      {
        name: "Tooth-Colored Fillings",
        description: "Natural-looking restorations for damaged or decayed teeth.",
        price: "$150 - $300 per tooth",
        features: ["Composite material", "Mercury-free", "Preserves tooth structure"]
      },
      {
        name: "Root Canal Therapy",
        description: "Treatment to repair and save a badly damaged or infected tooth.",
        price: "$700 - $1,500 per tooth",
        features: ["Pain relief", "Tooth preservation", "Modern techniques"]
      }
    ],
    image: "https://images.unsplash.com/photo-1606811951341-67a8b3667dbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  cosmetic: {
    title: "Cosmetic Dentistry",
    icon: Sparkles,
    color: "text-dental-green",
    bgColor: "bg-dental-light-green",
    description: "Transform your smile with our range of cosmetic dental treatments designed to enhance the appearance of your teeth.",
    services: [
      {
        name: "Professional Teeth Whitening",
        description: "Brighten your smile by several shades with our professional whitening treatments.",
        price: "$300 - $600",
        features: ["In-office procedure", "Take-home kits available", "Long-lasting results"]
      },
      {
        name: "Porcelain Veneers",
        description: "Thin shells of porcelain that cover the front of teeth to improve appearance.",
        price: "$1,000 - $2,500 per tooth",
        features: ["Custom designed", "Stain resistant", "Natural appearance"]
      },
      {
        name: "Dental Bonding",
        description: "Repair chipped, fractured, or discolored teeth with tooth-colored resin.",
        price: "$300 - $600 per tooth",
        features: ["Single visit procedure", "Preserves tooth structure", "Affordable option"]
      },
      {
        name: "Smile Makeover",
        description: "Comprehensive treatment plan combining multiple procedures for a complete transformation.",
        price: "Starting at $3,000",
        features: ["Customized plan", "Digital preview", "Dramatic results"]
      }
    ],
    image: "https://images.unsplash.com/photo-1581590212310-c6b87c92b58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  orthodontics: {
    title: "Orthodontics",
    icon: Stethoscope,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    description: "Straighten your teeth and correct bite issues with our modern orthodontic treatments for both children and adults.",
    services: [
      {
        name: "Traditional Braces",
        description: "Metal brackets and wires to effectively align teeth and correct bite issues.",
        price: "$3,000 - $7,000",
        features: ["Effective for complex cases", "Colored bands options", "Regular adjustments"]
      },
      {
        name: "Clear Aligners (Invisalign)",
        description: "Nearly invisible aligners that gradually straighten teeth without metal brackets or wires.",
        price: "$3,500 - $8,000",
        features: ["Removable trays", "Virtually invisible", "Fewer office visits"]
      },
      {
        name: "Ceramic Braces",
        description: "Similar to traditional braces but with tooth-colored or clear brackets for a less noticeable appearance.",
        price: "$4,000 - $8,000",
        features: ["Less visible than metal", "Effective treatment", "Stain-resistant options"]
      },
      {
        name: "Retainers",
        description: "Custom-made devices to maintain teeth position after orthodontic treatment.",
        price: "$250 - $600",
        features: ["Preserve treatment results", "Removable or fixed options", "Regular maintenance"]
      }
    ],
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  pediatric: {
    title: "Pediatric Dentistry",
    icon: Baby,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
    description: "Specialized dental care for children in a friendly, comfortable environment designed to make dental visits enjoyable.",
    services: [
      {
        name: "Child Dental Exams",
        description: "Age-appropriate dental checkups to monitor development and prevent issues.",
        price: "$75 - $150",
        features: ["Child-friendly approach", "Growth monitoring", "Preventive focus"]
      },
      {
        name: "Dental Sealants",
        description: "Protective coating applied to back teeth to prevent decay in pits and fissures.",
        price: "$30 - $60 per tooth",
        features: ["Preventive treatment", "Quick application", "No drilling required"]
      },
      {
        name: "Fluoride Treatments",
        description: "Application of fluoride to strengthen enamel and prevent cavities.",
        price: "$20 - $50",
        features: ["Quick procedure", "Strengthens teeth", "Prevents decay"]
      },
      {
        name: "Space Maintainers",
        description: "Devices to keep space open for permanent teeth after premature loss of baby teeth.",
        price: "$200 - $400",
        features: ["Custom fitted", "Prevents crowding", "Facilitates proper development"]
      }
    ],
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  emergency: {
    title: "Emergency Care",
    icon: ShieldAlert,
    color: "text-red-500",
    bgColor: "bg-red-100",
    description: "Prompt dental care for emergencies such as severe pain, broken teeth, or injuries, with same-day appointments available.",
    services: [
      {
        name: "Emergency Dental Exam",
        description: "Immediate evaluation and pain relief for dental emergencies.",
        price: "$100 - $200",
        features: ["Same-day appointments", "Pain management", "Treatment planning"]
      },
      {
        name: "Toothache Treatment",
        description: "Diagnosis and treatment of severe tooth pain.",
        price: "Varies based on cause",
        features: ["Immediate relief", "Cause identification", "Treatment options"]
      },
      {
        name: "Broken Tooth Repair",
        description: "Restore fractured or broken teeth with appropriate treatment.",
        price: "$200 - $1,000+",
        features: ["Same-day care", "Pain management", "Aesthetic restoration"]
      },
      {
        name: "Dental Trauma Management",
        description: "Treatment for dental injuries from accidents or sports.",
        price: "Varies based on injury",
        features: ["Emergency protocol", "Tooth preservation", "Follow-up care"]
      }
    ],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  },
  implants: {
    title: "Dental Implants",
    icon: Calendar,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
    description: "Permanent replacement for missing teeth that look, feel, and function like natural teeth.",
    services: [
      {
        name: "Single Tooth Implant",
        description: "Complete replacement of a missing tooth with a titanium implant and porcelain crown.",
        price: "$3,000 - $5,000 per implant",
        features: ["Permanent solution", "Preserves bone", "Natural appearance"]
      },
      {
        name: "Full Arch Implants",
        description: "Full replacement of upper or lower teeth with implant-supported prosthetics.",
        price: "$15,000 - $30,000 per arch",
        features: ["Stable and secure", "Preserves facial structure", "Improved function"]
      },
      {
        name: "Implant-Supported Dentures",
        description: "Removable dentures that attach to implants for improved stability and comfort.",
        price: "$5,000 - $15,000",
        features: ["Enhanced stability", "Preserves jawbone", "Improved chewing ability"]
      },
      {
        name: "Bone Grafting",
        description: "Procedure to build up the bone to support dental implants if needed.",
        price: "$500 - $3,000",
        features: ["Creates implant foundation", "Uses biocompatible materials", "Improves success rates"]
      }
    ],
    image: "https://images.unsplash.com/photo-1651507886093-254432c28005?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  }
};

type ServiceCategory = keyof typeof services;

const ServiceList = () => {
  const [activeTab, setActiveTab] = useState<ServiceCategory>("general");

  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Comprehensive Dental Services</h1>
          <p className="text-lg text-muted-foreground">
            We offer a wide range of dental services to meet the needs of patients of all ages. Our focus is on preventive care, aesthetic enhancement, and restoring oral health.
          </p>
        </div>

        {/* Services Navigation */}
        <Tabs 
          defaultValue="general" 
          className="w-full" 
          onValueChange={(value) => setActiveTab(value as ServiceCategory)}
        >
          <div className="flex justify-center mb-12 overflow-x-auto pb-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <TabsList className="bg-dental-light-blue/50 h-auto flex-wrap">
              {Object.entries(services).map(([key, service]) => (
                <TabsTrigger 
                  key={key}
                  value={key}
                  className="text-sm px-4 py-2 flex items-center gap-2 data-[state=active]:text-dental-blue"
                >
                  <service.icon className="w-4 h-4" />
                  {service.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Service Content */}
          {Object.entries(services).map(([key, service]) => (
            <TabsContent key={key} value={key} className="animate-fade-in">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Content */}
                <div className="w-full lg:w-2/3">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", service.bgColor)}>
                      <service.icon className={cn("w-6 h-6", service.color)} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">{service.title}</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-8">
                    {service.description}
                  </p>

                  {/* Service Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.services.map((item) => (
                      <div 
                        key={item.name} 
                        className="glass-card p-6 rounded-xl hover-lift"
                      >
                        <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        <div className="text-sm font-medium text-dental-blue mb-4">
                          Estimated Price: {item.price}
                        </div>
                        
                        <div className="space-y-2">
                          {item.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-dental-green mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                    <Button asChild className="bg-dental-blue hover:bg-dental-blue/90 w-full sm:w-auto">
                      <Link to="/booking" className="flex items-center gap-2">
                        Book Appointment
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Have questions? Call us at <a href="tel:+15551234567" className="text-dental-blue hover:underline">+1 (555) 123-4567</a>
                    </p>
                  </div>
                </div>

                {/* Image */}
                <div className="w-full lg:w-1/3">
                  <div className="sticky top-32">
                    <div className="relative">
                      <div className="absolute inset-0 bg-dental-blue/10 rounded-3xl rotate-3 transform-gpu"></div>
                      <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
                        <img 
                          src={service.image}
                          alt={service.title} 
                          className="w-full h-auto object-cover rounded-3xl"
                        />
                      </div>
                    </div>

                    <div className="mt-8 p-6 glass-card rounded-xl">
                      <h3 className="text-lg font-medium mb-4">Why Choose Our {service.title}?</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-dental-green mt-0.5" />
                          <span>Experienced specialists with advanced training</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-dental-green mt-0.5" />
                          <span>State-of-the-art equipment and techniques</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-dental-green mt-0.5" />
                          <span>Comfortable, patient-focused experience</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-dental-green mt-0.5" />
                          <span>Flexible payment options available</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default ServiceList;
