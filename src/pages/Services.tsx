import { useEffect } from 'react';
import { LayoutGrid, Wrench, Palette, Check } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface ServicesProps {
  onOpenConsultation: () => void;
}

export default function Services({ onOpenConsultation }: ServicesProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const serviceCategories = [
    {
      title: "Custom Modular Solutions & Carpentry",
      tagline: "Precision Engineering & Bespoke Cabinets",
      icon: <LayoutGrid className="w-8 h-8 text-gold" />,
      image: "/image%20copy%207.png",
      description: "We design and build clean modular structures tailored exactly to your space requirements. Using premium water-proof calibrated plywood and state of the art drawer accessories.",
      includes: [
        "Modular Kitchens (L-shaped, U-shaped, Parallel, Island)",
        "Custom Wardrobes (Sliding doors, Swing doors, Loft cabinets)",
        "Premium TV Entertainment units",
        "Utility Storage & Crockery Solutions"
      ]
    },
    {
      title: "Turnkey Execution",
      tagline: "Hassle-Free Construction & Complete Workmanship",
      icon: <Wrench className="w-8 h-8 text-gold" />,
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      description: "Leave the heavy lifting to us. We manage everything from raw brick restructuring to fine painting. A dedicated supervisor monitors daily progress, maintaining premium quality standards.",
      includes: [
        "Civil work, tiling, kitchen counters modification",
        "Electrical rewiring and premium ambient light layouts",
        "False ceilings (Gypsum board, PVC partitions)",
        "Professional painting (wall preparation, texture work, premium paints)",
        "Lighting installations (COB, Profiles, LED Strips)",
        "Post-execution professional deep cleaning"
      ]
    },
    {
      title: "Styling & Décor Consultation",
      tagline: "Aesthetic Guidance & Soft Furnishings",
      icon: <Palette className="w-8 h-8 text-gold" />,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      description: "Our senior design consultants help you curate materials, textures, and details that weave together into a luxury setting, aligning with your personal taste and comfort.",
      includes: [
        "Color Palette recommendations",
        "Premium wallpaper design selections",
        "Fabric curtains, blinds, and window dressings",
        "Architectural lighting scheme mapping",
        "Soft furnishings, carpets, and decor accents"
      ]
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-offwhite">
      {/* Page Header */}
      <div className="bg-black text-white py-20 border-b border-gold/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Premium Offerings</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white">Our Design Services</h1>
          <p className="text-grey max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            From raw brick structures to the final placement of styled cushions, explore our end-to-end luxury interior solutions.
          </p>
        </div>
      </div>

      {/* Services Grid List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
        {serviceCategories.map((service, index) => (
          <div 
            key={index}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}
            data-aos="fade-up"
          >
            {/* Image (lg: 5 cols) */}
            <div className={`lg:col-span-5 relative group overflow-hidden rounded border border-grey/15 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="absolute -top-3 -left-3 w-full h-full border border-gold/20 rounded -z-10 group-hover:top-0 group-hover:left-0 transition-all duration-300"></div>
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-[320px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500 rounded" 
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Description (lg: 7 cols) */}
            <div className={`lg:col-span-7 space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 border border-gold/30 rounded bg-white shadow-sm">
                  {service.icon}
                </div>
                <div>
                  <span className="text-gold text-xs uppercase tracking-widest font-semibold font-poppins">{service.tagline}</span>
                  <h2 className="text-2xl sm:text-3xl font-heading text-black font-semibold">{service.title}</h2>
                </div>
              </div>

              <p className="text-grey-dark text-sm sm:text-base font-light leading-relaxed">
                {service.description}
              </p>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-gold font-poppins font-semibold">Includes:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                  {service.includes.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-black/80 font-light">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-3 bg-black text-white hover:bg-gold hover:text-black hover:shadow-gold-glow text-xs font-semibold uppercase tracking-wider rounded transition-all duration-300 transform active:scale-95"
                >
                  Consult Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action Grid Section */}
      <section className="bg-black text-white py-20 border-t border-gold/15 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-heading font-semibold">Need a Customized Service Plan?</h2>
          <p className="text-grey text-sm font-light max-w-lg mx-auto leading-relaxed">
            Our project consultant will visit your site, measure your spaces, and provide component-wise estimations for free.
          </p>
          <button
            onClick={onOpenConsultation}
            className="px-8 py-3.5 bg-gold-gradient text-black text-xs font-semibold uppercase tracking-widest rounded hover:shadow-gold-glow transition-all duration-300 transform active:scale-95"
          >
            Get Free Estimation
          </button>
        </div>
      </section>
    </div>
  );
}
