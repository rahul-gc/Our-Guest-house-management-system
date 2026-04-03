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
