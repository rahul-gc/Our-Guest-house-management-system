import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DoorOpen, Eye } from 'lucide-react';
import type { Guest } from '@/services/guestService';

interface ActiveGuestsTableProps {
  guests: Guest[];
  onCheckout?: (guest: Guest) => void;
  onViewDetails?: (guest: Guest) => void;
}

const getStatusPill = (status: string) => {
  const styles = {
    'checked-in': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'checked-out': 'bg-slate-100 text-slate-600 border-slate-200',
    'reserved': 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return styles[status as keyof typeof styles] || styles['checked-in'];
};

const getStatusLabel = (status: string) => {
  const labels = {
    'checked-in': 'Active',
    'checked-out': 'Checked Out',
    'reserved': 'Reserved',
  };
  return labels[status as keyof typeof labels] || status;
};

export const ActiveGuestsTable: React.FC<ActiveGuestsTableProps> = ({
  guests,
  onCheckout,
  onViewDetails,
}) => {
  const activeGuests = guests.filter(g => g.status === 'checked-in');

  if (activeGuests.length === 0) {
    return (
      <Card className="shadow-luxury border-0">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-xl font-serif text-slate-800">Active Guests</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DoorOpen className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">No active guests at the moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-luxury border-0 fade-up">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-serif text-slate-800">
            Active Guests
            <span className="ml-2 text-sm font-sans font-normal text-slate-500">
              ({activeGuests.length})
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-sans font-semibold text-slate-700">Guest ID</TableHead>
              <TableHead className="font-sans font-semibold text-slate-700">Name</TableHead>
              <TableHead className="font-sans font-semibold text-slate-700">Room</TableHead>
              <TableHead className="font-sans font-semibold text-slate-700">Check-in</TableHead>
              <TableHead className="font-sans font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-sans font-semibold text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeGuests.map((guest, index) => (
              <TableRow 
                key={guest.id} 
                className="hover:bg-slate-50/80 transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TableCell className="font-mono text-sm text-slate-600">
                  {guest.guest_id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-800">{guest.full_name}</div>
                  {guest.phone && (
                    <div className="text-xs text-slate-500">{guest.phone}</div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Room {guest.room_number}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {new Date(guest.checkin_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusPill(guest.status)} font-medium`}
                  >
                    {getStatusLabel(guest.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(guest)}
                      className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCheckout?.(guest)}
                      className="border-amber-500/50 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <DoorOpen className="w-4 h-4 mr-1" />
                      Checkout
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActiveGuestsTable;
