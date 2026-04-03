import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { guestService, type Guest } from '@/services/guestService';
import { checkoutService } from '@/services/checkoutService';
import { roomService } from '@/services/roomService';

const CheckoutPageNew: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedRoom = searchParams.get('room');

  const [loading, setLoading] = useState(false);
  const [activeGuests, setActiveGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const [extraCharges, setExtraCharges] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentStatus, setPaymentStatus] = useState('paid');

  useEffect(() => {
    loadActiveGuests();
  }, []);

  useEffect(() => {
    if (preselectedRoom) {
      const guest = activeGuests.find(g => g.room_number === parseInt(preselectedRoom));
      if (guest) {
        setSelectedGuestId(guest.id);
        setSelectedGuest(guest);
      }
    }
  }, [activeGuests, preselectedRoom]);

  useEffect(() => {
    if (selectedGuestId) {
      const guest = activeGuests.find(g => g.id === selectedGuestId);
      setSelectedGuest(guest || null);
    } else {
      setSelectedGuest(null);
    }
  }, [selectedGuestId, activeGuests]);

  const loadActiveGuests = async () => {
    try {
      const guests = await guestService.getGuestsByStatus('checked-in');
      setActiveGuests(guests);
    } catch (error) {
      console.error('Error loading guests:', error);
      toast.error('Failed to load active guests');
    }
  };

  const calculateStayDetails = () => {
    if (!selectedGuest) return { nights: 0, roomCharge: 0, total: 0 };

    const checkInDate = new Date(selectedGuest.checkin_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - checkInDate.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const roomChargePerNight = 600;
    const roomCharge = nights * roomChargePerNight;
    const extra = parseFloat(extraCharges) || 0;
    const total = roomCharge + extra;

    return { nights, roomCharge, total };
  };

  const handleCheckout = async () => {
    if (!selectedGuest) {
      toast.error('Please select a guest to checkout');
      return;
    }

    setLoading(true);
    try {
      const { nights, roomCharge, total } = calculateStayDetails();

      await checkoutService.createCheckout({
        guest_id: selectedGuest.guest_id,
        guest_uuid: selectedGuest.id,
        actual_checkout: new Date().toISOString(),
        nights_stayed: nights,
        room_charge: roomCharge,
        extra_charges: parseFloat(extraCharges) || 0,
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
      });

      await roomService.updateRoom(selectedGuest.room_number, { status: 'available' });

      toast.success(`${selectedGuest.full_name} checked out successfully!`);
      navigate('/rooms');
    } catch (error: any) {
      console.error('Error during checkout:', error);
      toast.error(error.message || 'Failed to checkout guest');
    } finally {
      setLoading(false);
    }
  };

  const { nights, roomCharge, total } = calculateStayDetails();

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground mt-1">Process guest checkout</p>
      </div>

      {activeGuests.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No active bookings to checkout</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Select Guest</label>
              <select
                value={selectedGuestId || ''}
                onChange={e => setSelectedGuestId(e.target.value || null)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">Choose guest...</option>
                {activeGuests.map(g => (
                  <option key={g.id} value={g.id}>
                    Room {g.room_number} - {g.full_name} (Guest ID: {g.guest_id})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {selectedGuest && (
            <Card className="border-0 shadow-md border-l-4 border-l-primary">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Checkout Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Guest ID</span>
                      <p className="font-medium text-foreground">{selectedGuest.guest_id}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Guest Name</span>
                      <p className="font-medium text-foreground">{selectedGuest.full_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Room Number</span>
                      <p className="font-medium text-foreground">{selectedGuest.room_number}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone</span>
                      <p className="font-medium text-foreground">{selectedGuest.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Check-in Date</span>
                      <p className="font-medium text-foreground">
                        {new Date(selectedGuest.checkin_date).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nights Stayed</span>
                      <p className="font-medium text-foreground">{nights}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Room Charges</span>
                      <p className="font-medium text-foreground">Rs. {roomCharge.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Extra Charges (Food, Laundry, etc.)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={extraCharges}
                        onChange={e => setExtraCharges(e.target.value)}
                        placeholder="0.00"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Payment Status</label>
                    <select
                      value={paymentStatus}
                      onChange={e => setPaymentStatus(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-foreground">Total Amount</span>
                      <span className="text-2xl font-bold text-primary">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCheckout} size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Checkout'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPageNew;
