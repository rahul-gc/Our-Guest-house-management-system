import React, { useEffect, useState } from 'react';
import { roomService } from '@/services/roomService';
import { guestService } from '@/services/guestService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Room } from '@/services/roomService';
import { RefreshCw } from 'lucide-react';

const RoomStatus: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [roomsData, guestsData] = await Promise.all([
        roomService.getAllRooms(),
        guestService.getGuestsByStatus('checked-in')
      ]);
      setRooms(roomsData);
      setGuests(guestsData);
    } catch (error) {
      console.error('Error loading room data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatus = (roomNumber: number) => {
    const room = rooms.find(r => r.room_number === roomNumber);
    return room?.status || 'available';
  };

  const getActiveBooking = (roomNumber: number) => {
    return guests.find(g => g.room_number === roomNumber);
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Room Status</h1>
          <p className="text-muted-foreground mt-1">Loading room data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Status</h1>
          <p className="text-muted-foreground mt-1">All {rooms.length} rooms at a glance</p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map(room => {
          const status = getRoomStatus(room.room_number);
          const booking = getActiveBooking(room.room_number);

          const borderColor = status === 'reserved'
            ? 'border-l-foreground/30'
            : status === 'occupied'
            ? 'border-l-primary'
            : 'border-l-success';

          return (
            <Card
              key={room.room_number}
              className={`border-0 shadow-md border-l-4 ${borderColor} hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => {
                if (status === 'available') navigate('/guest-entry?room=' + room.room_number);
                else if (status === 'occupied') navigate('/checkout?room=' + room.room_number);
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{room.room_number}</span>
                    <span className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${
                      status === 'available' ? 'bg-success/10 text-success' :
                      status === 'occupied' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'reserved' ? 'Reserved' : status === 'occupied' ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">Rs. {room.price_per_night}</span>
                </div>
                <p className="text-sm text-muted-foreground">{room.room_type}</p>
                {booking && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground">{booking.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Since {new Date(booking.checkin_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStatus;
