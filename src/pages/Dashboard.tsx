import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '@/context/HotelContext';
import { DashboardStats } from '@/components/StatCards';
import { RoomStatusGrid } from '@/components/RoomStatusGrid';
import { ActiveGuestsTable } from '@/components/ActiveGuestsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, CalendarX, ArrowRight, Sparkles } from 'lucide-react';
import { roomService } from '@/services/roomService';
import { guestService } from '@/services/guestService';
import type { Room } from '@/services/roomService';
import type { Guest } from '@/services/guestService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activeBookings, todayCheckIns, todayCheckOuts } = useHotel();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsData, guestsData] = await Promise.all([
        roomService.getAllRooms(),
        guestService.getAllGuests(),
      ]);
      setRooms(roomsData);
      setGuests(guestsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    activeGuests: guests.filter(g => g.status === 'checked-in').length,
    availableRooms: rooms.filter(r => r.status === 'available').length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    cleaningRooms: rooms.filter(r => r.status === 'cleaning').length,
    reservedRooms: rooms.filter(r => r.status === 'reserved').length,
  };

  const handleRoomClick = (room: Room) => {
    if (room.status === 'available') {
      navigate(`/guest-entry?room=${room.room_number}`);
    }
  };

  const handleCheckout = (guest: Guest) => {
    navigate(`/checkout?guest=${guest.guest_id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 fade-up">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 font-serif">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1 font-sans">
            Welcome to New Chitwan Luxury Guest House
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/guest-entry')}
            className="btn-gold"
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            New Check-in
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        activeGuests={stats.activeGuests}
        availableRooms={stats.availableRooms}
        occupiedRooms={stats.occupiedRooms}
        todayRevenue={0}
      />

      {/* Room Status Grid */}
      <RoomStatusGrid
        rooms={rooms}
        onRoomClick={handleRoomClick}
      />

      {/* Active Guests & Today's Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Guests Table */}
        <div className="lg:col-span-2">
          <ActiveGuestsTable
            guests={guests}
            onCheckout={handleCheckout}
            onViewDetails={(guest) => navigate(`/records?search=${guest.guest_id}`)}
          />
        </div>

        {/* Today's Activity Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-luxury border-0">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-lg font-serif text-slate-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between border-slate-200 hover:border-amber-500/50 hover:bg-amber-50"
                onClick={() => navigate('/rooms')}
              >
                <span className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-amber-600" />
                  View All Rooms
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between border-slate-200 hover:border-amber-500/50 hover:bg-amber-50"
                onClick={() => navigate('/records')}
              >
                <span className="flex items-center gap-2">
                  <CalendarX className="w-4 h-4 text-amber-600" />
                  Guest Records
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Button>
            </CardContent>
          </Card>

          {/* Room Summary */}
          <Card className="shadow-luxury border-0">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-lg font-serif text-slate-800">
                Room Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Available
                  </span>
                  <span className="font-semibold text-slate-800">{stats.availableRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Occupied
                  </span>
                  <span className="font-semibold text-slate-800">{stats.occupiedRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Cleaning
                  </span>
                  <span className="font-semibold text-slate-800">{stats.cleaningRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Reserved
                  </span>
                  <span className="font-semibold text-slate-800">{stats.reservedRooms}</span>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Total Rooms</span>
                    <span className="font-bold text-slate-800">{rooms.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
