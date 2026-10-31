import React from 'react';
import { useApp } from '../context/AppContext';
import { Sun, Heart, Shield, Lock, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { temples, setActiveView } = useApp();

  return (
    <footer className="bg-[#240206] border-t-2 border-[#C5A059] text-amber-100 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Background Sacred Emblem */}
      <div className="absolute right-0 bottom-0 text-[#3B040B] text-9xl font-cinzel opacity-40 select-none pointer-events-none translate-x-12 translate-y-12">
        ॐ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3B040B]">
          {/* Brand & Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#F4E8C1] flex items-center justify-center text-[#240206] shadow-md">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-cinzel text-[#F4E8C1]">DIVYA YATRA</h3>
                <p className="text-[10px] text-[#C5A059] font-medium uppercase tracking-widest">
                  Unified Pilgrimage Platform
                </p>
              </div>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Empowering sacred pilgrimages across India with transparent demonstration passes, real-time quota verification, and heritage temple lore.
            </p>
            <div className="pt-2 text-xs text-[#C5A059] font-serif italic">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
            </div>
          </div>

          {/* Sacred Shrines Quick Directory */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#C5A059] font-cinzel">
              Sacred Shrines
            </h4>
            <ul className="space-y-2 text-xs">
              {temples.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveView('temple-detail', t.id)}
                    className="text-amber-200/80 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>{t.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => setActiveView('temples')}
                  className="text-[#D4AF37] font-semibold hover:underline mt-1 block"
                >
                  View All 8 Temples →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Portal Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#C5A059] font-cinzel">
              Pilgrim Services
            </h4>
            <ul className="space-y-2 text-xs text-amber-200/80">
              <li>
                <button onClick={() => setActiveView('booking')} className="hover:text-[#D4AF37] transition-colors">
                  Reserve Special Darshan Slot
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('devotee')} className="hover:text-[#D4AF37] transition-colors">
                  Download Pilgrimage E-Pass
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('staff')} className="hover:text-[#D4AF37] transition-colors">
                  Temple Verification & Scanner Desk
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-[#D4AF37] transition-colors">
                  Central Administration Suite
                </button>
              </li>
              <li>
                <span className="text-[#C5A059]">Emergency Shrine Helpline: +91 877 2277777</span>
              </li>
            </ul>
          </div>

          {/* Temple Etiquette & Security Advisory */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#C5A059] font-cinzel">
              Sacred Advisory
            </h4>
            <div className="bg-[#3B040B]/60 border border-[#C5A059]/30 rounded-lg p-3 text-[11px] text-amber-200/80 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Original Government Photo ID (Aadhaar/Passport/Voter ID) mandatory for verification.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Traditional Indian attire (Dhoti/Sari/Kurta) strictly enforced at sanctum counters.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Academic Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 gap-4">
          <p>© 2026 DIVYA YATRA Platform. Temple Ticket Reservation System.</p>
          <div className="flex items-center gap-2">
            <span>Built with devotion & high-reliability database concurrency</span>
            <span className="text-rose-400">♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
