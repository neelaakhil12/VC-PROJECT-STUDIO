import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Heart, Award, ArrowRightCircle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface HomeProps {
  onOpenConsultation: () => void;
}

export default function Home({ onOpenConsultation }: HomeProps) {
  // Counters state
  const [projectCount, setProjectCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [experienceYears, setExperienceYears] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });

    // Animate counters
    const interval = setInterval(() => {
      setProjectCount(prev => (prev < 250 ? prev + 5 : 250));
      setClientCount(prev => (prev < 100 ? prev + 2 : 100));
      setExperienceYears(prev => (prev < 2 ? prev + 1 : 2));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const heroImages = [
    "/image copy 10.png",
    "/image copy 13.png",
    "/image copy 12.png",
    "/image copy 14.png",
    "/image copy.png"
  ];

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      title: "Modular Solutions & Carpentry",
      desc: "Perfect fitting modular kitchens, custom wardrobes, storage structures, and sleek TV units crafted to match your dimensions.",
      img: "/image%20copy%207.png",
      link: "/services"
    },
    {
      title: "Turnkey Execution",
      desc: "End-to-end management including partition, electrical cabling, premium lighting layouts, false ceilings, and post-work deep cleaning.",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      link: "/services"
    },
    {
      title: "Styling & Decor Consultation",
      desc: "Curating premium color schemes, custom wallpapers, fabric curtains, designer fixtures, and soft furnishings to complete the look.",
      img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
      link: "/services"
    }
  ];

  const previewProjects = [
    {
      title: "Modern Luxury Living Lounge",
      desc: "Sophisticated living space with a large sectional sofa, custom wooden partition, and an abstract backlit botanical wall.",
      img: "/image%20copy%206.png"
    },
    {
      title: "Olive & White Modular Kitchen",
      desc: "Ergonomic L-shaped modular kitchen pairing matte olive green lower cabinets with high-gloss white overhead shutters.",
      img: "/image%20copy%207.png"
    },
    {
      title: "Backlit Accent Master Bedroom",
      desc: "Luxury bedroom design featuring custom ambient cove false ceiling, backlit floral headboard, and a fluted vanity wall.",
      img: "/image%20copy%202.png"
    }
  ];

  const testimonials = [
    {
      quote: "Project Studio transformed our 3BHK flat in Kukatpally into an absolute masterclass. The modular kitchen and false ceiling work are perfect, and all within our budget! Highly recommend.",
      author: "Mr. Satish Kumar",
      loc: "Kukatpally, Hyderabad"
    },
    {
      quote: "The team is extremely transparent about costs and materials. No hidden fees. The execution was done within the timelines, and their carpentry finishes are incredibly premium.",
      author: "Mrs. Lavanya Reddy",
      loc: "Allwyn Colony, Hyderabad"
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-[calc(100vh-96px)] flex items-center justify-center overflow-hidden mt-20 md:mt-24">
        {/* Carousel Background Images */}
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-[position:55%_center] sm:bg-center transition-opacity duration-1000 ease-in-out ${idx === currentHeroIdx ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url("${encodeURI(img)}")` }}
          />
        ))}

        {/* Dark semi-transparent overlay for text contrast */}
        <div className="absolute inset-0 bg-black/45 z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center" data-aos="fade-up">

          <h1 className="text-xl sm:text-4xl md:text-5xl font-heading text-white leading-tight font-bold mb-6 text-shadow-premium">
            Crafting Dream Interiors with <span className="text-[#D4AF37] block sm:inline">Elegance & Affordability</span>
          </h1>
          <p className="text-white text-xs sm:text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed text-shadow-premium font-semibold">
            Transform your home with premium modular designs and expert styling, tailored to your budget.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <Link 
              to="/projects"
              className="w-[70%] max-w-[240px] sm:w-auto px-5 py-2.5 sm:px-8 sm:py-3.5 bg-gold-gradient text-black font-semibold uppercase tracking-wider text-[11px] sm:text-xs rounded hover:shadow-gold-glow transition-all duration-300 transform active:scale-95 text-center font-bold"
            >
              View Projects
            </Link>
            <button 
              onClick={onOpenConsultation}
              className="w-[70%] max-w-[240px] sm:w-auto px-5 py-2.5 sm:px-8 sm:py-3.5 border border-gold text-gold font-bold uppercase tracking-wider text-[11px] sm:text-xs rounded transition-all duration-300 transform active:scale-95 text-center bg-black/60 hover:bg-gold hover:text-black"
            >
              Book Consultation
            </button>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-2 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-poppins">Scroll Down</span>
          <div className="w-[1px] h-8 bg-gold" />
        </div>
      </section>

      {/* ABOUT PREVIEW (Off-white section) */}
      <section className="py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative" data-aos="fade-right">
              {/* Premium image border */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/30 rounded z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Project Studio Luxury Finish" 
                className="relative z-10 w-full h-[450px] object-cover rounded shadow-lg"
              />
              {/* Decorative absolute tag */}
              <div className="absolute bottom-6 left-6 z-20 bg-black/90 border border-gold/40 px-6 py-4 rounded text-white shadow-gold">
                <p className="text-gold font-heading text-2xl font-bold">Est. 2024</p>
                <p className="text-xs uppercase tracking-widest font-poppins text-grey">Kukatpally, Hyderabad</p>
              </div>
            </div>

            <div className="space-y-6" data-aos="fade-left">
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Our Philosophy</span>
              <h2 className="text-3xl sm:text-4xl font-heading text-black font-semibold leading-snug">
                We Believe Premium Design Doesn't Have to Carry a Premium Price Tag
              </h2>
              <p className="text-grey-dark font-light text-sm sm:text-base leading-relaxed">
                Project Studio was founded in 2024 in Kukatpally, Hyderabad, with a clear and singular objective: to bridge the gap between premium modular quality and financial accessibility. Every homeowner deserves to walk into an elegant, functional space they feel proud of.
              </p>
              <p className="text-grey-dark font-light text-sm sm:text-base leading-relaxed">
                From luxury wardrobe cabinetry to modular solutions and complete turnkey transformations, we handle every detail from civil tasks to styling with honesty, transparency, and top-tier execution.
              </p>
              <div className="pt-4">
                <Link 
                  to="/about"
                  className="inline-flex items-center gap-2 text-black hover:text-gold font-semibold uppercase tracking-widest text-xs transition-colors group"
                >
                  Learn Our Full Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US & METRIC COUNTERS (Black section) */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Value Proposition</span>
            <h2 className="text-3xl sm:text-4xl font-heading text-white font-bold mt-2">Why Homeowners Trust Project Studio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="p-8 border border-grey/25 rounded bg-[#090909] group hover:border-gold/50 transition-all duration-300" data-aos="zoom-in">
              <div className="w-12 h-12 border border-gold/30 text-gold rounded flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-colors duration-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading text-white mb-3">Honest & Transparent Pricing</h3>
              <p className="text-grey text-sm font-light leading-relaxed">
                We believe in transparency. Detailed component-wise pricing, material specifications, and zero hidden charges ensure you stay in control of your budget.
              </p>
            </div>

            <div className="p-8 border border-grey/25 rounded bg-[#090909] group hover:border-gold/50 transition-all duration-300" data-aos="zoom-in" data-aos-delay="100">
              <div className="w-12 h-12 border border-gold/30 text-gold rounded flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-colors duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading text-white mb-3">Premium Brand Quality</h3>
              <p className="text-grey text-sm font-light leading-relaxed">
                No compromises on quality. We source calibrated plywood, premium laminate finishes, soft-close hardware, and top-tier acrylic materials.
              </p>
            </div>

            <div className="p-8 border border-grey/25 rounded bg-[#090909] group hover:border-gold/50 transition-all duration-300" data-aos="zoom-in" data-aos-delay="200">
              <div className="w-12 h-12 border border-gold/30 text-gold rounded flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-black transition-colors duration-300">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading text-white mb-3">Happiness Guaranteed</h3>
              <p className="text-grey text-sm font-light leading-relaxed">
                Our main goal is to deliver dream homes that make clients happy. Our dedicated post-execution support is always ready to assist you.
              </p>
            </div>

          </div>

          {/* Animated Metrics Counter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-grey/20">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold">{projectCount}+</p>
              <p className="text-xs uppercase tracking-widest text-grey font-poppins mt-2">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold">{clientCount}%</p>
              <p className="text-xs uppercase tracking-widest text-grey font-poppins mt-2">Happy Clients</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold">{experienceYears}+ Years</p>
              <p className="text-xs uppercase tracking-widest text-grey font-poppins mt-2">Design Journey</p>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES PREVIEW (Off-white section) */}
      <section className="py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Our Expertise</span>
              <h2 className="text-3xl sm:text-4xl font-heading text-black font-semibold mt-2">Customized Interior Services</h2>
            </div>
            <Link 
              to="/services" 
              className="mt-4 md:mt-0 text-xs font-semibold uppercase tracking-widest hover:text-gold transition-colors inline-flex items-center gap-2 group border-b border-black hover:border-gold pb-1"
            >
              Explore All Services <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded overflow-hidden shadow-md group hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-grey/10"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="h-[240px] overflow-hidden relative">
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-black mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
                    <p className="text-grey-dark text-sm font-light leading-relaxed mb-6">{service.desc}</p>
                  </div>
                  <Link 
                    to={service.link}
                    className="text-xs uppercase tracking-widest font-semibold hover:text-gold transition-colors flex items-center gap-2"
                  >
                    Read Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT PROJECTS PREVIEW (Black section) */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Portfolio Highlights</span>
              <h2 className="text-3xl sm:text-4xl font-heading text-white font-bold mt-2">Explore Recent Projects</h2>
            </div>
            <Link 
              to="/projects" 
              className="mt-4 md:mt-0 text-xs text-gold font-semibold uppercase tracking-widest hover:text-white transition-colors inline-flex items-center gap-2 group border-b border-gold hover:border-white pb-1"
            >
              Go To Gallery <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previewProjects.map((project, index) => (
              <div 
                key={index} 
                className="group relative h-[380px] overflow-hidden rounded border border-grey/20"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
                  <h3 className="font-heading text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-grey text-xs font-light leading-relaxed mb-4 line-clamp-2">{project.desc}</p>
                  <Link 
                    to="/projects"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gold hover:text-white transition-colors"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (Off-white section) */}
      <section className="py-24 bg-offwhite overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-heading text-black font-semibold mt-2 mb-12">What Our Clients Say</h2>

          <div className="relative min-h-[220px] flex items-center justify-center">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className={`transition-all duration-700 absolute inset-x-0 ${idx === activeTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <p className="text-lg sm:text-2xl font-heading italic text-black/85 leading-relaxed font-light mb-8 max-w-3xl mx-auto">
                  "{t.quote}"
                </p>
                <h4 className="text-gold font-poppins font-semibold text-sm tracking-wider uppercase mb-1">{t.author}</h4>
                <p className="text-grey text-xs uppercase tracking-widest">{t.loc}</p>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === activeTestimonial ? 'bg-gold w-6' : 'bg-grey/40 hover:bg-grey'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER (Black section with gold border) */}
      <section className="py-20 bg-black text-white relative border-y border-gold/15">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6" data-aos="zoom-in">
          <h2 className="text-3xl sm:text-5xl font-heading text-white font-bold leading-tight">
            Ready to Build Your <span className="text-gold">Dream Interior</span>?
          </h2>
          <p className="text-grey max-w-lg mx-auto text-sm sm:text-base font-light leading-relaxed">
            Get professional modular solutions, electrical lighting grids, false ceiling design, and complete premium decor layout customized to your needs.
          </p>
          <div className="pt-4">
            <button 
              onClick={onOpenConsultation}
              className="px-8 py-3.5 bg-gold-gradient text-black font-semibold uppercase tracking-wider text-xs rounded hover:shadow-gold-glow transition-all duration-300 transform active:scale-95 inline-flex items-center gap-2 group"
            >
              Book A Free Consultation <ArrowRightCircle className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
