import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Download,
  Printer,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { BookingDevotee, Booking } from '../types';

export const BookingView: React.FC = () => {
  const {
    temples,
    selectedTempleId,
    getTempleById,
    getDarshansForTemple,
    getAllSlotsAvailabilityForDate,
    reserveTickets,
    downloadTicketPass,
    setActiveView,
    currentUser,
  } = useApp();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [templeId, setTempleId] = useState<number>(selectedTempleId || temples[0]?.id || 1);
  const [darshanTypeId, setDarshanTypeId] = useState<number>(1);
  const [reservationDate, setReservationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [slotId, setSlotId] = useState<number>(1);

  // Devotees form state
  const [devotees, setDevotees] = useState<BookingDevotee[]>([
    {
      fullName: currentUser?.fullName || '',
      age: 32,
      gender: 'MALE',
      idProofType: (currentUser?.idProofType as any) || 'AADHAAR',
      idProofNumber: currentUser?.idProofNumber || '',
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Sync selectedTempleId if opened from external buttons
  useEffect(() => {
    if (selectedTempleId) {
      setTempleId(selectedTempleId);
    }
  }, [selectedTempleId]);

  const selectedTemple = getTempleById(templeId) || temples[0];
  const availableDarshans = getDarshansForTemple(templeId);
  const selectedDarshan = availableDarshans.find((d) => d.id === darshanTypeId) || availableDarshans[0];

  // Make sure darshanTypeId is valid for current temple
  useEffect(() => {
    if (availableDarshans.length > 0 && !availableDarshans.some((d) => d.id === darshanTypeId)) {
      setDarshanTypeId(availableDarshans[0].id);
    }
  }, [templeId, availableDarshans, darshanTypeId]);

  // Slots availability for current date & darshan
  const slotsWithAvail = getAllSlotsAvailabilityForDate(templeId, darshanTypeId, reservationDate);
  const selectedSlot = slotsWithAvail.find((s) => s.id === slotId) || slotsWithAvail[0];

  useEffect(() => {
    if (slotsWithAvail.length > 0 && !slotsWithAvail.some((s) => s.id === slotId)) {
      setSlotId(slotsWithAvail[0].id);
    }
  }, [slotsWithAvail, slotId]);

  const unitPrice = selectedDarshan?.basePrice || 0;
  const totalAmount = unitPrice * devotees.length;

  // Add / remove devotee
  const addDevotee = () => {
    const max = selectedDarshan?.maxDevotees || 6;
    if (devotees.length >= max) {
      setErrorMsg(`Maximum ${max} devotees permitted for ${selectedDarshan?.name}`);
      return;
    }
    setErrorMsg('');
    setDevotees([
      ...devotees,
      {
        fullName: '',
        age: 30,
        gender: 'MALE',
        idProofType: 'AADHAAR',
        idProofNumber: '',
      },
    ]);
  };

  const removeDevotee = (index: number) => {
    if (devotees.length <= 1) return;
    setDevotees(devotees.filter((_, idx) => idx !== index));
  };

  const updateDevotee = (index: number, field: keyof BookingDevotee, val: any) => {
    setDevotees(
      devotees.map((dev, idx) => (idx === index ? { ...dev, [field]: val } : dev))
    );
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!templeId || !darshanTypeId) {
        setErrorMsg('Please select a temple and a darshan category.');
        return false;
      }
    }
    if (step === 2) {
      if (!reservationDate) {
        setErrorMsg('Please select a valid pilgrimage date.');
        return false;
      }
      if (!slotId) {
        setErrorMsg('Please select an available time slot.');
        return false;
      }
      const slotAvail = selectedSlot?.available ?? 0;
      if (slotAvail <= 0) {
        setErrorMsg('Selected slot is fully booked. Please pick another slot or date.');
        return false;
      }
    }
    if (step === 3) {
      for (let i = 0; i < devotees.length; i++) {
        const d = devotees[i];
        if (!d.fullName.trim()) {
          setErrorMsg(`Please enter Full Name for Devotee #${i + 1}`);
          return false;
        }
        if (!d.age || d.age < 1 || d.age > 120) {
          setErrorMsg(`Please enter a valid age for Devotee #${i + 1}`);
          return false;
        }
        if (!d.idProofNumber.trim()) {
          setErrorMsg(`Please enter Photo ID Number for Devotee #${i + 1}`);
          return false;
        }
      }
      const slotAvail = selectedSlot?.available ?? 0;
      if (devotees.length > slotAvail) {
        setErrorMsg(`Only ${slotAvail} seats available in this slot. Requested: ${devotees.length}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleConfirmReservation = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const result = await reserveTickets({
        templeId,
        darshanTypeId,
        slotId: selectedSlot.id,
        reservationDate,
        devotees,
        paymentMethod,
      });

      setConfirmedBooking(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Reservation failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D35400] font-cinzel">
          Unified Reservation Desk
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#3B040B] font-cinzel">
          Divine Darshan Reservation
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-sans">
          Select your sacred temple, check real-time slot inventory, and reserve verified demonstration passes with complete ACID transaction guarantees.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-cinzel font-bold">
          <div className={`p-2.5 rounded-lg border-2 transition-all ${
            currentStep === 1
              ? 'bg-[#3B040B] text-[#D4AF37] border-[#D4AF37]'
              : currentStep > 1
              ? 'bg-amber-100 text-stone-800 border-amber-300'
              : 'bg-white text-stone-400 border-stone-200'
          }`}>
            <span className="block sm:inline mr-1">1.</span>
            <span>Temple & Category</span>
          </div>

          <div className={`p-2.5 rounded-lg border-2 transition-all ${
            currentStep === 2
              ? 'bg-[#3B040B] text-[#D4AF37] border-[#D4AF37]'
              : currentStep > 2
              ? 'bg-amber-100 text-stone-800 border-amber-300'
              : 'bg-white text-stone-400 border-stone-200'
          }`}>
            <span className="block sm:inline mr-1">2.</span>
            <span>Date & Slot</span>
          </div>

          <div className={`p-2.5 rounded-lg border-2 transition-all ${
            currentStep === 3
              ? 'bg-[#3B040B] text-[#D4AF37] border-[#D4AF37]'
              : currentStep > 3
              ? 'bg-amber-100 text-stone-800 border-amber-300'
              : 'bg-white text-stone-400 border-stone-200'
          }`}>
            <span className="block sm:inline mr-1">3.</span>
            <span>Devotee Details</span>
          </div>

          <div className={`p-2.5 rounded-lg border-2 transition-all ${
            confirmedBooking
              ? 'bg-emerald-800 text-white border-emerald-400'
              : currentStep === 4
              ? 'bg-[#3B040B] text-[#D4AF37] border-[#D4AF37]'
              : 'bg-white text-stone-400 border-stone-200'
          }`}>
            <span className="block sm:inline mr-1">4.</span>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      {/* Main Wizard Form & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-amber-200/80 shadow-lg p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Temple & Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-[#3B040B]">
                  1. Select Sacred Temple & Darshan Category
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Choose your destination shrine and preferred pilgrimage experience.
                </p>
              </div>

              {/* Temple selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                  Sacred Temple Destination
                </label>
                <select
                  value={templeId}
                  onChange={(e) => setTempleId(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-[#FAF7EE] text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {temples.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.city}, {t.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Temple Preview Banner */}
              {selectedTemple && (
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200">
                  <img
                    src={selectedTemple.imageUrl}
                    alt={selectedTemple.name}
                    className="w-16 h-16 rounded-lg object-cover shadow-sm shrink-0"
                  />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-[#3B040B] text-sm font-cinzel">{selectedTemple.name}</p>
                    <p className="text-[#D35400] font-medium">Presiding Deity: {selectedTemple.deity}</p>
                    <p className="text-stone-500">Daily Hours: {selectedTemple.openingTime} to {selectedTemple.closingTime}</p>
                  </div>
                </div>
              )}

              {/* Darshan Type Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                  Available Darshan Experiences
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {availableDarshans.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setDarshanTypeId(d.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        darshanTypeId === d.id
                          ? 'bg-amber-50/80 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]'
                          : 'bg-white border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-cinzel font-bold text-sm text-[#3B040B]">
                          {d.name}
                        </h4>
                        <span className="text-sm font-extrabold text-[#5C0612] font-cinzel">
                          {d.basePrice === 0 ? 'FREE' : `₹${d.basePrice}`}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {d.description}
                      </p>
                      <div className="text-[10px] text-amber-900 font-semibold pt-1">
                        Max {d.maxDevotees} devotees per booking
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold text-xs sm:text-sm font-cinzel tracking-wider transition-colors flex items-center gap-2"
                >
                  <span>Proceed to Date & Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Available Slots */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-[#3B040B]">
                  2. Select Pilgrimage Date & Available Slot
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Pick a reservation date (today or next 14 days) and select an open time window.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                  Pilgrimage Date
                </label>
                <input
                  type="date"
                  value={reservationDate}
                  min={new Date().toISOString().split('T')[0]}
                  max={
                    new Date(Date.now() + 14 * 86400000)
                      .toISOString()
                      .split('T')[0]
                  }
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full sm:w-72 px-4 py-2.5 rounded-lg border border-amber-300 bg-[#FAF7EE] text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              {/* Time Slots grid with Real-Time Capacity Badges */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                  Available Time Slots on {reservationDate}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {slotsWithAvail.map((slot) => {
                    const isSelected = slot.id === slotId;
                    const percentFilled = Math.min(100, Math.round((slot.reservedCount / slot.totalCapacity) * 100));
                    const isSoldOut = slot.available <= 0;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => !isSoldOut && setSlotId(slot.id)}
                        className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
                          isSoldOut
                            ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-50/80 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37] cursor-pointer'
                            : 'bg-white border-stone-200 hover:border-amber-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-cinzel font-bold text-sm text-[#3B040B] line-clamp-1">
                            {slot.slotName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              isSoldOut
                                ? 'bg-red-100 text-red-800'
                                : slot.available < 20
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isSoldOut ? 'Sold Out' : `${slot.available} Left`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-stone-700 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{slot.startTime} – {slot.endTime}</span>
                        </div>

                        {/* Capacity progress */}
                        <div className="space-y-1 pt-1">
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                isSoldOut
                                  ? 'bg-red-500'
                                  : percentFilled > 75
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percentFilled}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-stone-500">
                            <span>Reserved: {slot.reservedCount}</span>
                            <span>Total Cap: {slot.totalCapacity}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded border border-amber-300 text-stone-700 hover:bg-amber-50 font-bold text-xs font-cinzel transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold text-xs sm:text-sm font-cinzel tracking-wider transition-colors flex items-center gap-2"
                >
                  <span>Proceed to Devotee Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Devotee Registration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-[#3B040B]">
                  3. Devotee Pilgrims Registration
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Register up to {selectedDarshan?.maxDevotees || 6} devotees with valid photo identity proofs for personalized pass tokens.
                </p>
              </div>

              {/* Devotees repeater */}
              <div className="space-y-4">
                {devotees.map((dev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-amber-200 bg-[#FAF7EE] space-y-3 relative"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                      <span className="font-cinzel text-xs font-bold text-[#5C0612] flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#D4AF37]" />
                        <span>Devotee #{idx + 1}</span>
                      </span>
                      {devotees.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDevotee(idx)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove Devotee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Full Name (as on ID proof) *
                        </label>
                        <input
                          type="text"
                          required
                          value={dev.fullName}
                          placeholder="e.g. Rameshwar Sharma"
                          onChange={(e) => updateDevotee(idx, 'fullName', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          max={120}
                          value={dev.age}
                          onChange={(e) => updateDevotee(idx, 'age', Number(e.target.value))}
                          className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Gender *
                        </label>
                        <select
                          value={dev.gender}
                          onChange={(e) => updateDevotee(idx, 'gender', e.target.value as any)}
                          className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          Photo ID Proof *
                        </label>
                        <select
                          value={dev.idProofType}
                          onChange={(e) => updateDevotee(idx, 'idProofType', e.target.value as any)}
                          className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        >
                          <option value="AADHAAR">Aadhaar Card</option>
                          <option value="PASSPORT">Passport</option>
                          <option value="VOTER_ID">Voter ID</option>
                          <option value="PAN">PAN Card</option>
                          <option value="DRIVING_LICENSE">Driving License</option>
                          <option value="EMPLOYEE_ID">Government / Employee ID</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                          ID Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={dev.idProofNumber}
                          placeholder="e.g. 1234-5678-9012"
                          onChange={(e) => updateDevotee(idx, 'idProofNumber', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Devotee Button */}
              {devotees.length < (selectedDarshan?.maxDevotees || 6) && (
                <button
                  type="button"
                  onClick={addDevotee}
                  className="w-full py-2.5 rounded-lg border-2 border-dashed border-[#C5A059] hover:bg-[#FAF7EE] text-[#5C0612] font-bold text-xs font-cinzel transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Another Devotee (Max {selectedDarshan?.maxDevotees || 6})
                </button>
              )}

              {/* Payment selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Demonstration Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'UPI', label: 'Instant UPI', desc: 'GPay / PhonePe / BHIM' },
                    { id: 'NET_BANKING', label: 'Net Banking', desc: 'SBI / HDFC / ICICI' },
                    { id: 'DEBIT_CARD', label: 'Debit / ATM Card', desc: 'All Indian Banks' },
                  ].map((pm) => (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-amber-50 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                          : 'bg-white border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <p className="font-bold text-xs text-[#3B040B]">{pm.label}</p>
                      <p className="text-[10px] text-stone-500">{pm.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded border border-amber-300 text-stone-700 hover:bg-amber-50 font-bold text-xs font-cinzel transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmReservation}
                  className="px-6 py-2.5 rounded bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#F4E8C1] text-[#240206] font-bold text-xs sm:text-sm font-cinzel tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Allocating Slot & Lock...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#240206]" />
                      <span>Confirm & Reserve Passes (₹{totalAmount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Reservation Summary Panel */}
        <aside className="bg-white rounded-2xl border-2 border-[#D4AF37] shadow-xl p-6 space-y-5 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200">
            <h3 className="font-cinzel text-base font-bold text-[#3B040B]">
              Reservation Summary
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7EE] text-[#5C0612] font-mono font-bold border border-amber-300">
              Live ACID Lock
            </span>
          </div>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="flex justify-between">
              <span className="text-stone-400">Temple Shrine:</span>
              <span className="font-bold text-right text-stone-900">{selectedTemple?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-400">Darshan Category:</span>
              <span className="font-semibold text-right text-[#5C0612]">{selectedDarshan?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-400">Pilgrimage Date:</span>
              <span className="font-mono text-stone-800">{reservationDate}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-400">Time Slot Window:</span>
              <span className="font-semibold text-right text-stone-800">
                {selectedSlot?.slotName} ({selectedSlot?.startTime} - {selectedSlot?.endTime})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-400">Registered Devotees:</span>
              <span className="font-bold text-stone-900">{devotees.length} Devotee(s)</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-400">Rate per Devotee:</span>
              <span className="font-mono text-stone-800">₹{unitPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t-2 border-amber-200 flex justify-between items-baseline">
            <span className="font-cinzel text-sm font-bold text-[#3B040B]">Total Seva Amount:</span>
            <span className="text-2xl font-extrabold font-cinzel text-[#5C0612]">
              {totalAmount === 0 ? 'FREE' : `₹${totalAmount.toFixed(2)}`}
            </span>
          </div>

          <div className="p-3 bg-[#FAF7EE] rounded-lg border border-amber-200 text-[11px] text-stone-600 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Real-time slot capacity checks prevent overbooking. Individual devotee tokens generated upon confirmation.
            </span>
          </div>
        </aside>
      </div>

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <p className="text-xs text-[#C5A059] font-bold uppercase tracking-widest font-cinzel">Harivara Prasadam</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-[#3B040B] mt-1">
                Pilgrimage Pass Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-sans">
                Your demonstration temple reservation has been verified and recorded with assigned devotee tokens.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-3 rounded-lg bg-[#FAF7EE] border-2 border-dashed border-[#D4AF37] inline-block font-mono font-bold text-lg text-[#5C0612]">
              {confirmedBooking.bookingReference}
            </div>

            {/* Summary details */}
            <div className="bg-stone-50 rounded-xl p-4 text-left text-xs space-y-2 border border-stone-200 font-sans">
              <div className="flex justify-between">
                <span className="text-stone-500">Shrine:</span>
                <span className="font-bold text-stone-800">{confirmedBooking.templeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Darshan:</span>
                <span className="font-semibold text-[#5C0612]">{confirmedBooking.darshanName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Slot:</span>
                <span className="font-medium text-stone-800">
                  {confirmedBooking.reservationDate} ({confirmedBooking.slotName})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Transaction ID:</span>
                <span className="font-mono text-stone-700">{confirmedBooking.transactionReference}</span>
              </div>

              {/* Devotee tokens list */}
              <div className="pt-2 border-t border-stone-200">
                <p className="text-stone-500 font-semibold mb-1">Allocated Devotee Tokens:</p>
                <div className="flex flex-wrap gap-1.5">
                  {confirmedBooking.devotees.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-amber-100 text-[#3B040B] border border-amber-300 font-mono text-[11px] font-bold"
                    >
                      {d.fullName}: {d.tokenNumber}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => downloadTicketPass(confirmedBooking.bookingReference)}
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs font-cinzel tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Download Pilgrim E-Pass (.txt)
              </button>

              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setActiveView('devotee');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold text-xs font-cinzel tracking-wider transition-colors"
              >
                Go to My Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
