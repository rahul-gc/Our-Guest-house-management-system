import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { ROOMS } from '@/data/roomConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Reports: React.FC = () => {
  const { allBookings } = useHotel();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filteredBookings = allBookings.filter(b => {
    if (from && b.checkIn < new Date(from)) return false;
    if (to && b.checkIn > new Date(to + 'T23:59:59')) return false;
    return true;
  });

  const nepaliGuests = filteredBookings.filter(b => b.guest.guestType === 'nepali').length;
  const foreignGuests = filteredBookings.filter(b => b.guest.guestType === 'foreign').length;

  const roomUsage = ROOMS.map(room => ({
    number: room.number,
    bookings: filteredBookings.filter(b => b.roomNumber === room.number).length,
  })).filter(r => r.bookings > 0).sort((a, b) => b.bookings - a.bookings);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Guest and room analytics</p>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">From</label>
          <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">To</label>
          <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">{filteredBookings.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">{nepaliGuests}</p>
            <p className="text-sm text-muted-foreground mt-1">🇳🇵 Nepali Guests</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">{foreignGuests}</p>
            <p className="text-sm text-muted-foreground mt-1">🌍 Foreign Guests</p>
          </CardContent>
        </Card>
      </div>

      {roomUsage.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-foreground">Room Usage</h3>
            <div className="space-y-3">
              {roomUsage.map(r => (
                <div key={r.number} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-20 text-foreground">Room {r.number}</span>
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (r.bookings / Math.max(...roomUsage.map(x => x.bookings))) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{r.bookings}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredBookings.length === 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No booking data available for the selected period</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
