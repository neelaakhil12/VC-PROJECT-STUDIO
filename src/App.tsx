import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Story from './pages/Story';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import ConsultationModal from './components/ConsultationModal';
import PageTransition from './components/PageTransition';
import SplashScreen from './components/SplashScreen';
import { MessageSquare, PhoneCall } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  return (
    <Router>
      <PageTransition />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <div className="flex flex-col min-h-screen overflow-x-hidden max-w-full bg-[#F8F8F8] text-[#000000] selection:bg-[#D4AF37] selection:text-black">
        {/* Sticky luxury Navbar */}
        <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

        {/* Dynamic Route Container */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onOpenConsultation={() => setIsConsultationOpen(true)} />} />
            <Route path="/services" element={<Services onOpenConsultation={() => setIsConsultationOpen(true)} />} />
            <Route path="/about" element={<Story />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Premium footer */}
        <Footer />

        {/* Global Consultation Modal Popup */}
        <ConsultationModal 
          isOpen={isConsultationOpen} 
          onClose={() => setIsConsultationOpen(false)} 
        />

        {/* FLOATING QUICK ACTIONS */}
        <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
          {/* Quick Call Action */}
          <a 
            href="tel:+916305093192"
            className="w-12 h-12 bg-black text-gold border border-gold/30 hover:border-gold rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 group"
            aria-label="Call Project Studio"
          >
            <PhoneCall className="w-5 h-5 group-hover:animate-pulse" />
          </a>

          {/* Floating WhatsApp Action */}
          <a 
            href="https://wa.me/916305093192?text=Hi%20Project%20Studio%2C%20I%20would%20like%20to%20book%20a%20consultation%20for%20my%20home%20interiors."
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 transition-transform hover:scale-110 active:scale-95 group relative"
            aria-label="Chat on WhatsApp"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </a>
        </div>
      </div>
    </Router>
  );
}
