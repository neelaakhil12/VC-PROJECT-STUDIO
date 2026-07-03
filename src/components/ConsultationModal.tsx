import React, { useState } from 'react';
import { X, Calendar, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Modular Solutions',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to local storage to demonstrate persistence
    const existing = localStorage.getItem('consultations');
    const list = existing ? JSON.parse(existing) : [];
    const newRequest = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem('consultations', JSON.stringify([...list, newRequest]));
    
    // Success effects
    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#000000', '#808080']
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Modular Solutions',
        message: ''
      });
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-black border border-gold/30 rounded-lg p-5 sm:p-8 shadow-gold-lg overflow-y-auto overflow-x-hidden no-scrollbar max-h-[90vh]">
        {/* Glow effect */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-grey hover:text-gold transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-heading text-white mb-2">Consultation Booked!</h3>
            <p className="text-grey text-sm max-w-xs">
              Thank you {formData.name}. Our premium design consultant will call you within 24 hours.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-6">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              <h3 className="text-xl sm:text-2xl font-heading text-white">Book Consultation</h3>
            </div>
            <p className="text-grey text-xs sm:text-sm mb-4 sm:mb-6">
              Share your details, and let's craft your premium dream interior together.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gold tracking-wider mb-1">Full Name</label>
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
                  <label className="block text-xs font-semibold uppercase text-gold tracking-wider mb-1">Phone Number</label>
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
                  <label className="block text-xs font-semibold uppercase text-gold tracking-wider mb-1">Email Address</label>
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
                <label className="block text-xs font-semibold uppercase text-gold tracking-wider mb-1">Required Service</label>
                <select 
                  className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm transition-all"
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="Modular Solutions">Modular Kitchen & Carpentry</option>
                  <option value="Turnkey Execution">Turnkey Civil & Execution</option>
                  <option value="Styling Decor">Styling & Decor Consultation</option>
                  <option value="Complete Home Interior">Complete Home Interior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gold tracking-wider mb-1">Message</label>
                <textarea 
                  rows={3}
                  placeholder="Tell us about your home (e.g., 3BHK flat in Kukatpally, budget constraints)"
                  className="w-full bg-[#111] border border-grey/30 focus:border-gold outline-none px-4 py-2.5 rounded text-white text-sm transition-all resize-none"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-gold-gradient text-black font-semibold tracking-wider rounded uppercase text-sm hover:shadow-gold-glow transition-all duration-300 transform active:scale-95"
              >
                Send Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
