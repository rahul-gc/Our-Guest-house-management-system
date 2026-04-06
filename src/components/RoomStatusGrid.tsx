import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, Sparkles, Clock, Ban } from 'lucide-react';
import type { Room } from '@/services/roomService';

interface RoomStatusGridProps {
  rooms: Room[];
  onRoomClick?: (room: Room) => void;
}

const statusConfig = {
  available: {
    label: 'Available',
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: BedDouble,
  },
  occupied: {
    label: 'Occupied',
    color: 'bg-rose-500',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    icon: Clock,
  },
  cleaning: {
    label: 'Cleaning',
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: Sparkles,
  },
  reserved: {
    label: 'Reserved',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Ban,
  },
};

export const RoomStatusGrid: React.FC<RoomStatusGridProps> = ({ rooms, onRoomClick }) => {
  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
  };

  const statusCounts = rooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="shadow-luxury border-0">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif text-slate-800">Room Status Overview</CardTitle>
          <div className="flex gap-4 text-xs">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-slate-600">{config.label} ({statusCounts[key] || 0})</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {rooms.map((room, index) => {
            const config = getStatusConfig(room.status);
            const Icon = config.icon;
            
            return (
              <div
                key={room.room_number}
                onClick={() => onRoomClick?.(room)}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  hover:shadow-lg hover:scale-105 fade-up
                  ${config.bgColor} ${config.borderColor}
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Status Indicator */}
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${config.color} shadow-sm`} />
                
                {/* Room Number */}
                <div className="text-2xl font-bold font-serif text-slate-800 mb-1">
                  {room.room_number}
                </div>
                
                {/* Room Type */}
                <div className={`text-xs font-medium mb-2 ${config.textColor}`}>
                  {room.room_type}
                </div>
                
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                  <Icon className="w-3 h-3" />
                  {config.label}
                </div>
                
                {/* Price */}
                <div className="mt-2 text-sm font-semibold text-slate-700">
                  Rs. {room.price_per_night}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomStatusGrid;
