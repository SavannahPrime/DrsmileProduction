
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Linkedin, Mail, Phone } from 'lucide-react';

const teamMembers = {
  dentists: [
    {
      name: "Dr. Emily Johnson",
      role: "Lead Dentist, Founder",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      bio: "Dr. Emily Johnson founded Dr. Smile Dental Clinic in 2008 with a vision to provide exceptional dental care in a comfortable environment. With over 20 years of experience, she specializes in cosmetic dentistry and full smile makeovers.",
      education: ["DDS, Harvard School of Dental Medicine", "Residency, University of California"],
      specialties: ["Cosmetic Dentistry", "Full Mouth Rehabilitation", "Dental Implants"],
      social: {
        linkedin: "#",
        email: "emily.johnson@drsmile.com",
        phone: "+15551234567"
      }
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Orthodontist",
      image: "https://randomuser.me/api/portraits/men/35.jpg",
      bio: "Dr. Rodriguez brings 15 years of orthodontic expertise to our team. He's passionate about creating beautiful smiles through modern orthodontic techniques and is known for his gentle approach with patients of all ages.",
      education: ["DDS, University of Michigan", "MS in Orthodontics, Columbia University"],
      specialties: ["Invisalign", "Traditional Braces", "Early Intervention Orthodontics"],
      social: {
        linkedin: "#",
        email: "michael.rodriguez@drsmile.com",
        phone: "+15551234568"
      }
    },
    {
      name: "Dr. Sarah Kim",
      role: "Pediatric Dentist",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "Dr. Kim specializes in making dental visits enjoyable for our youngest patients. With her warm personality and specialized training in pediatric dentistry, she ensures children develop positive associations with dental care from an early age.",
      education: ["DMD, Boston University", "Pediatric Dentistry Residency, Children's Hospital of Philadelphia"],
      specialties: ["Pediatric Dentistry", "Preventive Care", "Special Needs Dentistry"],
      social: {
        linkedin: "#",
        email: "sarah.kim@drsmile.com",
        phone: "+15551234569"
      }
    },
    {
      name: "Dr. James Wilson",
      role: "Oral Surgeon",
      image: "https://randomuser.me/api/portraits/men/72.jpg",
      bio: "Dr. Wilson is our in-house oral surgery specialist with extensive experience in complex extractions, dental implants, and reconstructive procedures. His precise technique and commitment to patient comfort make him a valued member of our team.",
      education: ["DDS, New York University", "Oral and Maxillofacial Surgery Residency, Mayo Clinic"],
      specialties: ["Wisdom Teeth Extraction", "Dental Implants", "Bone Grafting"],
      social: {
        linkedin: "#",
        email: "james.wilson@drsmile.com",
        phone: "+15551234570"
      }
    }
  ],
  staff: [
    {
      name: "Lisa Martinez",
      role: "Dental Hygienist",
      image: "https://randomuser.me/api/portraits/women/15.jpg",
      bio: "Lisa has been with our clinic since its founding. Her gentle cleaning technique and educational approach help patients maintain optimal oral health between visits.",
      education: ["BS in Dental Hygiene, University of Minnesota"],
      specialties: ["Periodontal Therapy", "Patient Education", "Preventive Care"],
      social: {
        linkedin: "#",
        email: "lisa.martinez@drsmile.com",
        phone: "+15551234571"
      }
    },
    {
      name: "Robert Chen",
      role: "Dental Assistant",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "Robert's efficiency and attentiveness make every procedure run smoothly. He's known for his ability to put anxious patients at ease with his calm demeanor.",
      education: ["Certified Dental Assistant, Community College of Denver"],
      specialties: ["Chairside Assistance", "Patient Comfort", "X-Ray Technology"],
      social: {
        linkedin: "#",
        email: "robert.chen@drsmile.com",
        phone: "+15551234572"
      }
    },
    {
      name: "Sophia Garcia",
      role: "Office Manager",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      bio: "Sophia keeps our clinic running like clockwork. From scheduling to insurance coordination, she ensures our patients have a seamless experience from start to finish.",
      education: ["BA in Healthcare Administration, University of Colorado"],
      specialties: ["Insurance Coordination", "Patient Scheduling", "Office Management"],
      social: {
        linkedin: "#",
        email: "sophia.garcia@drsmile.com",
        phone: "+15551234573"
      }
    },
    {
      name: "Marcus Johnson",
      role: "Patient Coordinator",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      bio: "Marcus is often the first person you'll meet at our clinic. His friendly nature and extensive knowledge of dental procedures help new patients feel welcome and informed.",
      education: ["BS in Healthcare Communications, Arizona State University"],
      specialties: ["Patient Relations", "Treatment Planning", "Financial Coordination"],
      social: {
        linkedin: "#",
        email: "marcus.johnson@drsmile.com",
        phone: "+15551234574"
      }
    }
  ]
};

const Team = () => {
  const [activeTab, setActiveTab] = useState("dentists");

  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-dental-blue bg-dental-light-blue rounded-full">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Dental Professionals</h2>
          <p className="text-muted-foreground">
            Our highly skilled team is dedicated to providing you with the best dental care in a comfortable and friendly environment.
          </p>
        </div>

        {/* Team Tabs */}
        <Tabs defaultValue="dentists" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <TabsList className="bg-dental-light-blue/50">
              <TabsTrigger value="dentists" className="text-sm px-6 py-2">
                Dentists & Specialists
              </TabsTrigger>
              <TabsTrigger value="staff" className="text-sm px-6 py-2">
                Support Staff
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dentists" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.dentists.map((member, index) => (
                <TeamMemberCard 
                  key={member.name} 
                  member={member} 
                  index={index} 
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="staff" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.staff.map((member, index) => (
                <TeamMemberCard 
                  key={member.name} 
                  member={member} 
                  index={index} 
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Philosophy Section */}
        <div className="mt-24 max-w-3xl mx-auto text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-2xl font-bold mb-4">Our Philosophy</h3>
          <p className="text-muted-foreground mb-4">
            At Dr. Smile, we believe in treating the person, not just the teeth. Our approach combines clinical excellence with genuine compassion, ensuring that each patient receives individualized care that addresses their unique needs and concerns.
          </p>
          <p className="text-muted-foreground">
            We're committed to ongoing education and staying at the forefront of dental advancements, allowing us to provide the most effective and comfortable treatments available today.
          </p>
        </div>
      </div>
    </section>
  );
};

const TeamMemberCard = ({ member, index }: { member: any; index: number }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div 
      className="glass-card rounded-xl overflow-hidden hover-lift animate-fade-up"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-64 object-cover transition-transform duration-500 ease-out"
          style={{ transform: showDetails ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 hover:translate-y-0 transition-transform duration-300">
          <div className="flex justify-center space-x-3">
            <a 
              href={`mailto:${member.social.email}`} 
              className="p-2 bg-white/90 text-dental-blue rounded-full hover:bg-dental-blue hover:text-white transition-colors"
              title={`Email ${member.name}`}
            >
              <Mail size={16} />
            </a>
            <a 
              href={`tel:${member.social.phone}`} 
              className="p-2 bg-white/90 text-dental-blue rounded-full hover:bg-dental-blue hover:text-white transition-colors"
              title={`Call ${member.name}`}
            >
              <Phone size={16} />
            </a>
            <a 
              href={member.social.linkedin} 
              className="p-2 bg-white/90 text-dental-blue rounded-full hover:bg-dental-blue hover:text-white transition-colors"
              title={`${member.name}'s LinkedIn profile`}
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-medium text-lg">{member.name}</h3>
        <p className="text-sm text-dental-blue mb-3">{member.role}</p>
        <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
        
        <div className={`mt-4 pt-4 border-t border-gray-200 transition-all duration-300 overflow-hidden ${showDetails ? 'max-h-60' : 'max-h-0'}`}>
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-1">Education</h4>
            <ul className="text-xs text-muted-foreground">
              {member.education.map((edu: string) => (
                <li key={edu} className="mb-1">{edu}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {member.specialties.map((specialty: string) => (
                <span 
                  key={specialty} 
                  className="text-xs px-2 py-1 bg-dental-light-blue text-dental-blue rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
