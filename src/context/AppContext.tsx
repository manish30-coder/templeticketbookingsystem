import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Temple,
  DarshanType,
  TempleDarshanConfig,
  TimeSlot,
  SlotInventory,
  Booking,
  BookingDevotee,
  Cancellation,
  FestivalEvent,
  Role,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TEMPLES,
  INITIAL_DARSHAN_TYPES,
  INITIAL_TEMPLE_DARSHAN_CONFIGS,
  INITIAL_TIME_SLOTS,
  INITIAL_FESTIVALS,
  INITIAL_BOOKINGS,
} from '../data/mockData';

interface ReservationRequest {
  templeId: number;
  darshanTypeId: number;
  slotId: number;
  reservationDate: string; // YYYY-MM-DD
  devotees: BookingDevotee[];
  paymentMethod: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  temples: Temple[];
  darshanTypes: DarshanType[];
  darshanConfigs: TempleDarshanConfig[];
  timeSlots: TimeSlot[];
  slotInventories: SlotInventory[];
  bookings: Booking[];
  cancellations: Cancellation[];
  festivals: FestivalEvent[];
  activeView: string;
  selectedTempleId: number | null;
  setActiveView: (view: string, templeId?: number) => void;
  login: (email: string, role?: Role) => boolean;
  loginWithPassword: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsRole: (role: Role) => void;
  logout: () => void;
  registerUser: (data: { fullName: string; email: string; phone: string; idProofType: string; idProofNumber: string }) => Promise<User>;
  getTempleById: (id: number) => Temple | undefined;
  getDarshansForTemple: (templeId: number) => (DarshanType & { basePrice: number; maxDevotees: number; rules: string })[];
  getSlotsForTemple: (templeId: number) => TimeSlot[];
  getSlotAvailability: (templeId: number, darshanTypeId: number, slotId: number, dateStr: string) => { totalCapacity: number; reservedCount: number; available: number };
  getAllSlotsAvailabilityForDate: (templeId: number, darshanTypeId: number, dateStr: string) => Array<TimeSlot & { totalCapacity: number; reservedCount: number; available: number }>;
  reserveTickets: (req: ReservationRequest) => Promise<Booking>;
  cancelBooking: (bookingId: number, reason: string) => Promise<{ success: boolean; refundAmount: number }>;
  lookupTicket: (query: string) => { booking: Booking; matchedDevotee?: BookingDevotee } | null;
  checkInBooking: (bookingId: number) => boolean;
  updateSlotCapacity: (templeId: number, darshanTypeId: number, slotId: number, dateStr: string, newCapacity: number) => void;
  addTemple: (templeData: Omit<Temple, 'id'>) => Temple;
  updateTemple: (temple: Temple) => void;
  generateTicketPassText: (bookingReference: string) => string;
  downloadTicketPass: (bookingReference: string) => void;
  downloadManifestCsv: (templeId: number, dateStr: string) => void;
  getAdminMetrics: () => { totalBookings: number; grossRevenue: number; totalDevotees: number; totalTemples: number; activeSlotsCount: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('divya_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('divya_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [temples, setTemples] = useState<Temple[]>(() => {
    const saved = localStorage.getItem('divya_temples');
    return saved ? JSON.parse(saved) : INITIAL_TEMPLES;
  });

  const [darshanTypes] = useState<DarshanType[]>(INITIAL_DARSHAN_TYPES);
  const [darshanConfigs] = useState<TempleDarshanConfig[]>(INITIAL_TEMPLE_DARSHAN_CONFIGS);
  const [timeSlots] = useState<TimeSlot[]>(INITIAL_TIME_SLOTS);
  const [festivals] = useState<FestivalEvent[]>(INITIAL_FESTIVALS);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('divya_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [cancellations, setCancellations] = useState<Cancellation[]>(() => {
    const saved = localStorage.getItem('divya_cancellations');
    return saved ? JSON.parse(saved) : [];
  });

  // Slot inventory seeded for current dates
  const [slotInventories, setSlotInventories] = useState<SlotInventory[]>(() => {
    const saved = localStorage.getItem('divya_slot_inventories');
    if (saved) return JSON.parse(saved);

    // Generate initial inventories for next 14 days
    const inventories: SlotInventory[] = [];
    let invId = 1;
    const baseDate = new Date();

    INITIAL_TEMPLES.forEach((temple) => {
      const templeSlots = INITIAL_TIME_SLOTS.filter((ts) => ts.templeId === temple.id);
      const configs = INITIAL_TEMPLE_DARSHAN_CONFIGS.filter((tc) => tc.templeId === temple.id);

      for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + dayOffset);
        const dateStr = d.toISOString().split('T')[0];

        configs.forEach((cfg) => {
          templeSlots.forEach((slot) => {
            let totalCap = 200;
            if (cfg.darshanTypeId === 2) totalCap = 80;
            else if (cfg.darshanTypeId === 3) totalCap = 30;
            else if (cfg.darshanTypeId === 4) totalCap = 50;

            const initialReserved = dayOffset === 0 ? Math.floor(Math.random() * 25) + 10 : dayOffset === 1 ? Math.floor(Math.random() * 15) : 0;

            inventories.push({
              id: invId++,
              templeId: temple.id,
              darshanTypeId: cfg.darshanTypeId,
              slotId: slot.id,
              reservationDate: dateStr,
              totalCapacity: totalCap,
              reservedCount: initialReserved,
              version: 1,
            });
          });
        });
      }
    });

    return inventories;
  });

  const [activeView, setActiveViewInternal] = useState<string>('home');
  const [selectedTempleId, setSelectedTempleId] = useState<number | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('divya_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('divya_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('divya_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('divya_cancellations', JSON.stringify(cancellations));
  }, [cancellations]);

  useEffect(() => {
    localStorage.setItem('divya_slot_inventories', JSON.stringify(slotInventories));
  }, [slotInventories]);

  useEffect(() => {
    localStorage.setItem('divya_temples', JSON.stringify(temples));
  }, [temples]);

  useEffect(() => {
    localStorage.setItem('divya_users', JSON.stringify(users));
  }, [users]);

  const setActiveView = (view: string, templeId?: number) => {
    if (templeId !== undefined) {
      setSelectedTempleId(templeId);
    }
    setActiveViewInternal(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.isActive) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const loginWithPassword = async (email: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'Invalid credentials. Please check your email or select a demo role.' };
    }
    if (!user.isActive) {
      return { success: false, message: 'User account is deactivated. Contact administrator.' };
    }
    setCurrentUser(user);
    return { success: true };
  };

  const loginAsRole = (role: Role) => {
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      if (role === 'ADMIN') setActiveView('admin');
      else if (role === 'STAFF') setActiveView('staff');
      else setActiveView('devotee');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('home');
  };

  const registerUser = async (data: {
    fullName: string;
    email: string;
    phone: string;
    idProofType: string;
    idProofNumber: string;
  }): Promise<User> => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: User = {
      id: Date.now(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'DEVOTEE',
      idProofType: data.idProofType,
      idProofNumber: data.idProofNumber.trim(),
      isActive: true,
      dashboardRoute: '/devotee',
    };
    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);
    return newUser;
  };

  const getTempleById = (id: number) => {
    return temples.find((t) => t.id === id);
  };

  const getDarshansForTemple = (templeId: number) => {
    const configs = darshanConfigs.filter((c) => c.templeId === templeId && c.isActive);
    return configs.map((cfg) => {
      const type = darshanTypes.find((dt) => dt.id === cfg.darshanTypeId)!;
      return {
        ...type,
        basePrice: cfg.basePrice,
        maxDevotees: cfg.maxDevoteesPerBooking,
        rules: cfg.rules,
      };
    });
  };

  const getSlotsForTemple = (templeId: number) => {
    return timeSlots.filter((ts) => ts.templeId === templeId && ts.isActive);
  };

  const getSlotAvailability = (templeId: number, darshanTypeId: number, slotId: number, dateStr: string) => {
    let inv = slotInventories.find(
      (si) =>
        si.templeId === templeId &&
        si.darshanTypeId === darshanTypeId &&
        si.slotId === slotId &&
        si.reservationDate === dateStr
    );

    if (!inv) {
      // Auto-create default inventory if none exists
      let defaultCap = 150;
      if (darshanTypeId === 2) defaultCap = 75;
      if (darshanTypeId === 3) defaultCap = 30;
      if (darshanTypeId === 4) defaultCap = 50;

      inv = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        templeId,
        darshanTypeId,
        slotId,
        reservationDate: dateStr,
        totalCapacity: defaultCap,
        reservedCount: 0,
        version: 1,
      };
      setSlotInventories((prev) => [...prev, inv!]);
    }

    const available = Math.max(0, inv.totalCapacity - inv.reservedCount);
    return {
      totalCapacity: inv.totalCapacity,
      reservedCount: inv.reservedCount,
      available,
    };
  };

  const getAllSlotsAvailabilityForDate = (templeId: number, darshanTypeId: number, dateStr: string) => {
    const slots = getSlotsForTemple(templeId);
    return slots.map((slot) => {
      const avail = getSlotAvailability(templeId, darshanTypeId, slot.id, dateStr);
      return {
        ...slot,
        ...avail,
      };
    });
  };

  const reserveTickets = async (req: ReservationRequest): Promise<Booking> => {
    const { templeId, darshanTypeId, slotId, reservationDate, devotees, paymentMethod } = req;
    const temple = getTempleById(templeId);
    if (!temple) throw new Error('Selected temple not found');

    const darshan = darshanTypes.find((d) => d.id === darshanTypeId);
    const cfg = darshanConfigs.find((c) => c.templeId === templeId && c.darshanTypeId === darshanTypeId);
    const slot = timeSlots.find((s) => s.id === slotId);

    if (!darshan || !cfg || !slot) throw new Error('Invalid darshan category or slot configuration');

    const devoteeCount = devotees.length;
    if (devoteeCount < 1 || devoteeCount > cfg.maxDevoteesPerBooking) {
      throw new Error(`Permitted devotees for this booking: 1 to ${cfg.maxDevoteesPerBooking}`);
    }

    // Capacity verification
    const currentAvail = getSlotAvailability(templeId, darshanTypeId, slotId, reservationDate);
    if (currentAvail.available < devoteeCount) {
      throw new Error(`Slot capacity exceeded! Only ${currentAvail.available} seats remaining, requested ${devoteeCount}.`);
    }

    // Generate unique booking reference: DY-YYMMDD-XXXXXX
    const dateCompact = reservationDate.replace(/-/g, '').slice(2);
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingReference = `DY-${dateCompact}-${randomHex}`;
    const transactionReference = `TXN-${Math.random().toString(36).substring(2, 14).toUpperCase()}`;

    // Token code prefix based on temple and darshan
    const templePrefix = temple.templeCode.slice(0, 3);
    const darshanPrefix = darshan.code.slice(0, 2);

    const tokenDevotees: BookingDevotee[] = devotees.map((dev, idx) => ({
      ...dev,
      tokenNumber: `${templePrefix}-${darshanPrefix}-TK${String(Math.floor(Math.random() * 900) + 100)}${idx + 1}`,
    }));

    const totalAmount = cfg.basePrice * devoteeCount;

    // Deduct / update slot inventory atomically
    setSlotInventories((prev) =>
      prev.map((inv) => {
        if (
          inv.templeId === templeId &&
          inv.darshanTypeId === darshanTypeId &&
          inv.slotId === slotId &&
          inv.reservationDate === reservationDate
        ) {
          return {
            ...inv,
            reservedCount: inv.reservedCount + devoteeCount,
            version: inv.version + 1,
          };
        }
        return inv;
      })
    );

    const newBooking: Booking = {
      id: Date.now(),
      bookingReference,
      userId: currentUser?.id || 3, // fallback to devotee
      templeId,
      darshanTypeId,
      slotId,
      reservationDate,
      totalDevotees: devoteeCount,
      totalAmount,
      bookingStatus: 'CONFIRMED',
      paymentMethod,
      transactionReference,
      paymentStatus: 'SUCCESS',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      templeName: temple.name,
      templeCity: temple.city,
      templeState: temple.state,
      darshanName: darshan.name,
      slotName: slot.slotName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      devotees: tokenDevotees,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = async (bookingId: number, reason: string): Promise<{ success: boolean; refundAmount: number }> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.bookingStatus !== 'CONFIRMED') {
      throw new Error(`Booking cannot be cancelled. Current status: ${booking.bookingStatus}`);
    }

    const refundAmount = booking.totalAmount;

    // Restore slot inventory capacity
    setSlotInventories((prev) =>
      prev.map((inv) => {
        if (
          inv.templeId === booking.templeId &&
          inv.darshanTypeId === booking.darshanTypeId &&
          inv.slotId === booking.slotId &&
          inv.reservationDate === booking.reservationDate
        ) {
          return {
            ...inv,
            reservedCount: Math.max(0, inv.reservedCount - booking.totalDevotees),
            version: inv.version + 1,
          };
        }
        return inv;
      })
    );

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              bookingStatus: 'CANCELLED',
              paymentStatus: 'REFUNDED',
            }
          : b
      )
    );

    // Audit cancellation
    const newCancellation: Cancellation = {
      id: Date.now(),
      bookingId,
      cancelledBy: currentUser?.id || 1,
      reason,
      refundAmount,
      cancelledAt: new Date().toISOString(),
    };
    setCancellations((prev) => [newCancellation, ...prev]);

    return { success: true, refundAmount };
  };

  const lookupTicket = (query: string): { booking: Booking; matchedDevotee?: BookingDevotee } | null => {
    const q = query.trim().toUpperCase();
    if (!q) return null;

    // Search by booking reference
    const byRef = bookings.find((b) => b.bookingReference.toUpperCase() === q);
    if (byRef) return { booking: byRef };

    // Search by individual devotee token number
    for (const b of bookings) {
      const dev = b.devotees.find((d) => d.tokenNumber && d.tokenNumber.toUpperCase() === q);
      if (dev) {
        return { booking: b, matchedDevotee: dev };
      }
    }

    return null;
  };

  const checkInBooking = (bookingId: number): boolean => {
    const exists = bookings.some((b) => b.id === bookingId);
    if (!exists) return false;
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'COMPLETED' } : b))
    );
    return true;
  };

  const updateSlotCapacity = (
    templeId: number,
    darshanTypeId: number,
    slotId: number,
    dateStr: string,
    newCapacity: number
  ) => {
    setSlotInventories((prev) =>
      prev.map((inv) => {
        if (
          inv.templeId === templeId &&
          inv.darshanTypeId === darshanTypeId &&
          inv.slotId === slotId &&
          inv.reservationDate === dateStr
        ) {
          return {
            ...inv,
            totalCapacity: Math.max(inv.reservedCount, newCapacity),
            version: inv.version + 1,
          };
        }
        return inv;
      })
    );
  };

  const addTemple = (templeData: Omit<Temple, 'id'>): Temple => {
    const newId = Math.max(...temples.map((t) => t.id), 0) + 1;
    const newTemple: Temple = {
      ...templeData,
      id: newId,
    };
    setTemples((prev) => [...prev, newTemple]);
    return newTemple;
  };

  const updateTemple = (updated: Temple) => {
    setTemples((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const generateTicketPassText = (bookingReference: string): string => {
    const booking = bookings.find((b) => b.bookingReference === bookingReference);
    if (!booking) return 'Booking not found';

    const lines = [
      '====================================================================',
      '                     DIVYA YATRA PILGRIMAGE PASS                    ',
      '            Unified Temple Ticket Reservation Platform              ',
      '====================================================================',
      '',
      `BOOKING REFERENCE  : ${booking.bookingReference}`,
      `STATUS             : ${booking.bookingStatus}`,
      `TEMPLE             : ${booking.templeName} (${booking.templeCity}, ${booking.templeState})`,
      `DARSHAN CATEGORY   : ${booking.darshanName}`,
      `RESERVATION DATE   : ${booking.reservationDate}`,
      `TIME SLOT          : ${booking.slotName} [${booking.startTime} - ${booking.endTime}]`,
      `TOTAL DEVOTEES     : ${booking.totalDevotees}`,
      `TOTAL FEE PAID     : ₹${booking.totalAmount.toFixed(2)}`,
      `TRANSACTION ID     : ${booking.transactionReference} (${booking.paymentMethod})`,
      `BOOKED AT          : ${booking.createdAt}`,
      '',
      '--------------------------------------------------------------------',
      '                      DEVOTEE PASSENGERS DETAILS                    ',
      '--------------------------------------------------------------------',
      'SL NO  | DEVOTEE NAME             | AGE | GENDER | ID PROOF            | TOKEN NO    ',
      '--------------------------------------------------------------------',
    ];

    booking.devotees.forEach((d, idx) => {
      const name = d.fullName.padEnd(24).substring(0, 24);
      const age = String(d.age).padEnd(3);
      const gender = d.gender.padEnd(6);
      const idProof = `${d.idProofType}: ${d.idProofNumber}`.padEnd(19).substring(0, 19);
      const token = (d.tokenNumber || 'N/A').padEnd(11);
      lines.push(`${String(idx + 1).padEnd(6)} | ${name} | ${age} | ${gender} | ${idProof} | ${token}`);
    });

    lines.push('====================================================================');
    lines.push('IMPORTANT ADVISORY:');
    lines.push('1. Devotees must carry the original photo identity proof declared above.');
    lines.push('2. Report at the verification checkpoint 30 minutes before the scheduled slot.');
    lines.push('3. Traditional temple dress code is strictly enforced.');
    lines.push('4. Scan individual tokens at the automated queue barrier.');
    lines.push('5. Divine prasadam coupons are redeemable after sanctum darshan.');
    lines.push('====================================================================');

    return lines.join('\n');
  };

  const downloadTicketPass = (bookingReference: string) => {
    const content = generateTicketPassText(bookingReference);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DivyaYatra_Pass_${bookingReference}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadManifestCsv = (templeId: number, dateStr: string) => {
    const temple = getTempleById(templeId);
    const dateBookings = bookings.filter(
      (b) => b.templeId === templeId && b.reservationDate === dateStr && b.bookingStatus === 'CONFIRMED'
    );

    const rows = ['BookingReference,SlotName,DarshanCategory,DevoteeCount,AmountPaid,DevoteeTokens,BookedUser'];
    dateBookings.forEach((b) => {
      const tokens = b.devotees.map((d) => d.tokenNumber).join(';');
      const devoteeNames = b.devotees.map((d) => d.fullName).join(';');
      rows.push(
        `"${b.bookingReference}","${b.slotName}","${b.darshanName}",${b.totalDevotees},${b.totalAmount},"${tokens}","${devoteeNames}"`
      );
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Manifest_${temple?.templeCode || templeId}_${dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAdminMetrics = () => {
    const totalBookings = bookings.length;
    const grossRevenue = bookings
      .filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const totalDevotees = bookings
      .filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalDevotees, 0);
    const totalTemples = temples.filter((t) => t.isActive).length;
    const activeSlotsCount = timeSlots.filter((ts) => ts.isActive).length;

    return {
      totalBookings,
      grossRevenue,
      totalDevotees,
      totalTemples,
      activeSlotsCount,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        temples,
        darshanTypes,
        darshanConfigs,
        timeSlots,
        slotInventories,
        bookings,
        cancellations,
        festivals,
        activeView,
        selectedTempleId,
        setActiveView,
        login,
        loginWithPassword,
        loginAsRole,
        logout,
        registerUser,
        getTempleById,
        getDarshansForTemple,
        getSlotsForTemple,
        getSlotAvailability,
        getAllSlotsAvailabilityForDate,
        reserveTickets,
        cancelBooking,
        lookupTicket,
        checkInBooking,
        updateSlotCapacity,
        addTemple,
        updateTemple,
        generateTicketPassText,
        downloadTicketPass,
        downloadManifestCsv,
        getAdminMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
