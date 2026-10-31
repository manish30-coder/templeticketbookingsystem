import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, Search, Sparkles, Phone, Mail, ArrowRight, BookOpen, Compass } from 'lucide-react';

export const TemplesView: React.FC = () => {
  const { temples, setActiveView } = useApp();
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const states = ['ALL', ...Array.from(new Set(temples.map((t) => t.state)))];

  const filteredTemples = temples.filter((t) => {
    const matchesState = selectedState === 'ALL' || t.state === selectedState;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.deity.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.state.toLowerCase().includes(q);
    return matchesState && matchesQuery;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D35400] font-cinzel">
          Sacred Geography of India
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#3B040B] font-cinzel">
          Temples of India
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-sans">
          Discover ancient architecture, sanctum rituals, and book verified demonstration pilgrimage passes across India's holiest shrines.
        </p>
        <div className="ornament-line text-[#D4AF37] text-lg font-cinzel pt-2">✦</div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-[#E8DCC9] p-4 sm:p-5 mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by temple name, deity (e.g. Lord Shiva, Balaji), or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-[#FAF7EE]"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-amber-900 underline hover:text-[#5C0612] shrink-0"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* State Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-amber-100">
          <span className="text-xs font-semibold text-stone-500 mr-2">Filter by State:</span>
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${
                selectedState === st
                  ? 'bg-[#3B040B] text-[#F4E8C1] font-bold shadow-sm'
                  : 'bg-amber-50 text-stone-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {st === 'ALL' ? 'All States (8 Temples)' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6 text-xs text-stone-500 font-medium">
        <span>Showing {filteredTemples.length} of {temples.length} Sacred Shrines</span>
        {selectedState !== 'ALL' && (
          <span>Filtered for: <strong className="text-[#3B040B]">{selectedState}</strong></span>
        )}
      </div>

      {/* Grid of Temples */}
      {filteredTemples.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-amber-200 p-8">
          <Compass className="w-12 h-12 text-[#C5A059] mx-auto mb-3" />
          <h3 className="font-cinzel text-lg font-bold text-[#3B040B]">No shrines match your search</h3>
          <p className="text-xs text-stone-500 mt-1">Try clearing filters or search for another deity.</p>
          <button
            onClick={() => {
              setSelectedState('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded bg-[#3B040B] text-amber-50 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemples.map((temple) => (
            <div
              key={temple.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#C5A059]/40 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative h-56 overflow-hidden bg-stone-900">
                <img
                  src={temple.imageUrl}
                  alt={temple.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#240206]/90 via-transparent to-black/30" />
                <div className="absolute top-3.5 right-3.5 bg-[#240206]/85 backdrop-blur-md border border-[#D4AF37]/60 text-[#D4AF37] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {temple.state}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-[#F4E8C1]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{temple.city}, {temple.state}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-cinzel text-lg font-bold text-[#3B040B] group-hover:text-[#5C0612] transition-colors leading-snug">
                    {temple.name}
                  </h3>
                  <p className="text-xs text-[#D35400] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Presiding Deity: {temple.deity}</span>
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-sans">
                    {temple.history}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-amber-100 text-xs text-stone-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Daily Hours:
                    </span>
                    <span className="font-semibold text-stone-800">
                      {temple.openingTime} – {temple.closingTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-stone-500">
                      <Phone className="w-3 h-3 text-[#C5A059]" /> Helpline:
                    </span>
                    <span className="font-medium">{temple.contactPhone}</span>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveView('temple-detail', temple.id)}
                    className="flex-1 py-2 px-3 rounded border border-[#C5A059] text-[#3B040B] hover:bg-[#FAF7EE] font-bold text-xs tracking-wider font-cinzel transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Lore</span>
                  </button>
                  <button
                    onClick={() => setActiveView('booking', temple.id)}
                    className="flex-1 py-2 px-3 rounded bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F4E8C1] text-[#240206] font-bold text-xs tracking-wider font-cinzel transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Reserve Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
