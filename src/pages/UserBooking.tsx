import React, { useEffect, useState } from 'react';
import { roomService } from '@/services/roomService';
import { guestService } from '@/services/guestService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { Room } from '@/services/roomService';
import { Calendar, MapPin, Users, Phone, Mail } from 'lucide-react';

const UserBooking: React.FC = () => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: '',
    idType: '',
    idNumber: '',
    numGuests: '1',
    purpose: '',
    notes: '',
    checkIn: '',
    expectedCheckout: ''
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom || !formData.fullName.trim() || !formData.checkIn || !formData.expectedCheckout) {
      toast.error('Please fill in all required fields and select a room');
      return;
    }

    setSubmitting(true);
    try {
      const guest = await guestService.createGuest({
        full_name: formData.fullName.trim(),
        phone: formData.phone || null,
        email: formData.email || null,
        address: formData.address || null,
        city: formData.city || null,
        country: formData.country || null,
        id_type: formData.idType || null,
        id_number: formData.idNumber || null,
        room_number: selectedRoom,
        num_guests: parseInt(formData.numGuests) || 1,
        purpose: formData.purpose || null,
        notes: formData.notes || null,
        checkin_date: new Date(formData.checkIn).toISOString(),
        expected_checkout: new Date(formData.expectedCheckout).toISOString(),
        status: 'checked-in',
      });

      await roomService.updateRoom(selectedRoom, { status: 'occupied' });

      toast.success(`Booking successful! Your Guest ID: ${guest.guest_id}`);
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading available rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Book Your Stay</h1>
          <p className="text-muted-foreground mt-2">Choose from our available rooms and make a reservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Rooms */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Available Rooms ({availableRooms.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableRooms.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No rooms available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableRooms.map(room => (
                      <Card 
                        key={room.room_number}
                        className={`cursor-pointer transition-all ${
                          selectedRoom === room.room_number 
                            ? 'ring-2 ring-primary border-primary' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => setSelectedRoom(room.room_number)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xl font-bold">Room {room.room_number}</span>
                            <span className="text-lg font-semibold text-primary">Rs. {room.price_per_night}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{room.room_type}</p>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              Available
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in Date *</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => handleInputChange('checkIn', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedCheckout">Checkout Date *</Label>
                      <Input
                        id="expectedCheckout"
                        type="date"
                        value={formData.expectedCheckout}
                        onChange={(e) => handleInputChange('expectedCheckout', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="numGuests">Number of Guests</Label>
                    <Select value={formData.numGuests} onValueChange={(value) => handleInputChange('numGuests', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purpose">Purpose of Visit</Label>
                    <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourism">Tourism</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Special Requests</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any special requests or notes"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!selectedRoom || submitting}
                  >
                    {submitting ? 'Processing...' : selectedRoom ? `Book Room ${selectedRoom}` : 'Select a Room First'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <Card className="mt-8 mx-4 md:mx-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Phone Numbers</h4>
              <div className="space-y-2">
                <a href="tel:9851154647" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Mobile: 9851154647
                </a>
                <a href="tel:9847796612" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Mobile: 9847796612
                </a>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">Telephone</h4>
              <a href="tel:01-5348383" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Tel: 01-5348383
              </a>
            </div>
          </div>
          <div className="pt-4 border-t border-blue-200">
            <a 
              href="https://maps.app.goo.gl/9SA4FgaiwmAKneMZA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              📍 View Location on Google Maps
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Footer with watermark */}
      <footer className="mt-12 py-6 border-t border-border">
        <div className="text-center text-sm">
          <span className="text-foreground/90 font-medium">Created by Rahul GC © 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default UserBooking;
