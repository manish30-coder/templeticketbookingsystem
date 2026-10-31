import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Search,
  CheckCircle,
  Clock,
  Download,
  Calendar,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Booking, BookingDevotee } from '../types';

export const StaffDashboard: React.FC = () => {
  const {
    currentUser,
    temples,
    bookings,
    lookupTicket,
    checkInBooking,
    downloadManifestCsv,
    getAllSlotsAvailabilityForDate,
    loginAsRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'lookup' | 'manifest' | 'slots'>('lookup');

  // Lookup state
  const [queryInput, setQueryInput] = useState<string>('DY-261031-INIT01');
  const [lookupResult, setLookupResult] = useState<{ booking: Booking; matchedDevotee?: BookingDevotee } | null>(null);
  const [lookupError, setLookupError] = useState<string>('');
  const [successActionMsg, setSuccessActionMsg] = useState<string>('');

  // Manifest state
  const [manifestTempleId, setManifestTempleId] = useState<number>(1);
  const [manifestDate, setManifestDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  if (!currentUser || currentUser.role !== 'STAFF') {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl border-2 border-orange-400 p-8 shadow-xl space-y-4">
          <ShieldCheck className="w-12 h-12 text-orange-600 mx-auto" />
          <h2 className="font-cinzel text-2xl font-bold text-[#3B040B]">
            Temple Staff Verification Desk
          </h2>
          <p className="text-xs text-stone-600 font-sans">
            Restricted access for temple verification officers and counter managers.
          </p>
          <button
            onClick={() => loginAsRole('STAFF')}
            className="w-full py-2.5 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white font-cinzel font-bold text-xs tracking-wider"
          >
            Sign In as Verification Officer (Anand Deshmukh)
          </button>
        </div>
      </div>
    );
  }

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLookupError('');
    setSuccessActionMsg('');
    const res = lookupTicket(queryInput);
    if (!res) {
      setLookupResult(null);
      setLookupError(`No reservation or token found matching "${queryInput}". Please check reference format.`);
    } else {
      setLookupResult(res);
    }
  };

  const handleCheckIn = () => {
    if (!lookupResult) return;
    const ok = checkInBooking(lookupResult.booking.id);
    if (ok) {
      setSuccessActionMsg(`Devotee pilgrims for booking ${lookupResult.booking.bookingReference} have been successfully verified and admitted into the sanctum queue!`);
      // Refresh lookup result
      const refreshed = lookupTicket(lookupResult.booking.bookingReference);
      setLookupResult(refreshed);
    }
  };

  // Manifest calculation
  const manifestTemple = temples.find((t) => t.id === manifestTempleId);
  const manifestBookings = bookings.filter(
    (b) => b.templeId === manifestTempleId && b.reservationDate === manifestDate && b.bookingStatus === 'CONFIRMED'
  );

  const manifestDevoteesCount = manifestBookings.reduce((sum, b) => sum + b.totalDevotees, 0);
  const manifestRevenue = manifestBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  // Slots calculation for staff
  const slotsOverview = getAllSlotsAvailabilityForDate(manifestTempleId, 1, manifestDate);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-amber-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D35400] font-cinzel">
            Sanctum Security & Admission Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3B040B] font-cinzel">
            Temple Verification Officer Desk
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans mt-0.5">
            Officer: <strong>{currentUser.fullName}</strong> • ID: <strong>{currentUser.idProofNumber}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Queue Scanner Online
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 mb-8 border-b border-amber-200">
        <button
          onClick={() => setActiveTab('lookup')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lookup'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <Search className="w-4 h-4 text-[#D4AF37]" /> Ticket Lookup & Verify
        </button>

        <button
          onClick={() => setActiveTab('manifest')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'manifest'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" /> Daily Cursor Manifest
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'slots'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <Clock className="w-4 h-4 text-[#D4AF37]" /> Slot Headcount Monitor
        </button>
      </div>

      {/* TAB 1: Lookup & Verification */}
      {activeTab === 'lookup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 sm:p-8 shadow-md max-w-3xl mx-auto space-y-4">
            <div>
              <h2 className="text-xl font-bold font-cinzel text-[#3B040B]">
                Scan or Enter Booking Reference / Devotee Token
              </h2>
              <p className="text-xs text-stone-500 mt-1 font-sans">
                Supports searching by Booking Reference (e.g. <code>DY-261031-INIT01</code>) or individual pilgrim token (e.g. <code>TTD-SD-TK001</code>).
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Enter Reference (DY-...) or Token (TTD-...)"
                className="flex-1 px-4 py-2.5 rounded-lg border border-amber-300 bg-[#FAF7EE] text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold text-xs sm:text-sm font-cinzel tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" /> Lookup Pass
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-stone-500">
              <span className="font-semibold">Quick Test Queries:</span>
              <button
                type="button"
                onClick={() => {
                  setQueryInput('DY-261031-INIT01');
                  lookupTicket('DY-261031-INIT01');
                }}
                className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 font-mono text-amber-900"
              >
                DY-261031-INIT01
              </button>
              <button
                type="button"
                onClick={() => {
                  setQueryInput('TTD-SD-TK001');
                  lookupTicket('TTD-SD-TK001');
                }}
                className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 font-mono text-amber-900"
              >
                TTD-SD-TK001
              </button>
            </div>
          </div>

          {lookupError && (
            <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{lookupError}</span>
            </div>
          )}

          {successActionMsg && (
            <div className="max-w-3xl mx-auto p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{successActionMsg}</span>
            </div>
          )}

          {/* Verification Result Card */}
          {lookupResult && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-[#D4AF37] shadow-xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b-2 border-amber-200 gap-2">
                <div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      lookupResult.booking.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : lookupResult.booking.bookingStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    STATUS: {lookupResult.booking.bookingStatus}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-mono text-[#5C0612] mt-1">
                    {lookupResult.booking.bookingReference}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Transaction</p>
                  <p className="text-xs font-mono text-stone-700">{lookupResult.booking.transactionReference}</p>
                </div>
              </div>

              {/* Matched Token Alert if query was a token */}
              {lookupResult.matchedDevotee && (
                <div className="p-3 rounded-lg bg-amber-50 border border-[#D4AF37] text-xs text-[#3B040B] flex items-center justify-between">
                  <span>Matched Pilgrim Token: <strong>{lookupResult.matchedDevotee.tokenNumber}</strong> ({lookupResult.matchedDevotee.fullName})</span>
                  <span className="font-mono text-emerald-700 font-bold">MATCH VERIFIED ✓</span>
                </div>
              )}

              {/* Booking Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#FAF7EE] p-4 rounded-xl border border-amber-200 font-sans">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-medium">Shrine</span>
                  <span className="font-bold text-stone-900">{lookupResult.booking.templeName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-medium">Category</span>
                  <span className="font-semibold text-[#5C0612]">{lookupResult.booking.darshanName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-medium">Date</span>
                  <span className="font-mono text-stone-800">{lookupResult.booking.reservationDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-medium">Slot Time</span>
                  <span className="font-semibold text-stone-800">{lookupResult.booking.slotName}</span>
                </div>
              </div>

              {/* Devotee Passenger Roster */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B040B] font-cinzel">
                  Devotee Verification Roster ({lookupResult.booking.devotees.length} Pilgrims)
                </h4>

                <div className="border border-amber-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAF7EE] text-[#3B040B] border-b border-amber-200 font-cinzel">
                      <tr>
                        <th className="p-2.5">Pilgrim Name</th>
                        <th className="p-2.5">Age / Sex</th>
                        <th className="p-2.5">Declared Photo ID</th>
                        <th className="p-2.5 text-right">Individual Token</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 font-sans">
                      {lookupResult.booking.devotees.map((d, i) => (
                        <tr
                          key={i}
                          className={
                            lookupResult.matchedDevotee?.tokenNumber === d.tokenNumber
                              ? 'bg-amber-100/70 font-semibold'
                              : ''
                          }
                        >
                          <td className="p-2.5 font-bold text-stone-900">{d.fullName}</td>
                          <td className="p-2.5 text-stone-600">{d.age} yrs • {d.gender}</td>
                          <td className="p-2.5 text-stone-700">
                            <span className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-[10px] font-mono mr-1">
                              {d.idProofType}
                            </span>
                            {d.idProofNumber}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-[#5C0612]">
                            {d.tokenNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Verification & Admission Action Bar */}
              <div className="pt-4 border-t-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-stone-500">
                  Total Fee Paid: <strong>₹{lookupResult.booking.totalAmount.toFixed(2)}</strong> via {lookupResult.booking.paymentMethod}
                </span>

                {lookupResult.booking.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={handleCheckIn}
                    className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs font-cinzel tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <UserCheck className="w-4 h-4" /> Verify ID & Admit Devotees
                  </button>
                )}

                {lookupResult.booking.bookingStatus === 'COMPLETED' && (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Already Checked In & Admitted
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Daily Cursor Manifest */}
      {activeTab === 'manifest' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    Select Temple Shrine
                  </label>
                  <select
                    value={manifestTempleId}
                    onChange={(e) => setManifestTempleId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                  >
                    {temples.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    Manifest Date
                  </label>
                  <input
                    type="date"
                    value={manifestDate}
                    onChange={(e) => setManifestDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => downloadManifestCsv(manifestTempleId, manifestDate)}
                className="px-4 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs font-cinzel tracking-wider flex items-center gap-2 shrink-0 shadow-sm"
              >
                <Download className="w-4 h-4" /> Export CSV Manifest
              </button>
            </div>

            {/* Manifest Summary Cards */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-amber-200 text-center">
              <div className="p-3 bg-[#FAF7EE] rounded-lg">
                <span className="text-xs text-stone-500 block">Total Bookings</span>
                <span className="text-xl font-bold font-cinzel text-[#3B040B]">{manifestBookings.length}</span>
              </div>
              <div className="p-3 bg-[#FAF7EE] rounded-lg">
                <span className="text-xs text-stone-500 block">Devotee Headcount</span>
                <span className="text-xl font-bold font-cinzel text-[#3B040B]">{manifestDevoteesCount}</span>
              </div>
              <div className="p-3 bg-[#FAF7EE] rounded-lg">
                <span className="text-xs text-stone-500 block">Collections</span>
                <span className="text-xl font-bold font-cinzel text-[#5C0612]">₹{manifestRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Manifest Table */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-[#FAF7EE] border-b border-amber-200 font-cinzel font-bold text-sm text-[#3B040B] flex justify-between items-center">
              <span>Devotee Admission Cursor Roster for {manifestDate}</span>
              <span className="text-xs font-normal text-stone-500">Filtered by CONFIRMED passes</span>
            </div>

            {manifestBookings.length === 0 ? (
              <div className="py-16 text-center text-stone-500 text-xs">
                No confirmed reservations scheduled for this temple on {manifestDate}.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7EE] text-[#3B040B] border-b border-amber-200 font-cinzel text-[11px] uppercase">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Slot Time Window</th>
                      <th className="p-3">Darshan Category</th>
                      <th className="p-3">Devotees</th>
                      <th className="p-3">Tokens Allocated</th>
                      <th className="p-3 text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-sans">
                    {manifestBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-amber-50/50">
                        <td className="p-3 font-mono font-bold text-[#5C0612]">{b.bookingReference}</td>
                        <td className="p-3 font-medium text-stone-800">{b.slotName} ({b.startTime} - {b.endTime})</td>
                        <td className="p-3 text-stone-700">{b.darshanName}</td>
                        <td className="p-3 font-semibold">{b.totalDevotees}</td>
                        <td className="p-3 font-mono text-[11px] text-stone-600">
                          {b.devotees.map((d) => d.tokenNumber).join(', ')}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-stone-900">₹{b.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Slot Headcount Monitor */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    Temple Shrine
                  </label>
                  <select
                    value={manifestTempleId}
                    onChange={(e) => setManifestTempleId(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                  >
                    {temples.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    value={manifestDate}
                    onChange={(e) => setManifestDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {slotsOverview.map((slot) => {
              const percentFilled = Math.min(100, Math.round((slot.reservedCount / slot.totalCapacity) * 100));
              return (
                <div key={slot.id} className="bg-white rounded-xl border border-amber-200 p-5 space-y-3 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="font-cinzel font-bold text-sm text-[#3B040B]">{slot.slotName}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-[#3B040B] font-bold">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Booked: <strong>{slot.reservedCount}</strong></span>
                      <span>Total: <strong>{slot.totalCapacity}</strong></span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5C0612] h-full"
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-700 font-semibold text-right">
                    {slot.available} Seats Open
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
