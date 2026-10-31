import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Crown,
  TrendingUp,
  Landmark,
  Sliders,
  Users,
  Code2,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Temple } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    temples,
    timeSlots,
    slotInventories,
    bookings,
    users,
    updateSlotCapacity,
    addTemple,
    updateTemple,
    downloadManifestCsv,
    getAdminMetrics,
    loginAsRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'temples' | 'slots' | 'users' | 'streams'>('overview');

  // Slot adjustment state
  const [selectedTempleId, setSelectedTempleId] = useState<number>(1);
  const [selectedSlotId, setSelectedSlotId] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newCapacityInput, setNewCapacityInput] = useState<number>(250);
  const [slotAdjustFeedback, setSlotAdjustFeedback] = useState<string>('');

  // Temple modal state
  const [isTempleModalOpen, setIsTempleModalOpen] = useState<boolean>(false);
  const [editingTemple, setEditingTemple] = useState<Temple | null>(null);
  const [templeForm, setTempleForm] = useState({
    name: '',
    templeCode: '',
    state: '',
    city: '',
    deity: '',
    openingTime: '04:00',
    closingTime: '22:00',
    contactPhone: '+91 9999999999',
    contactEmail: '',
    imageUrl: '/images/temples/tirumala.jpg',
    history: '',
    architectureStyle: '',
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl border-2 border-[#D4AF37] p-8 shadow-xl space-y-4">
          <Crown className="w-12 h-12 text-[#D4AF37] mx-auto" />
          <h2 className="font-cinzel text-2xl font-bold text-[#3B040B]">
            Central Administration Suite
          </h2>
          <p className="text-xs text-stone-600 font-sans">
            Restricted access for Chief Administrators.
          </p>
          <button
            onClick={() => loginAsRole('ADMIN')}
            className="w-full py-2.5 rounded bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#240206] font-cinzel font-bold text-xs tracking-wider"
          >
            Sign In as Chief Administrator (Srikanth Ramanathan)
          </button>
        </div>
      </div>
    );
  }

  const metrics = getAdminMetrics();

  // Revenue by temple calculation
  const templeRevenueMap: Record<string, { count: number; revenue: number; devotees: number }> = {};
  bookings
    .filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
    .forEach((b) => {
      const name = b.templeName || 'Other';
      if (!templeRevenueMap[name]) {
        templeRevenueMap[name] = { count: 0, revenue: 0, devotees: 0 };
      }
      templeRevenueMap[name].count += 1;
      templeRevenueMap[name].revenue += b.totalAmount;
      templeRevenueMap[name].devotees += b.totalDevotees;
    });

  // Current slot inventory
  const currentInv = slotInventories.find(
    (si) =>
      si.templeId === selectedTempleId &&
      si.slotId === selectedSlotId &&
      si.reservationDate === selectedDate
  );

  const handleUpdateCapacity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSlotCapacity(selectedTempleId, 1, selectedSlotId, selectedDate, newCapacityInput);
    setSlotAdjustFeedback(`Slot capacity updated successfully to ${newCapacityInput} devotees.`);
  };

  const openAddTempleModal = () => {
    setEditingTemple(null);
    setTempleForm({
      name: '',
      templeCode: '',
      state: '',
      city: '',
      deity: '',
      openingTime: '05:00',
      closingTime: '22:00',
      contactPhone: '+91 ',
      contactEmail: '',
      imageUrl: '/images/temples/tirumala.jpg',
      history: '',
      architectureStyle: '',
    });
    setIsTempleModalOpen(true);
  };

  const openEditTempleModal = (t: Temple) => {
    setEditingTemple(t);
    setTempleForm({
      name: t.name,
      templeCode: t.templeCode,
      state: t.state,
      city: t.city,
      deity: t.deity,
      openingTime: t.openingTime,
      closingTime: t.closingTime,
      contactPhone: t.contactPhone,
      contactEmail: t.contactEmail,
      imageUrl: t.imageUrl,
      history: t.history || '',
      architectureStyle: t.architectureStyle || '',
    });
    setIsTempleModalOpen(true);
  };

  const handleSaveTemple = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemple) {
      updateTemple({
        ...editingTemple,
        ...templeForm,
      });
    } else {
      addTemple({
        ...templeForm,
        isActive: true,
      });
    }
    setIsTempleModalOpen(false);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-amber-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#D35400] font-cinzel">
            Central Management System
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3B040B] font-cinzel flex items-center gap-2">
            <Crown className="w-8 h-8 text-[#D4AF37]" />
            <span>Central Administration Suite</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-sans mt-0.5">
            Logged in: <strong>{currentUser.fullName}</strong> ({currentUser.email})
          </p>
        </div>

        <button
          onClick={() => downloadManifestCsv(1, selectedDate)}
          className="px-4 py-2 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-[#240206] font-bold text-xs font-cinzel tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Download className="w-4 h-4" /> Export Today's Audit CSV
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-amber-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> Overview & Revenue
        </button>

        <button
          onClick={() => setActiveTab('temples')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'temples'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <Landmark className="w-4 h-4 text-[#D4AF37]" /> Manage Temples ({temples.length})
        </button>

        <button
          onClick={() => setActiveTab('slots')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'slots'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#D4AF37]" /> Slot & Quota Control
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-[#D4AF37]" /> User & Staff Directory
        </button>

        <button
          onClick={() => setActiveTab('streams')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold font-cinzel tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'streams'
              ? 'text-[#3B040B] border-[#D4AF37] bg-white rounded-t-lg'
              : 'text-stone-500 hover:text-stone-800 border-transparent'
          }`}
        >
          <Code2 className="w-4 h-4 text-[#D4AF37]" /> Java Streams Analytics
        </button>
      </div>

      {/* TAB 1: Overview & Revenue */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-xs text-stone-500 block uppercase font-medium">Total Bookings</span>
              <span className="text-3xl font-extrabold text-[#3B040B] font-cinzel mt-1 block">
                {metrics.totalBookings}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↑ Real-time ACID Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-xs text-stone-500 block uppercase font-medium">Gross Revenue</span>
              <span className="text-3xl font-extrabold text-[#5C0612] font-cinzel mt-1 block">
                ₹{metrics.grossRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">Across all 8 sacred shrines</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-xs text-stone-500 block uppercase font-medium">Devotees Served</span>
              <span className="text-3xl font-extrabold text-[#3B040B] font-cinzel mt-1 block">
                {metrics.totalDevotees}
              </span>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Pilgrim Tokens Issued</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
              <span className="text-xs text-stone-500 block uppercase font-medium">Active Temples</span>
              <span className="text-3xl font-extrabold text-[#3B040B] font-cinzel mt-1 block">
                {metrics.totalTemples}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">Across 7 Indian States</span>
            </div>
          </div>

          {/* Revenue Breakdown by Temple */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-[#3B040B]">
              Revenue & Pilgrim Volume by Shrine
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7EE] text-[#3B040B] border-b border-amber-200 font-cinzel uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Temple Shrine</th>
                    <th className="p-3">Confirmed Bookings</th>
                    <th className="p-3">Pilgrims Admitted</th>
                    <th className="p-3 text-right">Gross Seva Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-sans">
                  {Object.keys(templeRevenueMap).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-stone-500">
                        Initial bookings loading...
                      </td>
                    </tr>
                  ) : (
                    Object.entries(templeRevenueMap).map(([name, data]) => (
                      <tr key={name} className="hover:bg-amber-50/50">
                        <td className="p-3 font-bold text-[#3B040B]">{name}</td>
                        <td className="p-3 font-semibold">{data.count}</td>
                        <td className="p-3">{data.devotees} Devotees</td>
                        <td className="p-3 text-right font-mono font-bold text-[#5C0612]">
                          ₹{data.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Temples */}
      {activeTab === 'temples' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-cinzel text-xl font-bold text-[#3B040B]">
              Master Temple Directory
            </h3>
            <button
              onClick={openAddTempleModal}
              className="px-4 py-2 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-100 font-bold text-xs font-cinzel tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add New Temple
            </button>
          </div>

          <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7EE] text-[#3B040B] border-b border-amber-200 font-cinzel uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Temple Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Presiding Deity</th>
                    <th className="p-3">Timings</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-sans">
                  {temples.map((t) => (
                    <tr key={t.id} className="hover:bg-amber-50/50">
                      <td className="p-3 font-mono font-bold text-stone-600">{t.templeCode}</td>
                      <td className="p-3 font-bold text-[#3B040B] flex items-center gap-2">
                        <img src={t.imageUrl} alt={t.name} className="w-8 h-8 rounded object-cover" />
                        <span>{t.name}</span>
                      </td>
                      <td className="p-3 text-stone-700">{t.city}, {t.state}</td>
                      <td className="p-3 text-[#D35400] font-medium">{t.deity}</td>
                      <td className="p-3 font-mono">{t.openingTime} - {t.closingTime}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {t.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditTempleModal(t)}
                          className="p-1 text-amber-700 hover:text-amber-900"
                          title="Edit Temple"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Slot & Quota Control */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 sm:p-8 shadow-md max-w-2xl mx-auto space-y-4">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-[#3B040B]">
                Real-Time Slot Quota & Capacity Control
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-1">
                Dynamically adjust maximum devotee capacities. Pessimistic concurrency rules ensure reserved counts are never exceeded.
              </p>
            </div>

            {slotAdjustFeedback && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
                {slotAdjustFeedback}
              </div>
            )}

            <form onSubmit={handleUpdateCapacity} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Shrine</label>
                <select
                  value={selectedTempleId}
                  onChange={(e) => setSelectedTempleId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                >
                  {temples.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Reservation Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Time Slot Window</label>
                  <select
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded border border-amber-300 bg-[#FAF7EE] focus:outline-none"
                  >
                    {timeSlots
                      .filter((s) => s.templeId === selectedTempleId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.slotName} ({s.startTime} - {s.endTime})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Current capacity preview */}
              {currentInv && (
                <div className="p-3 rounded bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
                  <span>Current Reserved: <strong>{currentInv.reservedCount}</strong></span>
                  <span>Current Max Capacity: <strong>{currentInv.totalCapacity}</strong></span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">New Total Maximum Capacity</label>
                <input
                  type="number"
                  min={currentInv?.reservedCount || 10}
                  max={5000}
                  value={newCapacityInput}
                  onChange={(e) => setNewCapacityInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded border border-amber-300 bg-white font-mono font-bold focus:outline-none"
                />
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Must be greater than or equal to current booked count ({currentInv?.reservedCount || 0}).
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-[#3B040B] hover:bg-[#5C0612] text-amber-50 font-bold font-cinzel text-xs tracking-wider transition-colors"
              >
                Apply Capacity Update
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: User & Staff Directory */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="font-cinzel text-xl font-bold text-[#3B040B]">
            Registered User & Staff Directory
          </h3>

          <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FAF7EE] text-[#3B040B] border-b border-amber-200 font-cinzel uppercase text-[11px]">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Photo ID Ref</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 font-sans">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-amber-50/50">
                      <td className="p-3 font-mono">{u.id}</td>
                      <td className="p-3 font-bold text-stone-900">{u.fullName}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'STAFF'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-stone-600">{u.email}</td>
                      <td className="p-3 text-stone-600">{u.phone}</td>
                      <td className="p-3 font-mono text-stone-500">
                        {u.idProofType ? `${u.idProofType}: ${u.idProofNumber}` : 'N/A'}
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-emerald-700 font-bold">ACTIVE</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Java Streams Analytics Simulation */}
      {activeTab === 'streams' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 sm:p-8 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-200">
              <Code2 className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-cinzel text-lg font-bold text-[#3B040B]">
                Java Stream API Analytical Engine
              </h3>
            </div>

            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Demonstrates <strong>Unit V Java Stream API</strong> operations: <code>filter()</code> using custom Predicates, <code>map()</code> using Functions, <code>reduce()</code> for revenue summation, and <code>Collectors.groupingBy()</code> for grouping reservations by Darshan category.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Stream Calculation 1 */}
              <div className="p-4 bg-[#FAF7EE] rounded-xl border border-amber-200 space-y-2">
                <h4 className="font-cinzel text-sm font-bold text-[#5C0612]">
                  1. Stream Reduction: Gross Confirmed Revenue
                </h4>
                <div className="bg-stone-900 text-emerald-400 p-3 rounded font-mono text-xs">
                  <code>
                    bookings.stream()<br />
                    &nbsp;&nbsp;.filter(b =&gt; b.status === 'CONFIRMED')<br />
                    &nbsp;&nbsp;.map(b =&gt; b.totalAmount)<br />
                    &nbsp;&nbsp;.reduce(0, (a, b) =&gt; a + b);
                  </code>
                </div>
                <p className="text-xs text-stone-700">
                  Computed Result: <strong className="text-base text-[#3B040B]">₹{metrics.grossRevenue.toLocaleString()}</strong>
                </p>
              </div>

              {/* Stream Calculation 2 */}
              <div className="p-4 bg-[#FAF7EE] rounded-xl border border-amber-200 space-y-2">
                <h4 className="font-cinzel text-sm font-bold text-[#5C0612]">
                  2. Stream GroupingBy: Bookings by Darshan Category
                </h4>
                <div className="bg-stone-900 text-emerald-400 p-3 rounded font-mono text-xs">
                  <code>
                    bookings.stream()<br />
                    &nbsp;&nbsp;.collect(Collectors.groupingBy(<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;b =&gt; b.darshanName,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;Collectors.counting()<br />
                    &nbsp;&nbsp;));
                  </code>
                </div>
                <div className="text-xs space-y-1">
                  {Object.entries(
                    bookings.reduce((acc, b) => {
                      const name = b.darshanName || 'General';
                      acc[name] = (acc[name] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between border-b border-amber-100 py-0.5">
                      <span className="text-stone-600">{cat}:</span>
                      <span className="font-bold text-[#3B040B]">{count} reservation(s)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Temple Modal */}
      {isTempleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border-2 border-[#D4AF37] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-cinzel text-lg font-bold text-[#3B040B]">
              {editingTemple ? 'Edit Sacred Temple' : 'Add New Temple Shrine'}
            </h3>

            <form onSubmit={handleSaveTemple} className="space-y-3 text-xs font-sans">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Temple Name *</label>
                <input
                  type="text"
                  required
                  value={templeForm.name}
                  onChange={(e) => setTempleForm({ ...templeForm, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                  placeholder="e.g. Mahakaleshwar Jyotirlinga"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Temple Code *</label>
                  <input
                    type="text"
                    required
                    value={templeForm.templeCode}
                    onChange={(e) => setTempleForm({ ...templeForm, templeCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none font-mono"
                    placeholder="MAHAKAL_UJJAIN"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Presiding Deity *</label>
                  <input
                    type="text"
                    required
                    value={templeForm.deity}
                    onChange={(e) => setTempleForm({ ...templeForm, deity: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                    placeholder="Lord Shiva"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={templeForm.state}
                    onChange={(e) => setTempleForm({ ...templeForm, state: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                    placeholder="Madhya Pradesh"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={templeForm.city}
                    onChange={(e) => setTempleForm({ ...templeForm, city: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                    placeholder="Ujjain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Opening Time *</label>
                  <input
                    type="time"
                    required
                    value={templeForm.openingTime}
                    onChange={(e) => setTempleForm({ ...templeForm, openingTime: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Closing Time *</label>
                  <input
                    type="time"
                    required
                    value={templeForm.closingTime}
                    onChange={(e) => setTempleForm({ ...templeForm, closingTime: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">History & Lore</label>
                <textarea
                  rows={2}
                  value={templeForm.history}
                  onChange={(e) => setTempleForm({ ...templeForm, history: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-amber-300 focus:outline-none"
                  placeholder="Sacred antiquity and historical background..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setIsTempleModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-stone-300 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#3B040B] text-amber-100 font-bold font-cinzel"
                >
                  Save Temple
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
