import React from 'react';
import { useHotel } from '@/context/HotelContext';
import { ROOMS } from '@/data/roomConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BedDouble, DoorOpen, CalendarCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { activeBookings, todayCheckIns, todayCheckOuts, getRoomStatus } = useHotel();

  const availableCount = ROOMS.filter(r => getRoomStatus(r.number) === 'available').length;
  const occupiedCount = ROOMS.filter(r => getRoomStatus(r.number) === 'occupied').length;

  const stats = [
    { label: 'Current Guests', value: activeBookings.length, icon: Users, color: 'text-primary' },
    { label: 'Available Rooms', value: availableCount, icon: BedDouble, color: 'text-success' },
    { label: 'Occupied Rooms', value: occupiedCount, icon: DoorOpen, color: 'text-warning' },
    { label: "Today's Check-ins", value: todayCheckIns.length, icon: CalendarCheck, color: 'text-secondary' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to New Chitwan Guest House</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(stat => (
          <Card key={stat.label} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
                <div className="bg-muted p-3 rounded-xl">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick room overview */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Room Overview</h2>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
            {ROOMS.map(room => {
              const status = getRoomStatus(room.number);
              const bg = status === 'reserved'
                ? 'bg-foreground/20 text-muted-foreground'
                : status === 'occupied'
                ? 'bg-primary text-primary-foreground'
                : 'bg-success text-success-foreground';
              return (
                <div
                  key={room.number}
                  className={`${bg} rounded-lg p-2 text-center text-sm font-semibold`}
                  title={`Room ${room.number} - ${status}`}
                >
                  {room.number}
                </div>
              );
            })}
          </div>
          <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-success inline-block" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary inline-block" /> Occupied</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-foreground/20 inline-block" /> Reserved</span>
          </div>
        </CardContent>
      </Card>

      {/* Today's activity */}
      {(todayCheckIns.length > 0 || todayCheckOuts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {todayCheckIns.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-foreground">Today's Check-ins</h3>
                {todayCheckIns.map(b => (
                  <div key={b.id} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{b.guest.name}</span>
                    <span className="text-sm text-muted-foreground">Room {b.roomNumber}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {todayCheckOuts.length > 0 && (
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-foreground">Today's Check-outs</h3>
                {todayCheckOuts.map(b => (
                  <div key={b.id} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{b.guest.name}</span>
                    <span className="text-sm text-muted-foreground">Room {b.roomNumber}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
