import { useState, useEffect } from 'react';
import { LayoutGrid, Wrench, Palette, Check, ShieldCheck, Heart, Award, Star } from 'lucide-react';
import { dataStore, defaultServices } from '../dataStore';
import type { ServiceItem } from '../dataStore';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface ServicesProps {
  onOpenConsultation: () => void;
}

const renderIcon = (iconName: string) => {
  const props = { className: "w-8 h-8 text-gold" };
  switch (iconName) {
    case 'LayoutGrid': return <LayoutGrid {...props} />;
    case 'Wrench': return <Wrench {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'Award': return <Award {...props} />;
    case 'Star': return <Star {...props} />;
    default: return <LayoutGrid {...props} />;
  }
};

export default function Services({ onOpenConsultation }: ServicesProps) {
  const [serviceCategories, setServiceCategories] = useState<ServiceItem[]>(defaultServices);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });
    
    const loadServices = async () => {
      try {
        const data = await dataStore.getServices();
        if (data.length > 0) setServiceCategories(data);
      } catch (err) {
        console.error('Failed to load services:', err);
      }
    };
    loadServices();
  }, []);

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
            key={service.id}
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
                  {renderIcon(service.icon)}
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
