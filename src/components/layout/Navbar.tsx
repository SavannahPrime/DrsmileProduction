
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-2xl font-display font-semibold text-dental-blue"
          >
            <span className="text-3xl">🦷</span>
            Dr. Smile
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium relative px-1 py-2 transition-colors duration-200",
                  location.pathname === link.href
                    ? "text-dental-blue"
                    : "text-foreground/80 hover:text-dental-blue",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-dental-blue after:transition-all after:duration-300 hover:after:w-full",
                  location.pathname === link.href && "after:w-full"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-dental-blue" />
              <span className="font-medium">+1 (555) 123-4567</span>
            </div>
            <Button asChild className="bg-dental-blue hover:bg-dental-blue/90">
              <Link to="/booking">Book Appointment</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X size={24} className="text-dental-blue" />
            ) : (
              <Menu size={24} className="text-dental-blue" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 transition-transform duration-300 ease-in-out transform md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col h-full">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "py-3 px-2 text-xl font-medium border-b border-gray-100",
                  location.pathname === link.href
                    ? "text-dental-blue"
                    : "text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4 py-6">
            <div className="flex items-center gap-2 p-2">
              <Phone size={20} className="text-dental-blue" />
              <span className="font-medium">+1 (555) 123-4567</span>
            </div>
            <Button asChild className="w-full bg-dental-blue hover:bg-dental-blue/90">
              <Link to="/booking">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
