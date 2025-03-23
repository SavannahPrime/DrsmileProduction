
import { Award, Users, Heart } from 'lucide-react';

const AboutHero = () => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-white via-dental-light-blue/30 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 animate-fade-up">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
              About Us
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Welcome to Dr. Smile Dental Clinic
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              For over 15 years, we've been dedicated to providing exceptional dental care to our community. Our mission is to create beautiful, healthy smiles in a comfortable and welcoming environment.
            </p>
            <p className="text-muted-foreground mb-8">
              At Dr. Smile Dental Clinic, we combine cutting-edge technology with compassionate care to ensure the best possible experience for our patients. Our team of experienced professionals is committed to your oral health and overall well-being.
            </p>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {[
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We strive for excellence in every aspect of our practice."
                },
                {
                  icon: Heart,
                  title: "Compassion",
                  description: "We treat every patient with kindness and understanding."
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "We're proud to serve and support our local community."
                }
              ].map((value, index) => (
                <div 
                  key={value.title} 
                  className="text-center p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-dental-light-blue flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-dental-blue" />
                  </div>
                  <h3 className="font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-dental-green/10 rounded-3xl rotate-3 transform-gpu"></div>
              <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                  alt="Our dental clinic team" 
                  className="w-full h-auto object-cover rounded-3xl transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-12 pl-6 border-l-2 border-dental-blue/20 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              {[
                { year: "2008", title: "Founded", description: "Dr. Smile Dental Clinic was established" },
                { year: "2015", title: "Expansion", description: "Opened our second location and expanded services" },
                { year: "2020", title: "Modern Upgrade", description: "Integrated cutting-edge dental technology" },
                { year: "Today", title: "Growing Community", description: "Serving thousands of satisfied patients" }
              ].map((item, index) => (
                <div 
                  key={item.year} 
                  className="relative mb-8 last:mb-0"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <div className="absolute -left-[30px] w-6 h-6 rounded-full bg-dental-light-blue border-2 border-dental-blue flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-dental-blue"></div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-sm font-medium px-2 py-1 bg-dental-light-blue text-dental-blue rounded-md">
                        {item.year}
                      </span>
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
