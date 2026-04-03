import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { guestService } from '@/services/guestService';
import { roomService } from '@/services/roomService';
import type { Room } from '@/services/roomService';

const GuestEntryNew: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedRoom = searchParams.get('room');

  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Nepal');
  const [idType, setIdType] = useState('Citizenship');
  const [idNumber, setIdNumber] = useState('');
  const [roomNumber, setRoomNumber] = useState(preselectedRoom || '');
  const [numGuests, setNumGuests] = useState('1');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().slice(0, 16));
  const [expectedCheckout, setExpectedCheckout] = useState('');

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    try {
      const rooms = await roomService.getAvailableRooms();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load available rooms');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !roomNumber || !expectedCheckout) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const guest = await guestService.createGuest({
        full_name: fullName.trim(),
        phone: phone || null,
        email: email || null,
        address: address || null,
        city: city || null,
        country: country || null,
        id_type: idType || null,
        id_number: idNumber || null,
        room_number: parseInt(roomNumber),
        num_guests: parseInt(numGuests) || 1,
        purpose: purpose || null,
        notes: notes || null,
        checkin_date: new Date(checkIn).toISOString(),
        expected_checkout: new Date(expectedCheckout).toISOString(),
        status: 'checked-in',
      });

      await roomService.updateRoom(parseInt(roomNumber), { status: 'occupied' });

      toast.success(`${fullName} checked in successfully! Guest ID: ${guest.guest_id}`);
      navigate('/rooms');
    } catch (error: any) {
      console.error('Error creating guest:', error);
      toast.error(error.message || 'Failed to check in guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">New Guest Entry</h1>
        <p className="text-muted-foreground mt-1">Register a new guest</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Guest Information</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Guest full name"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
                <Input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                <Input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Full address"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Country</label>
                <Input
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="Country"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">ID Type</label>
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="Citizenship">Citizenship</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">ID Number</label>
                <Input
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder="ID number"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Room Number *</label>
                <select
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select Room</option>
                  {availableRooms.map(r => (
                    <option key={r.room_number} value={r.room_number}>
                      Room {r.room_number} - Rs.{r.price_per_night}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Number of Guests</label>
                <Input
                  type="number"
                  min="1"
                  value={numGuests}
                  onChange={e => setNumGuests(e.target.value)}
                  placeholder="1"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Purpose of Visit</label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select purpose</option>
                  <option value="tourism">Tourism</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Check-in Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Expected Checkout *</label>
                <Input
                  type="datetime-local"
                  value={expectedCheckout}
                  onChange={e => setExpectedCheckout(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Special Requests / Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requests or notes"
                disabled={loading}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-4" disabled={loading}>
              {loading ? 'Checking In...' : 'Check In Guest'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestEntryNew;
