import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Ticket,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Info,
  Compass,
} from 'lucide-react';

export const TempleDetailView: React.FC = () => {
  const { selectedTempleId, getTempleById, getDarshansForTemple, festivals, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'rituals' | 'dress' | 'dos' | 'darshans' | 'festivals'>('overview');

  const temple = getTempleById(selectedTempleId || 1) || getTempleById(1)!;
  const darshans = getDarshansForTemple(temple.id);
  const templeFestivals = festivals.filter((f) => f.templeId === temple.id);

  return (
    <div className="pt-20 min-h-screen">
      {/* Back button bar */}
      <div className="bg-[#FAF7EE] border-b border-[#E8DCC9] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveView('temples')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5C0612] hover:text-[#3B040B]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Temples
          </button>
          <button
            onClick={() => setActiveView('booking', temple.id)}
            className="px-4 py-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs tracking-wider font-cinzel transition-colors flex items-center gap-1.5"
          >
            <Ticket className="w-3.5 h-3.5" /> Book Darshan Pass
          </button>
        </div>
      </div>

      {/* Hero Banner with Temple Imagery */}
      <div
        className="relative h-[380px] sm:h-[460px] bg-cover bg-center flex items-end text-white overflow-hidden"
        style={{ backgroundImage: `url('${temple.imageUrl}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#240206] via-[#240206]/60 to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pb-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-block px-3 py-1 bg-[#D4AF37] text-[#240206] text-xs font-bold rounded-full uppercase tracking-wider">
              {temple.state} • {temple.city}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-cinzel text-[#F4E8C1] drop-shadow-md">
              {temple.name}
            </h1>
            <p className="text-base sm:text-lg text-[#D4AF37] font-serif italic flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Presiding Deity: {temple.deity}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-amber-200/90 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#D4AF37]" /> Hours: {temple.openingTime} – {temple.closingTime}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-[#D4AF37]" /> {temple.contactPhone}
              </span>
              {temple.contactEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-[#D4AF37]" /> {temple.contactEmail}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveView('booking', temple.id)}
            className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F4E8C1] text-[#240206] font-bold text-sm tracking-wider font-cinzel shadow-2xl shrink-0 flex items-center justify-center gap-2"
          >
            <Ticket className="w-4 h-4" /> Reserve Live Darshan Slot
          </button>
        </div>
      </div>

      {/* Sticky Tab Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white border-b-2 border-[#C5A059] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex overflow-x-auto gap-4 sm:gap-8 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 text-xs sm:text-sm font-bold font-cinzel tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'text-[#3B040B] border-[#D4AF37]'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            Overview & Lore
          </button>
          <button
            onClick={() => setActiveTab('rituals')}
            className={`py-3.5 text-xs sm:text-sm font-bold font-cinzel tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'rituals'
                ? 'text-[#3B040B] border-[#D4AF37]'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            Daily Rituals Schedule
          </button>
          <button
            onClick={() => setActiveTab('dress')}
            className={`py-3.5 text-xs sm:text-sm font-bold font-cinzel tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'dress'
                ? 'text-[#3B040B] border-[#D4AF37]'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            Dress Code & Etiquette
          </button>
          <button
            onClick={() => setActiveTab('dos')}
            className={`py-3.5 text-xs sm:text-sm font-bold font-cinzel tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'dos'
                ? 'text-[#3B040B] border-[#D4AF37]'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            Do's & Don'ts
          </button>
          <button
            onClick={() => setActiveTab('darshans')}
            className={`py-3.5 text-xs sm:text-sm font-bold font-cinzel tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'darshans'
                ? 'text-[#3B040B] border-[#D4AF37]'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            Darshan Categories & Rates
          </button>
          <button
            onClick={() => setActiveTab('festivals')}
            className={`py-3.5 text-xs sm:text-sm font-bold font-cinzel tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === 'festivals'
                ? 'text-[#3B040B] border-[#D4AF37]'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            Festivals & Occasions
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Tab 1: Overview & Lore */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 sm:p-8 border border-amber-200 border-t-4 border-t-[#D4AF37] shadow-sm space-y-4">
                <h3 className="text-xl font-bold font-cinzel text-[#3B040B] border-b border-amber-100 pb-3">
                  Sacred Antiquity & History
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                  {temple.history}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-8 border border-amber-200 border-t-4 border-t-[#5C0612] shadow-sm space-y-4">
                <h3 className="text-xl font-bold font-cinzel text-[#3B040B] border-b border-amber-100 pb-3">
                  Architectural Grandeur
                </h3>
                <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                  <strong>Style:</strong> {temple.architectureStyle || 'Classical Indian Stone Temple Architecture.'}
                </p>
                {temple.sanctumDetails && (
                  <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                    <strong>Garbhagriha (Sanctum):</strong> {temple.sanctumDetails}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar quick info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm space-y-4">
                <h4 className="font-cinzel text-base font-bold text-[#3B040B] border-b border-amber-100 pb-2">
                  Pilgrim Quick Facts
                </h4>
                <div className="space-y-3 text-xs text-stone-700">
                  <div>
                    <span className="text-stone-400 block uppercase font-medium">Deity</span>
                    <span className="font-semibold text-stone-900">{temple.deity}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block uppercase font-medium">Location</span>
                    <span className="font-semibold text-stone-900">{temple.city}, {temple.state}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block uppercase font-medium">Daily Timings</span>
                    <span className="font-semibold text-stone-900">{temple.openingTime} to {temple.closingTime}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block uppercase font-medium">Helpline</span>
                    <span className="font-semibold text-stone-900">{temple.contactPhone}</span>
                  </div>
                  {temple.coordinates && (
                    <div>
                      <span className="text-stone-400 block uppercase font-medium">Geo Coordinates</span>
                      <span className="font-mono text-stone-800">
                        {temple.coordinates.latitude}° N, {temple.coordinates.longitude}° E
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-amber-100">
                  <button
                    onClick={() => setActiveView('booking', temple.id)}
                    className="w-full py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold text-xs font-cinzel tracking-wider transition-colors"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rituals Schedule */}
        {activeTab === 'rituals' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#3B040B]">
                Daily Sanctum Rituals & Sevas
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Consecrated timings for aarti, abhishekam, and sacred recitations at {temple.name}.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#FAF7EE] border-b-2 border-amber-200 text-[#3B040B] font-cinzel uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Ritual / Seva Name</th>
                    <th className="py-3 px-4">Timing</th>
                    <th className="py-3 px-4">Spiritual Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {temple.ritualsSchedule && temple.ritualsSchedule.length > 0 ? (
                    temple.ritualsSchedule.map((rit, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/50">
                        <td className="py-3.5 px-4 font-semibold text-[#5C0612]">{rit.ritualName}</td>
                        <td className="py-3.5 px-4 font-mono font-medium text-amber-900">{rit.time}</td>
                        <td className="py-3.5 px-4 text-stone-700">{rit.significance}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-stone-500">
                        Regular daily darshan observed from {temple.openingTime} to {temple.closingTime}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Dress Code & Etiquette */}
        {activeTab === 'dress' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#3B040B]">
                Prescribed Temple Dress Code & Etiquette
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Traditional attire guidelines enforced at entrance gopurams and queue complexes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-[#5C0612] uppercase tracking-wider">
                  Gentlemen (Men)
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                  {temple.dressCode?.men || 'Traditional Dhoti with Angavastram or Kurta-Pyjama. Jeans and western casuals are restricted at sanctum.'}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-[#5C0612] uppercase tracking-wider">
                  Ladies (Women)
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                  {temple.dressCode?.women || 'Sari, Half-Sari, or Chudidar with Dupatta pinned securely. Western garments strictly prohibited.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                <strong>General Rule:</strong> {temple.dressCode?.general || 'Footwear, smart watches, and mobile phones must be deposited at designated cloakrooms before stepping onto the temple parikrama.'}
              </span>
            </div>
          </div>
        )}

        {/* Tab 4: Do's & Don'ts */}
        {activeTab === 'dos' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#3B040B]">
                Sacred Guidelines: Do's & Don'ts
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Respect the sanctity of the temple and co-pilgrims by adhering to shrine protocols.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Do's */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-emerald-200 text-emerald-800 font-bold text-sm uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>DO's (Punya Achara)</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                  {temple.dosAndDonts?.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Carry original Government Photo Identity Proof for entry verification.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Report at verification checkpoint 30 minutes before slot start time.</span>
                  </li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-rose-200 text-rose-800 font-bold text-sm uppercase">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>DON'Ts (Nishiddha Achara)</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
                  {temple.dosAndDonts?.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span>Do not carry electronic devices, cameras, or leather articles into inner sanctum.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✗</span>
                    <span>Do not jump the queue lines or transfer digital passes to other individuals.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Darshan Categories & Rates */}
        {activeTab === 'darshans' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#3B040B]">
                Available Darshan Categories at {temple.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Choose the best darshan experience for your family and reserve slots instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {darshans.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-xl border-2 border-amber-200 p-6 shadow-md hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-cinzel text-lg font-bold text-[#3B040B]">
                        {d.name}
                      </h4>
                      <span className="text-lg font-extrabold text-[#5C0612] font-cinzel">
                        {d.basePrice === 0 ? 'FREE' : `₹${d.basePrice}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {d.description}
                    </p>
                    <div className="bg-[#FAF7EE] p-3 rounded text-[11px] text-amber-900 border border-amber-200/60 mt-3 space-y-1">
                      <p><strong>Rules:</strong> {d.rules}</p>
                      <p><strong>Max Pilgrims / Reservation:</strong> Up to {d.maxDevotees} devotees</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveView('booking', temple.id)}
                    className="w-full py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs tracking-wider font-cinzel transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Book This Darshan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Festivals */}
        {activeTab === 'festivals' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-[#3B040B]">
                Festivals & Occasions at {temple.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Upcoming temple brahmotsavams, utsavams, and special public advisories.
              </p>
            </div>

            {templeFestivals.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">
                No active special festival restrictions. Standard daily darshan queue rules apply.
              </p>
            ) : (
              <div className="space-y-4">
                {templeFestivals.map((fest) => (
                  <div key={fest.id} className="p-5 rounded-lg border border-amber-200 bg-[#FAF7EE] space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-cinzel text-base font-bold text-[#3B040B]">{fest.festivalName}</h4>
                      <span className="text-xs font-semibold text-amber-900 font-mono">
                        {fest.startDate} to {fest.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700">{fest.description}</p>
                    <div className="pt-2 text-[11px] text-[#5C0612] font-semibold">
                      {fest.announcementTitle}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
