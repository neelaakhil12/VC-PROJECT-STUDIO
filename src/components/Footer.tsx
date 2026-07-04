import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { dataStore, defaultContactDetails } from '../dataStore';
import type { ContactDetails } from '../dataStore';

// Inline SVG icons for social platforms (Lucide doesn't have YouTube)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="currentColor" stroke="none" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactDetails>(defaultContactDetails);
  const { pathname } = useLocation();

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await dataStore.getContactDetails();
        setContactInfo(data);
      } catch (err) {
        console.error('Failed to load contact info in footer:', err);
      }
    };
    loadContact();
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      icon: <InstagramIcon />,
      href: contactInfo.instagram || '',
      label: 'Instagram',
      style: { background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }
    },
    {
      icon: <FacebookIcon />,
      href: contactInfo.facebook || '',
      label: 'Facebook',
      style: { backgroundColor: '#1877F2' }
    },
    {
      icon: <YouTubeIcon />,
      href: contactInfo.youtube || '',
      label: 'YouTube',
      style: { backgroundColor: '#FF0000' }
    },
  ];

  const activeSocialLinks = socialLinks.filter(link => link.href && link.href.trim() !== '');

  return (
    <footer className="bg-white border-t border-gold/20 text-primary pt-16 pb-8 relative overflow-hidden">
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
                className="w-24 h-24 object-contain transition-all duration-300" 
              />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-widest text-primary">PROJECT STUDIO</span>
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold font-poppins">Premium Interiors</span>
              </div>
            </Link>
            <p className="text-grey-dark text-sm font-light leading-relaxed">
              Crafting premium luxury interiors that match your dreams and suit your budget. Affordable design, premium quality, unmatched execution.
            </p>

            {/* Social Media Buttons */}
            {activeSocialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {activeSocialLinks.map(({ icon, href, label, style }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    style={style}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg text-white"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6 font-semibold">Explore</h4>
            <ul className="space-y-3 text-sm text-grey-dark">
              <li><Link to="/" className="hover:text-gold hover:pl-1 transition-all duration-300 font-light">Home</Link></li>
              <li><Link to="/services" className="hover:text-gold hover:pl-1 transition-all duration-300 font-light">Services</Link></li>
              <li><Link to="/about" className="hover:text-gold hover:pl-1 transition-all duration-300 font-light">Our Story</Link></li>
              <li><Link to="/projects" className="hover:text-gold hover:pl-1 transition-all duration-300 font-light">Recent Projects</Link></li>
              <li><Link to="/contact" className="hover:text-gold hover:pl-1 transition-all duration-300 font-light">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6 font-semibold">Services</h4>
            <ul className="space-y-3 text-sm text-grey-dark">
              <li className="font-light">Modular Kitchens</li>
              <li className="font-light">Custom Wardrobes &amp; TV Units</li>
              <li className="font-light">Turnkey Civil &amp; false ceiling</li>
              <li className="font-light">Electrical &amp; lighting Layouts</li>
              <li className="font-light">Styling &amp; Decor Consultation</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-gold font-heading text-sm uppercase tracking-widest mb-6 font-semibold">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-grey-dark font-light">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>{contactInfo.location}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href={`tel:${contactInfo.phone1.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors">{contactInfo.phone1}</a>
                  <a href={`tel:${contactInfo.phone2.replace(/\s+/g, '')}`} className="hover:text-gold transition-colors">{contactInfo.phone2}</a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-gold transition-colors">{contactInfo.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-grey/20 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-grey-dark font-light">
          <div>
            &copy; {new Date().getFullYear()} Project Studio. All rights reserved. Founded 2024.
          </div>
          <div>
            Affordable Dream Interiors | Premium Quality Guaranteed
          </div>
          <button 
            onClick={scrollToTop}
            className="w-10 h-10 border border-gold/30 hover:border-gold hover:text-gold transition-all duration-300 rounded flex items-center justify-center text-primary"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
