import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Heart, Award, ArrowRightCircle, Star } from 'lucide-react';
import { dataStore, defaultHomeSlides, defaultServices, defaultProjects, defaultBeforeAfterShowcase } from '../dataStore';
import type { HomeSlide, ServiceItem, ProjectItem, BeforeAfterItem } from '../dataStore';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface HomeProps {
  onOpenConsultation: () => void;
  splashDone?: boolean;
}

export default function Home({ onOpenConsultation, splashDone = false }: HomeProps) {
  const metricsRef = useRef<HTMLDivElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  // Dynamic content states
  const [slides, setSlides] = useState<HomeSlide[]>(defaultHomeSlides);
  const [servicesList, setServicesList] = useState<ServiceItem[]>(defaultServices);
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(defaultProjects);
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(defaultBeforeAfterShowcase);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const homeSlides = await dataStore.getHomeSlides();
        if (homeSlides.length > 0) setSlides(homeSlides);
        
        const servicesData = await dataStore.getServices();
        if (servicesData.length > 0) setServicesList(servicesData);
        
        const projectsData = await dataStore.getProjects();
        if (projectsData.length > 0) setProjectsList(projectsData);
        
        const beforeAfterData = await dataStore.getBeforeAfterShowcase();
        if (beforeAfterData.length > 0) setBeforeAfterItems(beforeAfterData);
      } catch (err) {
        console.error('Failed to load home page details from Supabase:', err);
      }
    };
    loadData();
  }, []);

  const previewProjects = projectsList.slice(0, 3);

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);

  // Get active slide content
  const currentSlide = slides[currentHeroIdx] || { title: '', subtext: '', image: '' };
  const titleText = currentSlide.title || '';
  const titleParts = titleText.split('|');
  const heroLine1 = titleParts[0] || '';
  const heroLine2 = titleParts[1] || '';
  const fullText = heroLine1 + (heroLine2 ? heroLine2 : '');
  const subText = currentSlide.subtext || '';

  // Typewriter state — heading
  const [typedCount, setTypedCount] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pause' | 'erasing' | 'restart'>('typing');
  const [showCursor, setShowCursor] = useState(true);

  // Counters state
  const [projectCount, setProjectCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [experienceYears, setExperienceYears] = useState(0);

  // Animate slide change
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIdx(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Reset typewriter when slide image changes
  useEffect(() => {
    setTypedCount(0);
    setPhase('typing');
  }, [currentHeroIdx]);

  // Typewriter loop
  useEffect(() => {
    if (!splashDone) return;
    AOS.init({ duration: 1000, once: false, easing: 'ease-out-cubic' });

    let t: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (typedCount < fullText.length) {
        t = setTimeout(() => setTypedCount(c => c + 1), 60);
      } else {
        // Finished typing → pause
        t = setTimeout(() => {
          setPhase('pause');
        }, 1800);
      }
    } else if (phase === 'pause') {
      t = setTimeout(() => setPhase('erasing'), 0);
    } else if (phase === 'erasing') {
      if (typedCount > 0) {
        t = setTimeout(() => setTypedCount(c => c - 1), 30);
      } else {
        t = setTimeout(() => setPhase('typing'), 500);
      }
    }

    return () => clearTimeout(t);
  }, [typedCount, phase, splashDone, fullText]);

  // Blinking cursor for heading
  useEffect(() => {
    const cursor = setInterval(() => {
      setShowCursor(v => !v);
    }, 530);
    return () => clearInterval(cursor);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startCount) return;

    // Animate counters
    const interval = setInterval(() => {
      setProjectCount(prev => (prev < 250 ? prev + 5 : 250));
      setClientCount(prev => (prev < 100 ? prev + 2 : 100));
      setExperienceYears(prev => (prev < 2 ? prev + 1 : 2));
    }, 20);

    return () => clearInterval(interval);
  }, [startCount]);

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
    },
    {
      quote: "Excellent TV unit designs and high-quality wardrobes! The fit and finish are exceptional. They did a fantastic job with modular storage optimization in our new apartment.",
      author: "Mr. Anirudh Sharma",
      loc: "Miyapur, Hyderabad"
    },
    {
      quote: "They managed our entire flat renovation end-to-end. Handed over the key right on time, fully cleaned. Their lighting layouts and partition screens look stunning.",
      author: "Mrs. Priya Nair",
      loc: "Gachibowli, Hyderabad"
    },
    {
      quote: "Best interior team in Hyderabad! The calibrated waterproof plywood they use is solid and durable. Their factory walkthrough gave me complete confidence in their quality standards.",
      author: "Mr. Ramesh G.",
      loc: "Kondapur, Hyderabad"
    },
    {
      quote: "Extremely professional carpentry. They solved our storage issues with a custom sliding wardrobe and geometric room divider partition. It fits our needs perfectly.",
      author: "Mrs. Swapna Rao",
      loc: "Pragathi Nagar, Hyderabad"
    },
    {
      quote: "Superb acrylic finishes in modular kitchen and premium soft-close drawer fittings. The execution speed was impressive and their team was very responsive.",
      author: "Mr. Vikram Malhotra",
      loc: "Jubilee Hills, Hyderabad"
    },
    {
      quote: "Affordable luxury designs that actually respect your budget. The master bedroom accent wall they built is worth every rupee. Extremely satisfied with their services.",
      author: "Mr. K. Srinivas",
      loc: "Nizampet, Hyderabad"
    },
    {
      quote: "Loved their vanity design and vanity mirrors. Their team has high design aesthetics. Sourced perfect materials to fit our modern minimalistic theme.",
      author: "Mrs. Deepika Choudhary",
      loc: "Madhapur, Hyderabad"
    },
    {
      quote: "Excellent matte finish modular kitchen. High engineering precision and clean installation. They walked us through every step. Highly trustable interiors studio.",
      author: "Mr. Manoj K.",
      loc: "Hitech City, Hyderabad"
    }
  ];

  return (
    <div className="relative">
      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-[calc(100vh-96px)] flex items-center justify-center overflow-hidden mt-20 md:mt-24">
        {/* Carousel Background Images */}
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 bg-cover bg-[position:55%_center] sm:bg-center transition-opacity duration-1000 ease-in-out ${idx === currentHeroIdx ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url("${encodeURI(s.image)}")` }}
          />
        ))}

        {/* Dark semi-transparent overlay for text contrast */}
        <div className="absolute inset-0 bg-black/45 z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center" data-aos="fade-up">

          <h1 className="text-xl sm:text-4xl md:text-5xl font-heading text-white leading-tight font-bold mb-6 text-shadow-premium">
            {(() => {
              const plain = fullText.substring(0, Math.min(typedCount, heroLine1.length));
              const gold  = typedCount > heroLine1.length
                ? fullText.substring(heroLine1.length, typedCount)
                : '';
              const cursor = <span className={`inline-block w-[2px] h-[1em] bg-white align-middle ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />;
              return (
                <>
                  {plain}
                  {gold && <span className="text-[#D4AF37] block sm:inline">{gold}</span>}
                  {typedCount < fullText.length && cursor}
                </>
              );
            })()}
          </h1>
          <p className="text-white text-xs sm:text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed text-shadow-premium font-semibold">
            {subText}
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
                loading="lazy"
                decoding="async"
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

      {/* BEFORE & AFTER SHOWCASE ON HOME */}
      <section className="py-20 bg-offwhite border-t border-grey/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Transformations</span>
            <h2 className="text-2xl sm:text-3xl font-heading text-black font-semibold mt-1">Before &amp; After Showcase</h2>
            <p className="text-grey-dark text-xs sm:text-sm font-light mt-2">
              Drag the golden divider to see the structural conversion from bare rooms to customized designer living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beforeAfterItems.slice(0, 4).map((item, index) => {
              const pos = sliderPositions[item.id] ?? 50;
              return (
                <div 
                  key={item.id}
                  data-aos="fade-up" 
                  data-aos-delay={(index % 2) * 100}
                  className="relative h-[300px] sm:h-[380px] rounded overflow-hidden shadow-xl border border-grey/25 select-none"
                >
                  {/* Background After Image */}
                  <img src={item.afterImg} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
                  <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
                  
                  {/* Foreground Clipped Before Image */}
                  <img 
                    src={item.beforeImg} 
                    alt="Before" 
                    className="absolute inset-0 w-full h-full object-cover" 
                    style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                    draggable="false" 
                    loading="lazy" 
                    decoding="async" 
                  />
                  <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
                  
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={pos} 
                    onChange={e => setSliderPositions(prev => ({ ...prev, [item.id]: Number(e.target.value) }))} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" 
                  />
                  
                  <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${pos}%` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                      <div className="flex gap-0.5">
                        <div className="w-[1.5px] h-3.5 bg-black" />
                        <div className="w-[1.5px] h-3.5 bg-black" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered View More button */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="300">
            <Link 
              to="/projects"
              className="inline-block px-8 py-3.5 border border-gold text-gold font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 transform active:scale-95 bg-black hover:bg-gold hover:text-black hover:shadow-gold-glow"
            >
              View More Transformations
            </Link>
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
          <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-grey/20">
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
            {servicesList.map((service, index) => (
              <div 
                key={service.id} 
                className="bg-white rounded overflow-hidden shadow-md group hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-grey/10"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="h-[240px] overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-black mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
                    <p className="text-grey-dark text-sm font-light leading-relaxed mb-6">{service.description}</p>
                  </div>
                  <Link 
                    to="/services"
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
                key={project.id} 
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
      <section className="py-24 bg-offwhite overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-2xl mx-auto" data-aos="fade-up">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-heading text-black font-semibold mt-2">What Our Clients Say</h2>
            <p className="text-grey-dark text-xs sm:text-sm font-light mt-3">
              Hear directly from homeowners across Hyderabad who chose our premium modular designs and expert craftsmanship.
            </p>
          </div>
        </div>

        {/* Marquee Streaming Row container */}
        <div className="relative w-full overflow-hidden py-4">
          <div className="flex animate-marquee pause-hover gap-6">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div 
                key={idx}
                className="w-[280px] sm:w-[350px] flex-shrink-0 bg-white border border-grey/15 rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-black/80 font-light text-xs sm:text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                {/* User Profile info */}
                <div className="mt-6 pt-4 border-t border-grey/10">
                  <h4 className="text-gold font-poppins font-semibold text-xs sm:text-sm tracking-wider uppercase mb-0.5">{t.author}</h4>
                  <p className="text-grey text-[10px] sm:text-xs uppercase tracking-widest">{t.loc}</p>
                </div>
              </div>
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
