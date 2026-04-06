import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BedDouble, DoorOpen, Wallet } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: 'emerald' | 'blue' | 'amber' | 'rose' | 'navy';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    emerald: {
      border: 'border-t-emerald-500',
      bg: 'bg-emerald-50',
      icon: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    blue: {
      border: 'border-t-blue-500',
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    amber: {
      border: 'border-t-amber-500',
      bg: 'bg-amber-50',
      icon: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    rose: {
      border: 'border-t-rose-500',
      bg: 'bg-rose-50',
      icon: 'text-rose-600',
      iconBg: 'bg-rose-100',
    },
    navy: {
      border: 'border-t-slate-700',
      bg: 'bg-slate-50',
      icon: 'text-slate-700',
      iconBg: 'bg-slate-200',
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className={`border-0 shadow-luxury ${colors.border} border-t-4 overflow-hidden fade-up`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600 font-sans tracking-wide uppercase">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            <Icon className={`h-5 w-5 ${colors.icon}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-800 font-serif">{value}</span>
          {trend && (
            <span className="text-xs text-emerald-600 font-medium">{trend}</span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  activeGuests: number;
  availableRooms: number;
  occupiedRooms: number;
  todayRevenue?: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  activeGuests,
  availableRooms,
  occupiedRooms,
  todayRevenue = 0,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Active Guests"
        value={activeGuests}
        subtitle="Currently checked in"
        icon={Users}
        color="navy"
      />
      <StatCard
        title="Available Rooms"
        value={availableRooms}
        subtitle="Ready for booking"
        icon={BedDouble}
        color="emerald"
      />
      <StatCard
        title="Occupied Rooms"
        value={occupiedRooms}
        subtitle="Guests staying"
        icon={DoorOpen}
        color="amber"
      />
      <StatCard
        title="Today's Revenue"
        value={`Rs. ${todayRevenue.toLocaleString()}`}
        subtitle="From checkouts"
        icon={Wallet}
        color="blue"
      />
    </div>
  );
};

export default StatCard;
