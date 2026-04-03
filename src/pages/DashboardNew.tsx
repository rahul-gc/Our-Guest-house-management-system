import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BedDouble, DoorOpen, CalendarCheck, DollarSign } from 'lucide-react';
import { guestService, type Guest } from '@/services/guestService';
import { checkoutService } from '@/services/checkoutService';
import { roomService } from '@/services/roomService';
import { toast } from 'sonner';

const DashboardNew: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeGuests, setActiveGuests] = useState<Guest[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<Guest[]>([]);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [active, checkins, rooms, checkouts] = await Promise.all([
        guestService.getGuestsByStatus('checked-in'),
        guestService.getTodayCheckIns(),
        roomService.getAvailableRooms(),
        checkoutService.getTodayCheckouts(),
      ]);

      setActiveGuests(active);
      setTodayCheckIns(checkins);
      setAvailableRooms(rooms.length);
      setTodayCheckOuts(checkouts.length);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const revenue = await checkoutService.getTotalRevenue(startOfMonth);
      setMonthlyRevenue(revenue);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Current Guests', value: activeGuests.length, icon: Users, color: 'text-primary' },
    { label: 'Available Rooms', value: availableRooms, icon: BedDouble, color: 'text-success' },
    { label: "Today's Check-ins", value: todayCheckIns.length, icon: CalendarCheck, color: 'text-secondary' },
    { label: "Today's Check-outs", value: todayCheckOuts, icon: DoorOpen, color: 'text-warning' },
    {
      label: 'Monthly Revenue',
      value: `Rs. ${monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
    },
  ];

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to New Chitwan Guest House</p>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to New Chitwan Guest House</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map(stat => (
          <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
                <div className="bg-muted p-3 rounded-xl">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {todayCheckIns.length > 0 && (
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-foreground">Today's Check-ins</h3>
            <div className="space-y-2">
              {todayCheckIns.map(guest => (
                <div key={guest.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{guest.full_name}</p>
                    <p className="text-sm text-muted-foreground">Guest ID: {guest.guest_id}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Room {guest.room_number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeGuests.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-foreground">Currently Checked-In Guests</h3>
            <div className="space-y-2">
              {activeGuests.slice(0, 10).map(guest => (
                <div key={guest.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{guest.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {guest.guest_id} • Check-in: {new Date(guest.checkin_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-foreground">Room {guest.room_number}</span>
                </div>
              ))}
            </div>
            {activeGuests.length > 10 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                And {activeGuests.length - 10} more guests...
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardNew;
