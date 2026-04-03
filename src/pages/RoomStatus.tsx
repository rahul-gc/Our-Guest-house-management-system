import React from 'react';
import { useHotel } from '@/context/HotelContext';
import { ROOMS } from '@/data/roomConfig';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const RoomStatus: React.FC = () => {
  const { getRoomStatus, getActiveBooking } = useHotel();
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Room Status</h1>
        <p className="text-muted-foreground mt-1">All 23 rooms at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ROOMS.map(room => {
          const status = getRoomStatus(room.number);
          const booking = getActiveBooking(room.number);

          const borderColor = status === 'reserved'
            ? 'border-l-foreground/30'
            : status === 'occupied'
            ? 'border-l-primary'
            : 'border-l-success';

          return (
            <Card
              key={room.number}
              className={`border-0 shadow-md border-l-4 ${borderColor} hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => {
                if (status === 'available') navigate('/guest-entry?room=' + room.number);
                else if (status === 'occupied') navigate('/checkout?room=' + room.number);
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-foreground">{room.number}</span>
                    <span className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${
                      status === 'available' ? 'bg-success/10 text-success' :
                      status === 'occupied' ? 'bg-primary/10 text-primary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {status === 'reserved' ? 'Reserved' : status === 'occupied' ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-foreground">Rs. {room.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{room.label}</p>
                {booking && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm font-medium text-foreground">{booking.guest.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Since {booking.checkIn.toLocaleDateString()}
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
