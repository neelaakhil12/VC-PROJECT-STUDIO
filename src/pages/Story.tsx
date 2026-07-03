import { useEffect, cloneElement } from 'react';
import { Target, Eye, ShieldCheck, Heart, Sparkles, Handshake, Gem } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Story() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false
    });
  }, []);

  const coreValues = [
    {
      title: "Quality",
      desc: "Calibrated waterproof plywood, branded accessories, and precise machinery cuts for a flawless finish.",
      icon: <Gem className="w-6 h-6 text-gold" />
    },
    {
      title: "Trust",
      desc: "Complete transparency of material specs and zero hidden escalation costs on completion.",
      icon: <ShieldCheck className="w-6 h-6 text-gold" />
    },
    {
      title: "Creativity",
      desc: "Bespoke design layouts that maximize visual utility and solve modern space storage issues.",
      icon: <Sparkles className="w-6 h-6 text-gold" />
    },
    {
      title: "Transparency",
      desc: "Honest communication, shared factory walkthroughs, and step-by-step progress tracking dashboards.",
      icon: <Handshake className="w-6 h-6 text-gold" />
    },
    {
      title: "Customer Satisfaction",
      desc: "Delivering dream interiors that bring a bright smile to our clients' faces. Backed by post-installation warranty.",
      icon: <Heart className="w-6 h-6 text-gold" />
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-offwhite">
      {/* Header Banner */}
      <div className="bg-black text-white py-20 border-b border-gold/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('/image copy 12.png')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Our Foundations</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white">Our Story</h1>
          <p className="text-grey max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Discover the passion, vision, and core principles that drive Project Studio forward since our launch in 2024.
          </p>
        </div>
      </div>

      {/* Main Philosophy & Why We Started */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6" data-aos="fade-right">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins font-semibold">The Genesis</span>
            <h2 className="text-3xl sm:text-4xl font-heading text-black font-semibold">Why We Started Project Studio</h2>
            <p className="text-grey-dark text-sm sm:text-base font-light leading-relaxed">
              In early 2024, our founders noticed a recurring trend in the home design sector. Homeowners in Hyderabad were constantly forced to pick between two extremes: expensive premium design studios that charge a fortune, or local carpentering with high risks of delays, material swapping, and poor fitting.
            </p>
            <p className="text-grey-dark text-sm sm:text-base font-light leading-relaxed">
              Project Studio was established in Kukatpally with a clear objective: to combine state-of-the-art modular engineering and beautiful luxury aesthetics with honest, budget-friendly parameters. We make affordable premium homes a regular reality.
            </p>
          </div>

          <div className="relative" data-aos="fade-left">
            <div className="absolute -top-3 -left-3 w-full h-full border border-gold/20 rounded -z-10"></div>
            <img 
              src="/image copy 9.png" 
              alt="Bespoke furniture setup" 
              className="w-full h-[360px] object-cover rounded shadow"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision (Alternating dark section) */}
      <section className="bg-black text-white py-24 relative border-y border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="p-8 border border-grey/20 rounded bg-[#090909] space-y-4 hover:border-gold/40 transition-colors" data-aos="fade-up">
            <div className="w-12 h-12 rounded bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-heading text-white font-bold">Our Mission</h3>
            <p className="text-grey text-sm font-light leading-relaxed">
              To make our clients genuinely happy by delivering high-end, premium quality dream interiors that are highly affordable, honest, and built with long-lasting durability.
            </p>
          </div>

          <div className="p-8 border border-grey/20 rounded bg-[#090909] space-y-4 hover:border-gold/40 transition-colors" data-aos="fade-up" data-aos-delay="100">
            <div className="w-12 h-12 rounded bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Eye className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-xl font-heading text-white font-bold">Our Vision</h3>
            <p className="text-grey text-sm font-light leading-relaxed">
              To democratize premium interior layouts so that sophisticated design, modular flexibility, and transparent execution are fully accessible to every budget category in Hyderabad.
            </p>
          </div>

        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Core Principles</span>
          <h2 className="text-3xl sm:text-4xl font-heading text-black font-semibold mt-2">The Values We Live By</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((val, idx) => (
            <div 
              key={idx}
              className="p-8 bg-white border border-grey/15 rounded hover:shadow-lg transition-all duration-300 space-y-4 group hover:border-gold/30"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <div className="w-12 h-12 border border-gold/20 rounded flex items-center justify-center bg-gold/5 group-hover:bg-gold transition-colors duration-300">
                {cloneElement(val.icon, {
                  className: "w-6 h-6 text-gold group-hover:text-black transition-colors"
                })}
              </div>
              <h3 className="text-lg font-heading text-black font-bold group-hover:text-gold transition-colors">{val.title}</h3>
              <p className="text-grey-dark text-xs sm:text-sm font-light leading-relaxed">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
