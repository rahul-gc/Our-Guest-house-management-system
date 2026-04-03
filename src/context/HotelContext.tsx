import React, { createContext, useContext, useState, useCallback } from 'react';
import { ROOMS } from '@/data/roomConfig';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  guestType: 'nepali' | 'foreign';
  citizenshipNumber?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  passportNumber?: string;
  nationality?: string;
  visaType?: string;
  purpose?: string;
}

export interface Booking {
  id: string;
  guest: Guest;
  roomNumber: number;
  checkIn: Date;
  expectedCheckout: Date;
  actualCheckout?: Date;
  status: 'active' | 'checked-out';
  createdAt: Date;
}

interface HotelContextType {
  bookings: Booking[];
  addBooking: (guest: Guest, roomNumber: number, checkIn: Date, expectedCheckout: Date) => void;
  checkoutRoom: (bookingId: string) => void;
  getRoomStatus: (roomNumber: number) => 'available' | 'occupied' | 'reserved';
  getActiveBooking: (roomNumber: number) => Booking | undefined;
  activeBookings: Booking[];
  allBookings: Booking[];
  todayCheckIns: Booking[];
  todayCheckOuts: Booking[];
}

const HotelContext = createContext<HotelContextType | null>(null);

export const useHotel = () => {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error('useHotel must be used within HotelProvider');
  return ctx;
};

const isToday = (d: Date) => {
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = useCallback((guest: Guest, roomNumber: number, checkIn: Date, expectedCheckout: Date) => {
    const booking: Booking = {
      id: crypto.randomUUID(),
      guest,
      roomNumber,
      checkIn,
      expectedCheckout,
      status: 'active',
      createdAt: new Date(),
    };
    setBookings(prev => [...prev, booking]);
  }, []);

  const checkoutRoom = useCallback((bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'checked-out' as const, actualCheckout: new Date() } : b)
    );
  }, []);

  const activeBookings = bookings.filter(b => b.status === 'active');

  const getRoomStatus = useCallback((roomNumber: number) => {
    const room = ROOMS.find(r => r.number === roomNumber);
    if (room?.isPermanentlyReserved) return 'reserved' as const;
    const hasActive = activeBookings.some(b => b.roomNumber === roomNumber);
    return hasActive ? 'occupied' as const : 'available' as const;
  }, [activeBookings]);

  const getActiveBooking = useCallback((roomNumber: number) => {
    return activeBookings.find(b => b.roomNumber === roomNumber);
  }, [activeBookings]);

  const todayCheckIns = activeBookings.filter(b => isToday(b.checkIn));
  const todayCheckOuts = bookings.filter(b => b.status === 'checked-out' && b.actualCheckout && isToday(b.actualCheckout));

  return (
    <HotelContext.Provider value={{
      bookings, addBooking, checkoutRoom, getRoomStatus, getActiveBooking,
      activeBookings, allBookings: bookings, todayCheckIns, todayCheckOuts,
    }}>
      {children}
    </HotelContext.Provider>
  );
};
