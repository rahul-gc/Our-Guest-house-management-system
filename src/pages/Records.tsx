import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Records: React.FC = () => {
  const { allBookings } = useHotel();
  const [search, setSearch] = useState('');

  const filtered = allBookings.filter(b => {
    const q = search.toLowerCase();
    return (
      b.guest.name.toLowerCase().includes(q) ||
      b.guest.citizenshipNumber?.toLowerCase().includes(q) ||
      b.guest.passportNumber?.toLowerCase().includes(q) ||
      b.roomNumber.toString().includes(q)
    );
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Guest Records</h1>
        <p className="text-muted-foreground mt-1">Search and view guest history</p>
      </div>

      <div className="mb-6">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, citizenship/passport number, or room..."
          className="max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {allBookings.length === 0 ? 'No guest records yet' : 'No records match your search'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <Card key={b.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{b.guest.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.guest.guestType === 'nepali'
                        ? `Citizenship: ${b.guest.citizenshipNumber || 'N/A'}`
                        : `Passport: ${b.guest.passportNumber || 'N/A'} • ${b.guest.nationality || ''}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">Room {b.roomNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.checkIn.toLocaleDateString()} → {b.actualCheckout?.toLocaleDateString() || 'Active'}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    b.status === 'active'
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {b.status === 'active' ? 'Active' : 'Checked Out'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Records;
