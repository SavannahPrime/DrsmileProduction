
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-display font-semibold text-dental-blue mb-4"
            >
              <span className="text-2xl">🦷</span>
              Dr. Smile Dental Clinic
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Providing exceptional dental care with a gentle touch. Your smile is our priority.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 rounded-full text-dental-blue hover:bg-dental-light-blue transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full text-dental-blue hover:bg-dental-light-blue transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full text-dental-blue hover:bg-dental-light-blue transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full text-dental-blue hover:bg-dental-light-blue transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-base font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Our Dentists', href: '/about#team' },
                { label: 'Pricing', href: '/services#pricing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-dental-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-base font-medium mb-4">Our Services</h3>
            <ul className="space-y-2">
              {[
                { label: 'General Dentistry', href: '/services#general' },
                { label: 'Cosmetic Dentistry', href: '/services#cosmetic' },
                { label: 'Orthodontics', href: '/services#orthodontics' },
                { label: 'Pediatric Dentistry', href: '/services#pediatric' },
                { label: 'Dental Implants', href: '/services#implants' },
                { label: 'Emergency Care', href: '/services#emergency' },
              ].map((service) => (
                <li key={service.label}>
                  <Link 
                    to={service.href} 
                    className="text-sm text-muted-foreground hover:text-dental-blue transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-base font-medium mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-dental-blue mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Smile Avenue, Dental District<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-dental-blue" />
                <a href="tel:+15551234567" className="text-sm text-muted-foreground hover:text-dental-blue">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-dental-blue" />
                <a href="mailto:info@drsmile.com" className="text-sm text-muted-foreground hover:text-dental-blue">
                  info@drsmile.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={18} className="text-dental-blue mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Dr. Smile Dental Clinic. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-dental-blue transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-dental-blue transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
