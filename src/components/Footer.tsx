import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-gold/20 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img 
                src="/logo.png" 
                alt="Project Studio Logo" 
                className="w-20 h-20 object-cover rounded border border-gold/30 group-hover:border-gold transition-all duration-300 shadow" 
              />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-widest text-grey">PROJECT STUDIO</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-poppins">Premium Interiors</span>
              </div>
            </Link>
            <p className="text-grey text-sm font-light leading-relaxed">
              Crafting premium luxury interiors that match your dreams and suit your budget. Affordable design, premium quality, unmatched execution.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-9 h-9 border border-grey/30 hover:border-gold hover:text-gold rounded flex items-center justify-center transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 border border-grey/30 hover:border-gold hover:text-gold rounded flex items-center justify-center transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6 font-semibold">Explore</h4>
            <ul className="space-y-3 text-sm text-grey">
              <li>
                <Link to="/" className="hover:text-white hover:pl-1 transition-all duration-300 font-light">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white hover:pl-1 transition-all duration-300 font-light">Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:pl-1 transition-all duration-300 font-light">Our Story</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white hover:pl-1 transition-all duration-300 font-light">Recent Projects</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:pl-1 transition-all duration-300 font-light">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6 font-semibold">Services</h4>
            <ul className="space-y-3 text-sm text-grey">
              <li className="font-light">Modular Kitchens</li>
              <li className="font-light">Custom Wardrobes & TV Units</li>
              <li className="font-light">Turnkey Civil & false ceiling</li>
              <li className="font-light">Electrical & lighting Layouts</li>
              <li className="font-light">Styling & Decor Consultation</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6 font-semibold">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-grey font-light">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>Kukatpally, Allwyn Colony, Near Saibaba Temple, Hyderabad, TS, 500072</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+916305093192" className="hover:text-white transition-colors">+91 63050 93192</a>
                  <a href="tel:+917660994433" className="hover:text-white transition-colors">+91 76609 94433</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:vcprojectstudio@gmail.com" className="hover:text-white transition-colors">vcprojectstudio@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-grey/20 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-grey font-light">
          <div>
            &copy; {new Date().getFullYear()} Project Studio. All rights reserved. Founded 2024.
          </div>
          <div>
            Affordable Dream Interiors | Premium Quality Guaranteed
          </div>
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 border border-gold/30 hover:border-gold hover:text-gold transition-all duration-300 rounded flex items-center justify-center"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
