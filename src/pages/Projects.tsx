import { useState, useEffect, useRef } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, Play, Video } from 'lucide-react';
import { dataStore, defaultProjects, defaultBeforeAfterShowcase } from '../dataStore';
import type { BeforeAfterItem } from '../dataStore';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface ProjectItem {
  id: string | number;
  title: string;
  category: string;
  img: string;
  desc: string;
  videoUrl?: string;
}

// Detect if URL is YouTube embed, YouTube watch, or direct MP4
function getVideoType(url: string): 'youtube' | 'mp4' | null {
  if (!url) return null;
  if (url.includes('youtube.com/embed') || url.includes('youtu.be') || url.includes('youtube.com/watch')) return 'youtube';
  if (url.includes('.mp4') || url.includes('cloudinary') || url.includes('video')) return 'mp4';
  return 'youtube'; // default fallback
}

// Convert any YouTube URL to embed format
function toYouTubeEmbed(url: string): string {
  if (url.includes('/embed/')) return url;
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(defaultBeforeAfterShowcase);
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All", "Modular Kitchen", "Living Room", "Bedroom", "Wardrobes"]);
  
  // Lightbox state
  const [activeImgIdx, setActiveImgIdx] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    loadProjects();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [projects, filter]);

  const loadProjects = async () => {
    try {
      const projectsData = await dataStore.getProjects();
      if (projectsData.length > 0) setProjects(projectsData);

      const beforeAfterData = await dataStore.getBeforeAfterShowcase();
      if (beforeAfterData.length > 0) setBeforeAfterItems(beforeAfterData);

      const catsData = await dataStore.getProjectCategories();
      if (catsData.length > 0) {
        setCategories(["All", "Videos", ...catsData.map(c => c.name)]);
      } else {
        setCategories(["All", "Videos", "Modular Kitchen", "Living Room", "Bedroom", "Wardrobes"]);
      }
    } catch (err) {
      console.error('Failed to load portfolio projects from Supabase:', err);
    }
  };

  // Filtered list
  const filteredProjects = filter === "All" 
    ? projects.filter(p => !p.videoUrl) 
    : filter === "Videos"
      ? projects.filter(p => p.videoUrl && p.videoUrl.trim() !== '')
      : projects.filter(p => p.category === filter && !p.videoUrl);

  // Projects that have a video
  const projectsWithVideo = projects.filter(p => p.videoUrl && p.videoUrl.trim() !== '');

  // Lightbox handlers
  const openLightbox = (index: number) => setActiveImgIdx(index);
  const closeLightbox = () => setActiveImgIdx(null);
  const nextSlide = () => {
    if (activeImgIdx !== null) setActiveImgIdx((activeImgIdx + 1) % filteredProjects.length);
  };
  const prevSlide = () => {
    if (activeImgIdx !== null) setActiveImgIdx((activeImgIdx - 1 + filteredProjects.length) % filteredProjects.length);
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

        {/* ========== VIDEO SHOWCASE SECTION ========== */}
        {projectsWithVideo.length > 0 && (
          <div className="mb-24" data-aos="fade-up">
            <div className="text-center mb-10">
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Cinematic Walkthroughs</span>
              <h2 className="text-2xl sm:text-3xl font-heading text-black font-semibold mt-1">Project Video Showcase</h2>
              <p className="text-grey-dark text-xs sm:text-sm font-light max-w-md mx-auto mt-2">
                Watch our interior transformations come to life through immersive video tours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projectsWithVideo.map((project, index) => {
                const videoType = getVideoType(project.videoUrl!);
                const isYoutube = videoType === 'youtube';
                const embedUrl = isYoutube ? toYouTubeEmbed(project.videoUrl!) : project.videoUrl!;

                return (
                  <div
                    key={project.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="group bg-black rounded-xl overflow-hidden border border-gold/15 shadow-2xl hover:border-gold/40 transition-all duration-500"
                  >
                    {/* Video Player */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      {isYoutube ? (
                        <iframe
                          src={`${embedUrl}?autoplay=0&rel=0&modestbranding=1`}
                          title={project.title}
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover"
                          controls
                          poster={project.img}
                          preload="metadata"
                        >
                          <source src={embedUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>

                    {/* Video card info */}
                    <div className="p-5 border-t border-gold/10">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-poppins font-semibold">{project.category}</span>
                          <h3 className="text-white font-heading font-bold text-base mt-0.5 group-hover:text-gold transition-colors">
                            {project.title}
                          </h3>
                          {project.desc && (
                            <p className="text-grey text-xs font-light leading-relaxed mt-1.5 line-clamp-2">{project.desc}</p>
                          )}
                        </div>
                        <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center bg-gold/10">
                          <Video className="w-4 h-4 text-gold" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BEFORE & AFTER SHOWCASE */}
        <div className="mb-24 space-y-8" data-aos="fade-up">
          <div className="text-center">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Transformation Quality</span>
            <h2 className="text-2xl sm:text-3xl font-heading text-black font-semibold mt-1">Before &amp; After Showcase</h2>
            <p className="text-grey-dark text-xs sm:text-sm font-light max-w-md mx-auto mt-2">
              Drag the divider slider to see the structural transformation from a raw workspace to completed premium luxury.
            </p>
          </div>

          {/* Dynamic Sliders list from storage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beforeAfterItems.map((item, index) => {
              const pos = sliderPositions[item.id] ?? 50;
              return (
                <div 
                  key={item.id}
                  data-aos="fade-up" 
                  data-aos-delay={(index % 2) * 100}
                  className="relative h-[300px] sm:h-[400px] rounded overflow-hidden shadow-2xl border border-grey/25 select-none"
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
        </div>

        {/* CONTROLS (Category Filter) */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 border-b border-grey/20 pb-8">
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
                onClick={() => {
                  if (p.videoUrl) {
                    setActiveVideo({ url: p.videoUrl, title: p.title });
                  } else {
                    openLightbox(idx);
                  }
                }}
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
                  {/* Video badge if project has a video */}
                  {p.videoUrl && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-gold text-black text-[9px] uppercase font-poppins tracking-wider font-bold rounded">
                      <Play className="w-2.5 h-2.5 fill-black" /> Video
                    </span>
                  )}
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
      {activeImgIdx !== null && filteredProjects[activeImgIdx] && (
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
              {filteredProjects[activeImgIdx].videoUrl && (
                <a
                  href={filteredProjects[activeImgIdx].videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-gold text-black rounded text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-black" /> Watch Video
                </a>
              )}
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

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-12"
          onClick={() => setActiveVideo(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-gold transition-colors">
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="relative w-full rounded-xl overflow-hidden border border-gold/20 shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              {getVideoType(activeVideo.url) === 'youtube' ? (
                <iframe
                  src={`${toYouTubeEmbed(activeVideo.url)}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  autoPlay
                >
                  <source src={activeVideo.url} type="video/mp4" />
                </video>
              )}
            </div>
            <p className="text-center text-white font-heading font-semibold mt-4 text-lg">{activeVideo.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
