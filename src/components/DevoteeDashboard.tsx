import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  AlertTriangle,
  Plus,
  Compass,
  ArrowRight,
  Info,
  QrCode,
  RotateCcw,
  Printer,
} from 'lucide-react';
import { Booking } from '../types';

export const DevoteeDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    cancelBooking,
    downloadTicketPass,
    setActiveView,
    loginAsRole,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<Booking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('Personal schedule conflict');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string>('');

  // If user is not logged in as devotee, offer one-click demo login
  if (!currentUser || currentUser.role !== 'DEVOTEE') {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl border-2 border-[#D4AF37] p-8 shadow-xl space-y-4">
          <Ticket className="w-12 h-12 text-[#C5A059] mx-auto" />
          <h2 className="font-cinzel text-2xl font-bold text-[#3B040B]">
            Devotee Pilgrim Portal
          </h2>
          <p className="text-xs text-stone-600 font-sans">
            Please log in as a registered devotee to manage your pilgrimage passes and view confirmed darshan tokens.
          </p>
          <button
            onClick={() => loginAsRole('DEVOTEE')}
            className="w-full py-2.5 rounded bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#240206] font-cinzel font-bold text-xs tracking-wider"
          >
            Sign In as Registered Devotee (Gayatri Sundaram)
          </button>
        </div>
      </div>
    );
  }

  // Filter user bookings
  const userBookings = bookings.filter((b) => b.userId === currentUser.id);
  const filteredBookings = userBookings.filter((b) =>
    statusFilter === 'ALL' ? true : b.bookingStatus === statusFilter
  );

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    setIsCancelling(true);
    setCancelFeedback('');
    try {
      const res = await cancelBooking(cancellingBookingId, cancellationReason);
      setCancelFeedback(`Booking cancelled successfully. Refund of ₹${res.refundAmount.toFixed(2)} processed to original payment method.`);
      setCancellingBookingId(null);
    } catch (err: any) {
      setCancelFeedback(err.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-amber-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D35400] font-cinzel">
            Pilgrim Member Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3B040B] font-cinzel">
            My Darshan Reservations
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans mt-0.5">
            Welcome, <strong>{currentUser.fullName}</strong> ({currentUser.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('booking')}
            className="px-5 py-2.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs font-cinzel tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Book New Darshan
          </button>
        </div>
      </div>

      {cancelFeedback && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-[#D4AF37] text-[#3B040B] text-xs sm:text-sm font-medium flex items-center justify-between">
          <span>{cancelFeedback}</span>
          <button onClick={() => setCancelFeedback('')} className="text-xs underline font-bold">Dismiss</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {(['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider font-cinzel transition-all ${
              statusFilter === st
                ? 'bg-[#3B040B] text-[#F4E8C1] shadow-md'
                : 'bg-white text-stone-600 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            {st} ({st === 'ALL' ? userBookings.length : userBookings.filter((b) => b.bookingStatus === st).length})
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-amber-200 p-8 space-y-4">
          <Ticket className="w-12 h-12 text-[#C5A059] mx-auto" />
          <h3 className="font-cinzel text-xl font-bold text-[#3B040B]">No {statusFilter.toLowerCase()} reservations found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto font-sans">
            You currently have no pilgrimage bookings in this category. You can reserve sacred darshan slots for any of the 8 major temples of India.
          </p>
          <button
            onClick={() => setActiveView('booking')}
            className="px-6 py-2.5 rounded bg-[#3B040B] text-amber-50 font-bold text-xs font-cinzel tracking-wider hover:bg-[#5C0612] transition-colors"
          >
            Reserve Your Darshan Pass Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border-2 border-amber-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-[#5C0612] bg-[#FAF7EE] px-2.5 py-1 rounded border border-amber-300">
                    {b.bookingReference}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : b.bookingStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                  <span className="text-[11px] text-stone-400">Booked on {b.createdAt}</span>
                </div>

                <h3 className="font-cinzel text-lg font-bold text-[#3B040B]">
                  {b.templeName}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-600 pt-1">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Darshan Category</span>
                    <span className="font-semibold text-stone-800">{b.darshanName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Pilgrimage Date</span>
                    <span className="font-mono font-medium text-stone-800">{b.reservationDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">Slot & Devotees</span>
                    <span className="font-medium text-stone-800">{b.totalDevotees} Pilgrim(s) • {b.slotName}</span>
                  </div>
                </div>

                {/* Tokens pill preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {b.devotees.map((dev, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                    >
                      <span>{dev.fullName}:</span>
                      <strong className="text-[#5C0612]">{dev.tokenNumber}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Total & Actions */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-amber-100 pt-3 md:pt-0 md:pl-6 gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">Total Fee Paid</p>
                  <p className="text-xl font-extrabold font-cinzel text-[#5C0612]">
                    {b.totalAmount === 0 ? 'FREE' : `₹${b.totalAmount.toFixed(2)}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTicketForModal(b)}
                    className="px-3.5 py-1.5 rounded bg-[#FAF7EE] hover:bg-amber-100 border border-[#C5A059] text-[#3B040B] font-bold text-xs font-cinzel transition-colors"
                  >
                    View E-Pass
                  </button>

                  <button
                    onClick={() => downloadTicketPass(b.bookingReference)}
                    className="p-1.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] transition-colors"
                    title="Download E-Pass Text File"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {b.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => setCancellingBookingId(b.id)}
                      className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-medium transition-colors"
                      title="Cancel Booking & Refund"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket E-Pass Modal View */}
      {selectedTicketForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl space-y-6 text-[#2A0808] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-amber-200">
              <span className="text-xs font-bold text-[#D4AF37] tracking-widest font-cinzel">ॐ DIVYA YATRA ॐ</span>
              <h2 className="text-2xl font-bold font-cinzel text-[#3B040B] mt-0.5">
                Official Pilgrim Darshan Pass
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Ref: <strong className="text-[#5C0612] text-sm">{selectedTicketForModal.bookingReference}</strong>
              </p>
            </div>

            {/* Pass details grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#FAF7EE] p-4 rounded-xl border border-amber-200 font-sans">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Shrine Destination</span>
                <span className="font-bold text-sm text-[#3B040B]">{selectedTicketForModal.templeName}</span>
                <p className="text-stone-600">{selectedTicketForModal.templeCity}, {selectedTicketForModal.templeState}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Darshan Category</span>
                <span className="font-bold text-sm text-[#5C0612]">{selectedTicketForModal.darshanName}</span>
                <p className="text-stone-600">Rate: ₹{selectedTicketForModal.totalAmount.toFixed(2)}</p>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Pilgrimage Date</span>
                <span className="font-bold text-stone-900 font-mono text-sm">{selectedTicketForModal.reservationDate}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Assigned Slot Window</span>
                <span className="font-bold text-stone-900">{selectedTicketForModal.slotName}</span>
                <p className="text-stone-600 font-mono">{selectedTicketForModal.startTime} - {selectedTicketForModal.endTime}</p>
              </div>
            </div>

            {/* Devotees Passenger List with Digital Barcode Token */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3B040B] font-cinzel">
                Registered Pilgrims & Verification Tokens ({selectedTicketForModal.devotees.length})
              </h4>

              <div className="border border-amber-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7EE] text-[#3B040B] border-b border-amber-200 font-cinzel">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Age/Sex</th>
                      <th className="p-2.5">ID Proof</th>
                      <th className="p-2.5 text-right">Digital Token</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 font-sans">
                    {selectedTicketForModal.devotees.map((d, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-bold text-stone-900">{d.fullName}</td>
                        <td className="p-2.5 text-stone-600">{d.age} / {d.gender}</td>
                        <td className="p-2.5 text-stone-600">{d.idProofType}: {d.idProofNumber}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#5C0612]">
                          {d.tokenNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Digital Token QR Simulation */}
            <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="font-bold text-[#3B040B] flex items-center gap-1.5 font-cinzel">
                  <QrCode className="w-4 h-4 text-[#D4AF37]" /> Sanctum Automated Barrier Token
                </p>
                <p className="text-stone-500 text-[11px]">
                  Present this digital pass or the individual token numbers at the Temple Verification Desk for biometric / ID cross-check.
                </p>
              </div>
              <div className="w-16 h-16 bg-white border border-stone-300 rounded p-1 flex items-center justify-center font-mono text-[9px] text-center shrink-0">
                [ QR TOKEN ]
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-amber-200">
              <button
                onClick={() => downloadTicketPass(selectedTicketForModal.bookingReference)}
                className="w-full sm:w-auto px-4 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs font-cinzel tracking-wider flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download .txt Pass
              </button>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2 rounded border border-amber-300 hover:bg-amber-50 text-stone-700 font-bold text-xs font-cinzel flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Pass
              </button>

              <button
                onClick={() => setSelectedTicketForModal(null)}
                className="w-full sm:w-auto px-4 py-2 rounded bg-[#3B040B] text-amber-50 font-bold text-xs font-cinzel"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-rose-400 shadow-2xl space-y-4 text-[#2A0808]">
            <div className="flex items-center gap-2 text-rose-700 font-cinzel font-bold text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Cancel Darshan Reservation?</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-sans">
              As per the Divya Yatra refund policy, cancelling this booking will instantly release your reserved devotee quota back into the slot inventory and initiate a 100% demonstration refund.
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Cancellation Reason</label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
              >
                <option value="Personal schedule conflict">Personal schedule conflict</option>
                <option value="Travel arrangement cancelled">Travel arrangement cancelled</option>
                <option value="Medical / Health emergency">Medical / Health emergency</option>
                <option value="Change of temple destination">Change of temple destination</option>
                <option value="Other unforeseen reasons">Other unforeseen reasons</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 rounded border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Keep Reservation
              </button>
              <button
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold font-cinzel tracking-wider disabled:opacity-50"
              >
                {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
