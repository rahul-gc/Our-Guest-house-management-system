import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { ROOMS } from '@/data/roomConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { activeBookings, checkoutRoom } = useHotel();
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get('room');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(
    preselectedRoom ? activeBookings.find(b => b.roomNumber === parseInt(preselectedRoom))?.id || null : null
  );

  const booking = activeBookings.find(b => b.id === selectedBooking);

  const handleCheckout = () => {
    if (!booking) return;
    checkoutRoom(booking.id);
    toast.success(`Room ${booking.roomNumber} checked out. Guest: ${booking.guest.name}`);
    setSelectedBooking(null);
  };

  const getDuration = () => {
    if (!booking) return '';
    const diff = Date.now() - booking.checkIn.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  const getTotal = () => {
    if (!booking) return 0;
    const room = ROOMS.find(r => r.number === booking.roomNumber);
    const diff = Date.now() - booking.checkIn.getTime();
    const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return (room?.price || 0) * nights;
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground mt-1">Process guest checkout</p>
      </div>

      {activeBookings.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No active bookings to checkout</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Select Room</label>
              <select
                value={selectedBooking || ''}
                onChange={e => setSelectedBooking(e.target.value || null)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Choose occupied room...</option>
                {activeBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    Room {b.roomNumber} - {b.guest.name}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {booking && (
            <Card className="border-0 shadow-md border-l-4 border-l-primary">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Checkout Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Guest Name</span>
                    <p className="font-medium text-foreground">{booking.guest.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Room</span>
                    <p className="font-medium text-foreground">{booking.roomNumber}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Check-in</span>
                    <p className="font-medium text-foreground">{booking.checkIn.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration</span>
                    <p className="font-medium text-foreground">{getDuration()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone</span>
                    <p className="font-medium text-foreground">{booking.guest.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Total</span>
                    <p className="font-bold text-primary text-lg">Rs. {getTotal().toLocaleString()}</p>
                  </div>
                </div>

                <Button onClick={handleCheckout} size="lg" className="w-full mt-4">
                  Confirm Checkout
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
