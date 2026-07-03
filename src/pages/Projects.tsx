import { useState, useEffect } from 'react';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface ProjectItem {
  id: string | number;
  title: string;
  category: string;
  img: string;
  desc: string;
}

export default function Projects() {
  const defaultProjects: ProjectItem[] = [
    {
      id: 1,
      title: "Hallway Wardrobe & Partition",
      category: "Wardrobes",
      img: "/image%20copy.png",
      desc: "Sleek floor-to-ceiling hallway wardrobe combining high-gloss white laminate shutters, long black profile handles, and a marble accent sliding panel."
    },
    {
      id: 2,
      title: "Backlit Accent Master Bedroom",
      category: "Bedroom",
      img: "/image%20copy%202.png",
      desc: "Luxury bedroom design featuring custom ambient cove false ceiling, backlit floral headboard panel, and a fluted wood vanity wall with an oval LED mirror."
    },
    {
      id: 3,
      title: "Bespoke Master Suite & Partition",
      category: "Bedroom",
      img: "/image%20copy%203.png",
      desc: "Spacious bedroom interior featuring custom fluted wall cladding, sliding frosted-glass wardrobe partition, and an integrated warm-lit dressing counter."
    },
    {
      id: 4,
      title: "Premium Wash Basin & Glass Cabinet",
      category: "Living Room",
      img: "/image%20copy%204.png",
      desc: "Modern dining hand-wash corner showing a custom organic-shaped backlit mirror, black quartz vanity, and a tall glass-door display cabinet with interior profile lighting."
    },
    {
      id: 5,
      title: "Geometric TV Unit with Marble",
      category: "Living Room",
      img: "/image%20copy%205.png",
      desc: "Elegant living room entertainment center featuring geometric marble wall paneling with gold metal inlays, fluted wood slats, and a glass show-cabinet."
    },
    {
      id: 6,
      title: "Modern Luxury Living Lounge",
      category: "Living Room",
      img: "/image%20copy%206.png",
      desc: "Sophisticated living space with a large white sectional sofa, custom geometric wooden partition screen, and an abstract backlit botanical feature wall."
    },
    {
      id: 7,
      title: "Olive & White Modular Kitchen",
      category: "Modular Kitchen",
      img: "/image%20copy%207.png",
      desc: "Ergonomic L-shaped modular kitchen pairing matte olive green lower cabinets with high-gloss white overhead shutters, complete with black hardware accents."
    },
    {
      id: 8,
      title: "Teal Bedroom Study Corner",
      category: "Bedroom",
      img: "/image%20copy%208.png",
      desc: "Compact bedroom layout maximizing space with a custom-built teal study desk, vertical backlit dressing mirror, and overhead cabinet storage."
    },
    {
      id: 9,
      title: "Rattan Accent Media Console",
      category: "Living Room",
      img: "/image%20copy%209.png",
      desc: "Boho-chic entertainment unit designed with natural oak wood cabinetry, arched rattan details, a sage-green fluted background, and a slat room divider."
    },
    {
      id: 10,
      title: "Elite Marble TV Lounge",
      category: "Living Room",
      img: "/image%20copy%2010.png",
      desc: "High-end family media room featuring a large marble slab TV mount, vertical wooden profiles, warm-lit open shelves, and a cozy grey sectional sofa."
    },
    {
      id: 11,
      title: "Fluted Slate Grey Sliding Wardrobe",
      category: "Wardrobes",
      img: "/image%20copy%2011.png",
      desc: "Space-efficient master bedroom wardrobe featuring modern fluted slate grey sliding doors, black handles, and integrated top loft storage cabinets."
    },
    {
      id: 12,
      title: "Oak & Rattan Living Room Divider",
      category: "Living Room",
      img: "/image%20copy%2012.png",
      desc: "Oak-textured living room media unit showing the wood vertical slat partition, creating a semi-private entrance corridor and integrated TV unit."
    },
    {
      id: 13,
      title: "Puja Room & Kitchen Bar Partition",
      category: "Living Room",
      img: "/image%20copy%2013.png",
      desc: "Custom home partition combining a Puja room with patterned glass doors and a fluid, curved-wood breakfast bar partition screen."
    },
    {
      id: 14,
      title: "Olive Green Kitchen & Breakfast Bar",
      category: "Modular Kitchen",
      img: "/image%20copy%2014.png",
      desc: "Matte green modular kitchen layout showing the integration of a solid wood breakfast bar island counter next to the cooking zone."
    }
  ];

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [filter, setFilter] = useState("All");
  
  // Before & After comparison slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [sliderPosition2, setSliderPosition2] = useState(50);
  const [sliderPosition3, setSliderPosition3] = useState(50);
  const [sliderPosition4, setSliderPosition4] = useState(50);
  const [sliderPosition5, setSliderPosition5] = useState(50);
  const [sliderPosition6, setSliderPosition6] = useState(50);
  const [sliderPosition7, setSliderPosition7] = useState(50);
  const [sliderPosition8, setSliderPosition8] = useState(50);
  const [sliderPosition9, setSliderPosition9] = useState(50);
  const [sliderPosition10, setSliderPosition10] = useState(50);
  
  // Lightbox state
  const [activeImgIdx, setActiveImgIdx] = useState<number | null>(null);



  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    loadProjects();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [projects, filter]);

  const loadProjects = () => {
    let loaded = [...defaultProjects];
    const saved = localStorage.getItem('custom_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          loaded = [...loaded, ...parsed];
        }
      } catch (e) {
        console.error("Error parsing custom projects:", e);
      }
    }
    console.log("Loaded projects count:", loaded.length, loaded);
    setProjects(loaded);
  };



  // Get categories
  const categories = ["All", "Modular Kitchen", "Living Room", "Bedroom", "Wardrobes"];

  // Filtered list
  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setActiveImgIdx(index);
  };

  const closeLightbox = () => {
    setActiveImgIdx(null);
  };

  const nextSlide = () => {
    if (activeImgIdx !== null) {
      setActiveImgIdx((activeImgIdx + 1) % filteredProjects.length);
    }
  };

  const prevSlide = () => {
    if (activeImgIdx !== null) {
      setActiveImgIdx((activeImgIdx - 1 + filteredProjects.length) % filteredProjects.length);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-offwhite relative">
      {/* Header */}
      <div className="bg-black text-white py-20 border-b border-gold/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Portfolio Showcase</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white">Our Recent Projects</h1>
          <p className="text-grey max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Take a look at our premium installations. Filter by space category, view before-and-after slider comparisons, or upload your layout concepts.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* BEFORE & AFTER SHOWCASE */}
        <div className="mb-24 space-y-8" data-aos="fade-up">
          <div className="text-center">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Transformation Quality</span>
            <h2 className="text-2xl sm:text-3xl font-heading text-black font-semibold mt-1">Before &amp; After Showcase</h2>
            <p className="text-grey-dark text-xs sm:text-sm font-light max-w-md mx-auto mt-2">
              Drag the divider slider to see the structural transformation from a raw workspace to completed premium luxury.
            </p>
          </div>

          {/* Three sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Slider 1 */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-2.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
                <img src="/before-work-2.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition} onChange={e => setSliderPosition(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 2 */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-3.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition2}%` }}>
                <img src="/before-work-3.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition2} onChange={e => setSliderPosition2(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition2}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 3 */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition3}%` }}>
                <img src="/before-work.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition3} onChange={e => setSliderPosition3(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition3}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 4 - Project D */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-4.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition4}%` }}>
                <img src="/before-work-4.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition4} onChange={e => setSliderPosition4(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition4}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 5 - Project E */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-5.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition5}%` }}>
                <img src="/before-work-5.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition5} onChange={e => setSliderPosition5(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition5}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 6 - Project F */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-6.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition6}%` }}>
                <img src="/before-work-6.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition6} onChange={e => setSliderPosition6(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition6}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 7 - Project G */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-7.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition7}%` }}>
                <img src="/before-work-7.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition7} onChange={e => setSliderPosition7(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition7}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 8 - Project H */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-8.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition8}%` }}>
                <img src="/before-work-8.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition8} onChange={e => setSliderPosition8(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition8}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 9 - Project I */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-9.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition9}%` }}>
                <img src="/before-work-9.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition9} onChange={e => setSliderPosition9(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition9}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

            {/* Slider 10 - Project J */}
            <div data-aos="fade-up" className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none">
              <img src="/after-work-10.png" alt="After" className="absolute inset-0 w-full h-full object-cover" draggable="false" loading="lazy" decoding="async" />
              <div className="absolute bottom-4 right-4 bg-gold/90 text-black px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">After</div>
              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition10}%` }}>
                <img src="/before-work-10.png" alt="Before" className="absolute inset-y-0 left-0 h-full object-cover" style={{ width: '100vw' }} draggable="false" loading="lazy" decoding="async" />
                <div className="absolute bottom-4 left-4 bg-black/90 text-white px-3 py-1 border border-grey/50 rounded text-xs font-semibold uppercase tracking-wider font-poppins z-20">Before</div>
              </div>
              <input type="range" min="0" max="100" value={sliderPosition10} onChange={e => setSliderPosition10(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
              <div className="absolute inset-y-0 w-1 bg-gold z-20 pointer-events-none" style={{ left: `${sliderPosition10}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold border border-black flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5"><div className="w-[1.5px] h-3.5 bg-black" /><div className="w-[1.5px] h-3.5 bg-black" /></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CONTROLS (Category Filter) */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 border-b border-grey/20 pb-8">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Filter className="w-4 h-4 text-gold mr-2 hidden sm:block" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded transition-all duration-300 ${filter === cat ? 'bg-gold text-black shadow-gold' : 'bg-white border border-grey/25 text-black/75 hover:border-gold hover:text-gold'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GALLERY GRID */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white border border-grey/15 rounded">
            <p className="text-grey text-sm">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((p, idx) => (
              <div 
                key={p.id}
                onClick={() => openLightbox(idx)}
                className="bg-white rounded overflow-hidden shadow-sm group hover:shadow-xl hover:border-gold/30 border border-grey/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
                data-aos="zoom-in"
              >
                <div className="h-[250px] overflow-hidden relative">
                  <img 
                    src={p.img} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 border border-white text-white rounded uppercase tracking-wider text-[10px] font-semibold font-poppins bg-black/40 backdrop-blur-sm">
                      View Larger
                    </span>
                  </div>
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/85 text-gold text-[10px] uppercase font-poppins tracking-widest font-semibold rounded border border-gold/20">
                    {p.category}
                  </span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-black mb-2 group-hover:text-gold transition-colors">{p.title}</h3>
                    <p className="text-grey-dark text-xs sm:text-sm font-light leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
                  </div>
                  <div className="text-xs text-gold uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:underline">
                    View Portfolio Detail
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX OVERLAY */}
      {activeImgIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gold transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Left Arrow */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 text-white hover:text-gold transition-colors p-2 bg-black/40 border border-white/10 rounded-full"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image slide view */}
          <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
            <img 
              src={filteredProjects[activeImgIdx].img} 
              alt={filteredProjects[activeImgIdx].title} 
              className="max-w-full max-h-[70vh] object-contain rounded border border-grey/25"
            />
            <div className="text-center mt-6 text-white max-w-xl">
              <span className="text-gold text-xs uppercase tracking-widest font-poppins">{filteredProjects[activeImgIdx].category}</span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold mt-1">{filteredProjects[activeImgIdx].title}</h3>
              <p className="text-grey text-xs sm:text-sm font-light leading-relaxed mt-2">{filteredProjects[activeImgIdx].desc}</p>
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 text-white hover:text-gold transition-colors p-2 bg-black/40 border border-white/10 rounded-full"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}
