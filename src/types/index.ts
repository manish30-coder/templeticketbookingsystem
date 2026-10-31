export type Role = 'DEVOTEE' | 'STAFF' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  idProofType?: string;
  idProofNumber?: string;
  isActive: boolean;
  dashboardRoute: string;
}

export interface Temple {
  id: number;
  templeCode: string;
  name: string;
  state: string;
  city: string;
  deity: string;
  openingTime: string;
  closingTime: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl: string;
  isActive: boolean;
  history?: string;
  architectureStyle?: string;
  sanctumDetails?: string;
  ritualsSchedule?: { ritualName: string; time: string; significance: string }[];
  dressCode?: { men: string; women: string; general: string };
  dosAndDonts?: { dos: string[]; donts: string[] };
  coordinates?: { latitude: number; longitude: number };
}

export interface DarshanType {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface TempleDarshanConfig {
  id: number;
  templeId: number;
  darshanTypeId: number;
  basePrice: number;
  maxDevoteesPerBooking: number;
  rules: string;
  isActive: boolean;
}

export interface TimeSlot {
  id: number;
  templeId: number;
  slotName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface SlotInventory {
  id: number;
  templeId: number;
  darshanTypeId: number;
  slotId: number;
  reservationDate: string; // YYYY-MM-DD
  totalCapacity: number;
  reservedCount: number;
  version: number;
}

export interface BookingDevotee {
  id?: number;
  bookingId?: number;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idProofType: 'AADHAAR' | 'PASSPORT' | 'VOTER_ID' | 'PAN' | 'DRIVING_LICENSE' | 'EMPLOYEE_ID';
  idProofNumber: string;
  tokenNumber?: string;
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING';

export interface Booking {
  id: number;
  bookingReference: string;
  userId: number;
  templeId: number;
  darshanTypeId: number;
  slotId: number;
  reservationDate: string; // YYYY-MM-DD
  totalDevotees: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentMethod: string;
  transactionReference: string;
  paymentStatus: 'SUCCESS' | 'REFUNDED' | 'FAILED';
  createdAt: string;
  devotees: BookingDevotee[];
  templeName?: string;
  templeCity?: string;
  templeState?: string;
  darshanName?: string;
  slotName?: string;
  startTime?: string;
  endTime?: string;
}

export interface Cancellation {
  id: number;
  bookingId: number;
  cancelledBy: number;
  reason: string;
  refundAmount: number;
  cancelledAt: string;
}

export interface FestivalEvent {
  id: number;
  templeId: number;
  templeCode: string;
  festivalName: string;
  startDate: string;
  endDate: string;
  description: string;
  announcementTitle: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  publishedBy: string;
}
