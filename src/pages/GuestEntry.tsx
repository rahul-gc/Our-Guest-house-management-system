import React, { useState } from 'react';
import { useHotel } from '@/context/HotelContext';
import { getAvailableRooms } from '@/data/roomConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Guest } from '@/context/HotelContext';

const GuestEntry: React.FC = () => {
  const { addBooking, getRoomStatus } = useHotel();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedRoom = searchParams.get('room');

  const [guestType, setGuestType] = useState<'nepali' | 'foreign'>('nepali');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [citizenshipNumber, setCitizenshipNumber] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [visaType, setVisaType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [roomNumber, setRoomNumber] = useState(preselectedRoom || '');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().slice(0, 16));
  const [expectedCheckout, setExpectedCheckout] = useState('');

  const availableRooms = getAvailableRooms().filter(r => getRoomStatus(r.number) === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roomNumber || !expectedCheckout) {
      toast.error('Please fill in all required fields');
      return;
    }

    const guest: Guest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      phone,
      guestType,
      ...(guestType === 'nepali'
        ? { citizenshipNumber, address, province, district, ward }
        : { passportNumber, nationality, visaType }),
      purpose,
    };

    addBooking(guest, parseInt(roomNumber), new Date(checkIn), new Date(expectedCheckout));
    toast.success(`${name} checked into Room ${roomNumber}`);
    navigate('/rooms');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">New Guest Entry</h1>
        <p className="text-muted-foreground mt-1">Register a new guest</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={guestType === 'nepali' ? 'default' : 'outline'}
              onClick={() => setGuestType('nepali')}
              size="sm"
            >
              🇳🇵 Nepali Guest
            </Button>
            <Button
              type="button"
              variant={guestType === 'foreign' ? 'default' : 'outline'}
              onClick={() => setGuestType('foreign')}
              size="sm"
            >
              🌍 Foreign Guest
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Guest full name" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" />
              </div>
            </div>

            {guestType === 'nepali' ? (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Citizenship Number</label>
                  <Input value={citizenshipNumber} onChange={e => setCitizenshipNumber(e.target.value)} placeholder="Citizenship number" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Province</label>
                    <Input value={province} onChange={e => setProvince(e.target.value)} placeholder="Province" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">District</label>
                    <Input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Ward</label>
                    <Input value={ward} onChange={e => setWard(e.target.value)} placeholder="Ward" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address" />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Passport Number</label>
                    <Input value={passportNumber} onChange={e => setPassportNumber(e.target.value)} placeholder="Passport number" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Nationality</label>
                    <Input value={nationality} onChange={e => setNationality(e.target.value)} placeholder="Nationality" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Visa Type</label>
                  <Input value={visaType} onChange={e => setVisaType(e.target.value)} placeholder="Tourist / Business / etc." />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Purpose of Visit</label>
              <Input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Tourism, Business, etc." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Room *</label>
                <select
                  value={roomNumber}
                  onChange={e => setRoomNumber(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select Room</option>
                  {availableRooms.map(r => (
                    <option key={r.number} value={r.number}>
                      Room {r.number} - Rs.{r.price} ({r.label})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Check-in *</label>
                <Input type="datetime-local" value={checkIn} onChange={e => setCheckIn(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Expected Checkout *</label>
                <Input type="datetime-local" value={expectedCheckout} onChange={e => setExpectedCheckout(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-4">
              Check In Guest
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestEntry;
