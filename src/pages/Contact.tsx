import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Modular Kitchens',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showContactSelect, setShowContactSelect] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowContactSelect(true);
  };

  const handleSendToWhatsApp = (selectedNumber: string) => {
    const textMessage = `Hi Project Studio,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nService Interested: ${formData.service}\nMessage: ${formData.message}`;
    const url = `https://wa.me/${selectedNumber}?text=${encodeURIComponent(textMessage)}`;

    // Store in local storage
    const existing = localStorage.getItem('messages');
    const list = existing ? JSON.parse(existing) : [];
    const newMessage = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      sentTo: selectedNumber
    };
    localStorage.setItem('messages', JSON.stringify([...list, newMessage]));

    setShowContactSelect(false);
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#000000']
    });

    window.open(url, "_blank");

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Modular Kitchens',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="pt-24 min-h-screen bg-offwhite">
      {/* Page Header */}
      <div className="bg-black text-white py-20 border-b border-gold/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white">Contact Us</h1>
          <p className="text-grey max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Drop by our studio office in Kukatpally, give us a call, or fill out our quick estimate sheet below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Maps (5 cols) */}
          <div className="lg:col-span-5 space-y-8" data-aos="fade-right">
            <div className="space-y-6">
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold font-poppins font-semibold">Studio Info</span>
              <h2 className="text-3xl font-heading text-black font-semibold">Let's Discuss Your Dream Spaces</h2>
              <p className="text-grey-dark text-sm font-light leading-relaxed">
                Have questions about design costs, materials durability, or layout timelines? Speak directly with our lead interior designer.
              </p>
            </div>

            {/* Quick Cards */}
            <div className="space-y-4 text-sm text-black">
              
              <div className="flex items-start gap-4 p-5 bg-white border border-grey/10 rounded">
                <MapPin className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Studio Location</h4>
                  <p className="text-grey-dark text-xs mt-1 leading-relaxed">
                    Kukatpally, Allwyn Colony, Near Saibaba Temple, Hyderabad, TS, 500072
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-grey/10 rounded">
                <Phone className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Direct Phone</h4>
                  <div className="flex flex-col gap-1 mt-1">
                    <a href="tel:+916305093192" className="text-grey-dark text-xs block hover:text-gold transition-colors">
                      +91 63050 93192
                    </a>
                    <a href="tel:+917660994433" className="text-grey-dark text-xs block hover:text-gold transition-colors">
                      +91 76609 94433
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-grey/10 rounded">
                <Mail className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Email Address</h4>
                  <a href="mailto:vcprojectstudio@gmail.com" className="text-grey-dark text-xs mt-1 block hover:text-gold transition-colors">
                    vcprojectstudio@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-grey/10 rounded">
                <Clock className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Operating Hours</h4>
                  <p className="text-grey-dark text-xs mt-1">
                    Monday - Sunday: 10:00 AM - 8:30 PM
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Chat Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="tel:+916305093192"
                className="flex items-center justify-center gap-2 py-3 border border-black hover:border-gold hover:text-gold font-semibold uppercase text-xs rounded transition-all tracking-wider text-center bg-white"
              >
                Call Office
              </a>
              <a 
                href="https://wa.me/916305093192?text=Hi%20Project%20Studio%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20my%20home%20interiors."
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold uppercase text-xs rounded transition-all tracking-wider text-center"
              >
                WhatsApp Us
              </a>
            </div>

          </div>

          {/* Contact Form & Maps Embed (7 cols) */}
          <div className="lg:col-span-7 space-y-8" data-aos="fade-left">
            {/* Contact Form card block */}
            <div className="bg-black border border-gold/30 rounded-lg p-8 shadow-gold relative overflow-hidden">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-heading text-white mb-2">Message Received!</h3>
                  <p className="text-grey text-sm max-w-xs leading-relaxed">
                    Thank you {formData.name}. We have logged your request and our lead designer will call you back shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-heading text-white font-bold flex items-center gap-2">
                    <Send className="w-5 h-5 text-gold" /> Send a direct message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold font-poppins mb-1.5 font-semibold">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="John Doe"
                        className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm transition-all"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gold font-poppins mb-1.5 font-semibold">Phone Number</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="+91 63050 93192"
                          className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm transition-all"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gold font-poppins mb-1.5 font-semibold">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="john@example.com"
                          className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm transition-all"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold font-poppins mb-1.5 font-semibold">Select Design Area</label>
                      <select 
                        className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm transition-all"
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                      >
                        <option value="Modular Kitchens">Modular Kitchens</option>
                        <option value="Wardrobes / Custom Carpentry">Wardrobes & Carpentry</option>
                        <option value="Complete Home Makeover">Complete Turnkey Makeover</option>
                        <option value="Styling Consultation">Styling Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gold font-poppins mb-1.5 font-semibold">Your Message / Space size</label>
                      <textarea 
                        rows={3} 
                        required
                        placeholder="e.g., 2BHK flat in Allwyn Colony, looking for modular kitchen and wardrobes. Require estimation."
                        className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm resize-none transition-all"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-gold-gradient text-black font-semibold uppercase text-xs tracking-wider rounded hover:shadow-gold-glow transition-all duration-300 transform active:scale-95"
                    >
                      Submit Details
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Google Map block */}
            <div className="border border-grey/20 rounded overflow-hidden shadow-md h-[300px]">
              {/* Responsive Google Map frame mapping Kukatpally, Allwyn Colony area */}
              <iframe 
                title="Project Studio Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.1585863261173!2d78.399993314878!3d17.485608388019623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c055555555%3A0x7d0a2333d4ff3701!2sKukatpally%20Allwyn%20Colony%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
      {/* WHATSAPP CONTACT CHOICE MODAL */}
      {showContactSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-black border border-gold/30 rounded-lg p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
            <h3 className="text-xl font-heading text-white font-bold mb-2">Redirect to WhatsApp</h3>
            <p className="text-grey text-xs sm:text-sm font-light mb-6 leading-relaxed">
              Choose which specialist you want to send your space details and inquiry to:
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleSendToWhatsApp("916305093192")}
                className="w-full py-3 bg-[#111] hover:bg-gold/10 text-white border border-grey/25 hover:border-gold rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-gold" />
                <span>Send to +91 63050 93192</span>
              </button>
              
              <button 
                onClick={() => handleSendToWhatsApp("917660994433")}
                className="w-full py-3 bg-[#111] hover:bg-gold/10 text-white border border-grey/25 hover:border-gold rounded font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-gold" />
                <span>Send to +91 76609 94433</span>
              </button>
            </div>

            <button 
              onClick={() => setShowContactSelect(false)}
              className="mt-6 text-xs text-grey hover:text-white underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
