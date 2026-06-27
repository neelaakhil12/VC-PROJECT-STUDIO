import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Our Story', path: '/about' },
    { name: 'Recent Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 glass-nav py-3.5 md:py-5 ${scrolled ? 'md:py-3' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img 
                src="/logo.png" 
                alt="Project Studio Logo" 
                className={`object-cover rounded border border-gold/30 group-hover:border-gold transition-all duration-500 shadow-md w-16 h-16 md:w-20 md:h-20 ${scrolled ? 'md:w-16 md:h-16' : ''}`} 
              />
              <div className="flex flex-col">
                <span className={`font-heading font-bold tracking-widest text-grey transition-all duration-500 text-lg md:text-xl ${scrolled ? 'md:text-lg' : ''}`}>PROJECT STUDIO</span>
                <span className={`uppercase tracking-[0.25em] text-gold font-poppins transition-all duration-500 text-[8px] md:text-[9px] ${scrolled ? 'md:text-[8px]' : ''}`}>Premium Interiors</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={`text-sm tracking-wider uppercase transition-colors duration-300 relative py-1 group ${isActive(link.path) ? 'text-gold' : 'text-white/80 hover:text-gold'}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive(link.path) ? 'scale-x-100' : ''}`} />
                </Link>
              ))}
              
              <button 
                onClick={onOpenConsultation}
                className="px-5 py-2 bg-black border border-gold text-gold font-bold uppercase tracking-wider rounded transition-all duration-300 hover:bg-gold hover:text-black hover:shadow-gold-glow text-xs"
              >
                Book Now
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-gold transition-colors p-1"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden fixed top-0 right-0 w-[280px] h-auto bg-black border-l border-b border-gold/20 z-50 p-6 rounded-bl-2xl transform transition-transform duration-500 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end mb-8">
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gold transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-heading tracking-wider py-1 ${isActive(link.path) ? 'text-gold border-b border-gold/30' : 'text-white/90 hover:text-gold'}`}
            >
              {link.name}
            </Link>
          ))}
          
          <button 
            onClick={() => { setIsOpen(false); onOpenConsultation(); }}
            className="mt-4 px-3 py-2.5 bg-gold-gradient text-black text-xs font-semibold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-gold-glow w-full text-center"
          >
            Book Consultation
          </button>
        </div>
      </div>
    </>
  );
}
