import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, Compass, Calendar, Clock, MapPin, Sparkles, Shield, Users, CheckCircle2, ArrowRight, Bell, ChevronRight } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { temples, festivals, setActiveView, getAdminMetrics } = useApp();
  const [selectedTempleQuick, setSelectedTempleQuick] = useState<number>(1);
  const [selectedDateQuick, setSelectedDateQuick] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const metrics = getAdminMetrics();

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('booking', selectedTempleQuick);
  };

  return (
    <div className="min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 sm:px-6 pt-24 pb-16 overflow-hidden">
        {/* Background Image with Parallax-like Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/images/hero_temple.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#240206]/85 via-[#3B040B]/80 to-[#240206]/95" />

        {/* Sacred Glow & Mandala Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--gold-bright)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Sanskrit Sloka Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5C0612]/80 border border-[#D4AF37]/50 text-amber-200 text-xs sm:text-sm font-serif italic shadow-lg animate-pulse">
            <span className="text-[#D4AF37]">ॐ</span>
            <span>"सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"</span>
            <span className="text-[#D4AF37]">ॐ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#F4E8C1] tracking-wider font-cinzel drop-shadow-md">
            DIVYA YATRA
          </h1>

          <p className="text-lg sm:text-2xl font-serif text-[#D4AF37] tracking-wide italic">
            One Gateway. Many Temples. A Divine Journey.
          </p>

          <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl mx-auto leading-relaxed font-sans">
            Experience seamless discovery and unified demonstration ticket reservations across India's most venerated shrines. From the sacred hills of Tirumala to the eternal Ghats of Kashi, plan your spiritual pilgrimage with real-time slot availability.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveView('booking')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F4E8C1] text-[#240206] font-bold text-sm sm:text-base shadow-xl hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Ticket className="w-5 h-5 text-[#240206] group-hover:scale-110 transition-transform" />
              <span>Book Darshan Now</span>
            </button>
            <button
              onClick={() => setActiveView('temples')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md border-2 border-[#D4AF37] hover:bg-[#3B040B] text-[#F4E8C1] font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-[#D4AF37]" />
              <span>Explore Sacred Temples</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Fast Darshan Availability Checker Bar */}
      <section className="relative z-20 -mt-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-xl shadow-2xl p-5 sm:p-6 text-[#2A0808]">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-amber-200">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#3B040B]">
              Quick Shrine Darshan Availability
            </h3>
          </div>

          <form onSubmit={handleQuickBook} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Select Shrine</label>
              <select
                value={selectedTempleQuick}
                onChange={(e) => setSelectedTempleQuick(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FAF7EE]"
              >
                {temples.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Pilgrimage Date</label>
              <input
                type="date"
                value={selectedDateQuick}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDateQuick(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FAF7EE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 mb-1">Devotees</label>
              <select className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FAF7EE]">
                <option value="1">1 Devotee</option>
                <option value="2">2 Devotees</option>
                <option value="4">4 Devotees (Family)</option>
                <option value="6">6 Devotees (Max)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded bg-[#5C0612] hover:bg-[#750A18] text-[#F4E8C1] font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <span>Check Slots & Book</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Sacred Heritage Narrative Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/40 group">
            <img
              src="/images/temples/srirangam.jpg"
              alt="Ancient Indian Temple Heritage"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#240206] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 text-amber-50">
              <span className="px-3 py-1 bg-[#C5A059] text-[#240206] text-xs font-bold rounded uppercase tracking-wider">
                108 Divya Desams
              </span>
              <h4 className="font-cinzel text-xl font-bold mt-2 text-[#F4E8C1]">
                Sri Ranganathaswamy Temple, Srirangam
              </h4>
              <p className="text-xs text-amber-200/80 mt-1">
                Largest functioning Hindu temple complex in the world spanning 156 acres.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-[#3B040B] text-[#D4AF37] border border-[#C5A059]/50 text-xs font-bold rounded-full uppercase tracking-widest">
              Timeless Sanctity
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3B040B] font-cinzel leading-tight">
              Preserving Thousands of Years of Spiritual Heritage
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent" />
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              India's sacred temples stand as architectural marvels and living epicenters of faith, music, philosophy, and devotion. For millennia, devotees have traversed thousands of miles on foot across sacred geography to seek divine grace.
            </p>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
              <strong>DIVYA YATRA</strong> modernizes the devotee pilgrimage journey by unifying darshan scheduling, special seva passes, and crowd capacities into a single transparent academic platform—respecting ancient temple traditions while providing modern technological convenience.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveView('temples')}
                className="px-6 py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-100 font-bold text-xs sm:text-sm tracking-wider font-cinzel transition-colors"
              >
                Browse All Shrines
              </button>
              <button
                onClick={() => setActiveView('booking')}
                className="px-6 py-2.5 rounded border border-[#C5A059] text-[#3B040B] hover:bg-[#FAF7EE] font-bold text-xs sm:text-sm tracking-wider font-cinzel transition-colors"
              >
                Reserve Darshan Pass
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Sacred Shrines Grid */}
      <section className="py-16 bg-[#F3ECE0]/70 border-y border-[#E8DCC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D35400]">
              Divine Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#3B040B] font-cinzel mt-1">
              Major Sacred Shrines of India
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 font-sans">
              Explore revered Jyotirlingas, Shakti Peethas, Divya Desams, and historic gopuram sanctuaries with live darshan timings.
            </p>
            <div className="ornament-line text-[#D4AF37] text-lg font-cinzel mt-4">✦</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {temples.map((temple) => (
              <div
                key={temple.id}
                className="bg-white rounded-xl overflow-hidden border border-[#C5A059]/40 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Temple Image */}
                <div className="relative h-48 overflow-hidden bg-stone-900">
                  <img
                    src={temple.imageUrl}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#240206]/90 via-transparent to-black/20" />
                  <div className="absolute top-3 right-3 bg-[#240206]/80 backdrop-blur-sm border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {temple.state}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <p className="text-[11px] text-[#F4E8C1] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" /> {temple.city}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-[#3B040B] line-clamp-1 group-hover:text-[#5C0612]">
                      {temple.name}
                    </h3>
                    <p className="text-xs text-[#D35400] font-medium mt-0.5 line-clamp-1">
                      Deity: {temple.deity}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-2">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{temple.openingTime} - {temple.closingTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveView('temple-detail', temple.id)}
                      className="text-xs font-semibold text-[#5C0612] hover:text-[#3B040B] underline"
                    >
                      Lore & Details
                    </button>
                    <button
                      onClick={() => setActiveView('booking', temple.id)}
                      className="px-3 py-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setActiveView('temples')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#3B040B] text-amber-100 hover:bg-[#5C0612] font-cinzel font-bold text-xs sm:text-sm tracking-wider transition-colors shadow-md"
            >
              <span>Explore All Shrines & Architecture Lore</span>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Festival Announcements Board (MongoDB Content) */}
      <section id="festivals-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#D35400] uppercase tracking-wider">
              <Bell className="w-4 h-4 text-[#D35400]" />
              <span>Sacred Occasions & Advisories</span>
            </div>
            <h2 className="text-3xl font-bold text-[#3B040B] font-cinzel mt-1">
              Active Festival Schedules
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Official temple trust announcements, special queue protocols, and Brahmotsavam schedules.
            </p>
          </div>
          <button
            onClick={() => setActiveView('booking')}
            className="self-start md:self-auto px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs tracking-wider font-cinzel transition-colors"
          >
            Reserve Festival Pass
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {festivals.map((fest) => (
            <div
              key={fest.id}
              className="bg-white rounded-xl p-5 border-l-4 border-l-[#D4AF37] border-y border-r border-amber-200 shadow-md hover:shadow-xl transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      fest.priority === 'HIGH'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {fest.priority} PRIORITY
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-[#3B040B] mt-1.5">
                    {fest.announcementTitle}
                  </h3>
                </div>
                <div className="text-right text-[11px] text-stone-500 font-medium shrink-0">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{fest.startDate} to {fest.endDate}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                {fest.description}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="italic">Published by: {fest.publishedBy}</span>
                <button
                  onClick={() => setActiveView('booking', fest.templeId)}
                  className="font-bold text-[#5C0612] hover:text-[#3B040B] flex items-center gap-1"
                >
                  <span>Book for this event</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. "How It Works" 4-Step Pilgrimage Guide */}
      <section className="py-16 bg-[#240206] text-amber-50 border-y-2 border-[#C5A059]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Devotee Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-cinzel text-[#F4E8C1] mt-1">
              How to Reserve Your Sacred Darshan
            </h2>
            <div className="ornament-line text-[#D4AF37] text-lg font-cinzel mt-3">✦</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#3B040B]/80 border border-[#C5A059]/40 rounded-xl p-6 text-center space-y-3 relative">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37] text-[#240206] font-cinzel font-bold text-xl flex items-center justify-center shadow-lg">
                1
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#F4E8C1]">Select Shrine</h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Choose from major sacred temples across North and South India, from Tirumala to Kashi Vishwanath.
              </p>
            </div>

            <div className="bg-[#3B040B]/80 border border-[#C5A059]/40 rounded-xl p-6 text-center space-y-3 relative">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37] text-[#240206] font-cinzel font-bold text-xl flex items-center justify-center shadow-lg">
                2
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#F4E8C1]">Check Live Quota</h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Browse real-time seat availability across Sarva, Sheeghra, VIP Suprabhata, and Archana categories.
              </p>
            </div>

            <div className="bg-[#3B040B]/80 border border-[#C5A059]/40 rounded-xl p-6 text-center space-y-3 relative">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37] text-[#240206] font-cinzel font-bold text-xl flex items-center justify-center shadow-lg">
                3
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#F4E8C1]">Register Devotees</h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Enter details for up to 6 family members with verified Government ID proofs for seamless entry.
              </p>
            </div>

            <div className="bg-[#3B040B]/80 border border-[#C5A059]/40 rounded-xl p-6 text-center space-y-3 relative">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37] text-[#240206] font-cinzel font-bold text-xl flex items-center justify-center shadow-lg">
                4
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#F4E8C1]">Instant E-Pass</h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Obtain your confirmed booking pass with individual digital tokens for automated counter verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Live Platform Telemetry & Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#3B040B] via-[#5C0612] to-[#3B040B] rounded-2xl border-2 border-[#D4AF37] p-8 sm:p-10 text-center text-amber-50 shadow-2xl space-y-8">
          <div>
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-cinzel">
              Operational Statistics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-[#F4E8C1] mt-1">
              Live Divya Yatra Network Telemetry
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-[#240206]/60 border border-[#C5A059]/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#D4AF37] font-cinzel">{metrics.totalTemples}</p>
              <p className="text-xs text-amber-200/80 font-medium uppercase tracking-wider mt-1">Active Sacred Shrines</p>
            </div>
            <div className="p-4 rounded-xl bg-[#240206]/60 border border-[#C5A059]/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#D4AF37] font-cinzel">{metrics.totalBookings}</p>
              <p className="text-xs text-amber-200/80 font-medium uppercase tracking-wider mt-1">Reservations Processed</p>
            </div>
            <div className="p-4 rounded-xl bg-[#240206]/60 border border-[#C5A059]/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#D4AF37] font-cinzel">₹{metrics.grossRevenue.toLocaleString()}</p>
              <p className="text-xs text-amber-200/80 font-medium uppercase tracking-wider mt-1">Darshan Seva Revenue</p>
            </div>
            <div className="p-4 rounded-xl bg-[#240206]/60 border border-[#C5A059]/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#D4AF37] font-cinzel">{metrics.totalDevotees}</p>
              <p className="text-xs text-amber-200/80 font-medium uppercase tracking-wider mt-1">Devotees Served</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
