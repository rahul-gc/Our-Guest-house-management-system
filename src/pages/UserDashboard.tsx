import React, { useEffect, useState } from 'react';
import { roomService } from '@/services/roomService';
import { guestService } from '@/services/guestService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { Room } from '@/services/roomService';
import { Bed, Calendar, Users, Home, LogOut, MapPin, Sparkles, ArrowRight, Phone } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 text-amber-500 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Luxury Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-slate-800">New Chitwan</h1>
                <p className="text-[10px] text-amber-600 uppercase tracking-wider -mt-1">Luxury Guest House</p>
              </div>
              <Badge variant="outline" className="ml-2 border-amber-500/50 text-amber-700 bg-amber-50">Guest Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 hidden sm:block">
                Welcome, <span className="font-medium text-slate-800">{user?.email?.split('@')[0]}</span>
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 fade-up">
          <h2 className="text-4xl font-bold text-slate-800 font-serif">Welcome to Your Guest Portal</h2>
          <p className="text-slate-500 mt-2 text-lg">
            View available rooms and manage your bookings at our luxury guest house
          </p>
        </div>

        {/* Luxury Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-luxury border-0 border-t-4 border-t-emerald-500 fade-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Available Rooms</p>
                  <p className="text-3xl font-bold font-serif text-slate-800 mt-1">{availableRooms.length}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Bed className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury border-0 border-t-4 border-t-amber-500 fade-up fade-up-delay-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Bookings</p>
                  <p className="text-3xl font-bold font-serif text-slate-800 mt-1">{userBookings.length}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-luxury border-0 border-t-4 border-t-blue-500 fade-up fade-up-delay-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Guests</p>
                  <p className="text-3xl font-bold font-serif text-slate-800 mt-1">
                    {userBookings.reduce((sum, booking) => sum + (booking.num_guests || 1), 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 fade-up fade-up-delay-3">
          {/* Book New Room */}
          <Card className="shadow-luxury border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-serif text-slate-800">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Book a Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 mb-4">
                {availableRooms.length > 0 
                  ? `${availableRooms.length} rooms available for booking at our luxury guest house`
                  : 'No rooms available at the moment'
                }
              </p>
              <Button 
                onClick={() => navigate('/user-booking')} 
                className="w-full btn-gold"
                disabled={availableRooms.length === 0}
              >
                {availableRooms.length > 0 ? 'Browse Available Rooms' : 'No Rooms Available'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* My Bookings */}
          <Card className="shadow-luxury border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-serif text-slate-800">
                <Calendar className="h-5 w-5 text-amber-600" />
                My Active Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userBookings.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg">
                  <p className="text-slate-400">No active bookings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBookings.map((booking) => (
                    <div key={booking.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold font-serif text-slate-800">Room {booking.room_number}</span>
                        <Badge className="pill-available">Active</Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        Guest ID: <span className="font-mono text-slate-700">{booking.guest_id}</span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Check-in: <span className="text-slate-700">{new Date(booking.checkin_date).toLocaleDateString()}</span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Guests: <span className="text-slate-700">{booking.num_guests || 1}</span>
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
          <Card className="mt-8 shadow-luxury border-0 fade-up fade-up-delay-4">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xl font-serif text-slate-800">Available Rooms Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableRooms.slice(0, 8).map((room, index) => (
                  <div 
                    key={room.room_number} 
                    className="border border-slate-200 rounded-xl p-4 text-center bg-slate-50/50 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="text-2xl font-bold font-serif text-slate-800 mb-1 group-hover:text-emerald-700">Room {room.room_number}</div>
                    <div className="text-sm text-slate-500 mb-2">{room.room_type}</div>
                    <div className="text-emerald-600 font-bold font-serif">Rs. {room.price_per_night}</div>
                  </div>
                ))}
              </div>
              {availableRooms.length > 8 && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/user-booking')}
                    className="border-slate-200 hover:border-emerald-500 hover:text-emerald-700"
                  >
                    View All {availableRooms.length} Available Rooms
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Luxury Contact Information Section */}
        <Card className="mt-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-200 shadow-luxury">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-serif text-slate-800">
              <Phone className="h-5 w-5 text-amber-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">Phone Numbers</h4>
                <div className="space-y-2">
                  <a href="tel:9851154647" className="flex items-center gap-2 text-slate-600 hover:text-amber-700 transition-colors">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Phone className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium">Mobile: 9851154647</span>
                  </a>
                  <a href="tel:9847796612" className="flex items-center gap-2 text-slate-600 hover:text-amber-700 transition-colors">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Phone className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium">Mobile: 9847796612</span>
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 uppercase tracking-wide text-sm">Telephone</h4>
                <a href="tel:01-5348383" className="flex items-center gap-2 text-slate-600 hover:text-amber-700 transition-colors">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <Phone className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-medium">Tel: 01-5348383</span>
                </a>
              </div>
            </div>
            <div className="pt-4 border-t border-amber-200">
              <a 
                href="https://maps.app.goo.gl/9SA4FgaiwmAKneMZA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-medium"
              >
                <MapPin className="w-5 h-5" />
                📍 View Location on Google Maps
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Luxury Footer */}
        <footer className="mt-12 py-6 border-t border-slate-200">
          <div className="text-center">
            <span className="text-sm text-slate-500">New Chitwan Luxury Guest House</span>
            <p className="text-xs text-slate-400 mt-1">Created by Rahul GC © 2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;
