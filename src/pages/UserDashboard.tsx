import React, { useEffect, useState } from 'react';
import { roomService } from '@/services/roomService';
import { guestService } from '@/services/guestService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { Room } from '@/services/roomService';
import { Bed, Calendar, Users, Home, LogOut, MapPin } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [roomsData, bookingsData] = await Promise.all([
        roomService.getAvailableRooms(),
        guestService.getAllGuests()
      ]);

      setAvailableRooms(roomsData);
      
      // Filter bookings for current user (by email)
      const userBookings = bookingsData.filter(booking => 
        booking.email === user?.email && booking.status === 'checked-in'
      );
      setUserBookings(userBookings);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Home className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Chitwan Stay Manager</h1>
              <Badge variant="secondary">Guest Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">Welcome to Your Guest Portal</h2>
          <p className="text-muted-foreground mt-2">
            View available rooms and manage your bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Rooms</p>
                  <p className="text-2xl font-bold">{availableRooms.length}</p>
                </div>
                <Bed className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Bookings</p>
                  <p className="text-2xl font-bold">{userBookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                  <p className="text-2xl font-bold">
                    {userBookings.reduce((sum, booking) => sum + (booking.num_guests || 1), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book New Room */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Book a Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {availableRooms.length > 0 
                  ? `${availableRooms.length} rooms available for booking`
                  : 'No rooms available at the moment'
                }
              </p>
              <Button 
                onClick={() => navigate('/user-booking')} 
                className="w-full"
                disabled={availableRooms.length === 0}
              >
                {availableRooms.length > 0 ? 'Browse Available Rooms' : 'No Rooms Available'}
              </Button>
            </CardContent>
          </Card>

          {/* My Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBookings.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No active bookings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Room {booking.room_number}</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Guest ID: {booking.guest_id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Check-in: {new Date(booking.checkin_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Guests: {booking.num_guests || 1}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Rooms Preview */}
        {availableRooms.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Available Rooms Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableRooms.slice(0, 8).map(room => (
                  <div key={room.room_number} className="border rounded-lg p-3 text-center">
                    <div className="text-lg font-bold mb-1">Room {room.room_number}</div>
                    <div className="text-sm text-muted-foreground mb-2">{room.room_type}</div>
                    <div className="text-primary font-semibold">Rs. {room.price_per_night}</div>
                  </div>
                ))}
              </div>
              {availableRooms.length > 8 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => navigate('/user-booking')}>
                    View All {availableRooms.length} Available Rooms
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact Information Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
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
    </div>
  );
};

export default UserDashboard;
