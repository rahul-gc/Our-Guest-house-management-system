import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DoorOpen, 
  Calendar, 
  Clock, 
  User, 
  CreditCard, 
  Receipt,
  CheckCircle2,
  Sparkles,
  Calculator
} from 'lucide-react';
import { guestService } from '@/services/guestService';
import { roomService } from '@/services/roomService';
import { toast } from 'sonner';
import type { Guest } from '@/services/guestService';

interface BillSummary {
  roomCharges: number;
  additionalCharges: number;
  discount: number;
  tax: number;
  total: number;
  nights: number;
}

export const LuxuryCheckoutForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const guestId = searchParams.get('guest');
  
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [discount, setDiscount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (guestId) {
      loadGuest();
    } else {
      setLoading(false);
    }
  }, [guestId]);

  const loadGuest = async () => {
    try {
      const data = await guestService.getGuestByGuestId(guestId!);
      setGuest(data);
    } catch (error) {
      toast.error('Failed to load guest details');
    } finally {
      setLoading(false);
    }
  };

  const calculateBill = (): BillSummary => {
    if (!guest) return { roomCharges: 0, additionalCharges: 0, discount: 0, tax: 0, total: 0, nights: 0 };
    
    const checkIn = new Date(guest.checkin_date);
    const checkOut = new Date();
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Assuming room price is fetched from room data
    const roomPrice = 1500; // Default price, should be fetched from room data
    const roomCharges = nights * roomPrice;
    const addCharges = parseFloat(additionalCharges) || 0;
    const disc = parseFloat(discount) || 0;
    const subtotal = roomCharges + addCharges - disc;
    const tax = subtotal * 0.13; // 13% tax
    const total = subtotal + tax;

    return {
      roomCharges,
      additionalCharges: addCharges,
      discount: disc,
      tax,
      total,
      nights,
    };
  };

  const handleCheckout = async () => {
    if (!guest) return;
    
    setProcessing(true);
    try {
      // Update guest status
      await guestService.updateGuest(guest.id, {
        status: 'checked-out',
        notes: notes || undefined,
      });

      // Update room status to available
      await roomService.updateRoom(guest.room_number, { status: 'available' });

      toast.success(`Checkout completed for ${guest.full_name}`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to process checkout');
    } finally {
      setProcessing(false);
    }
  };

  const bill = calculateBill();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="font-medium">Loading guest details...</span>
        </div>
      </div>
    );
  }

  if (!guest) {
    return (
      <Card className="shadow-luxury border-0 max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DoorOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-800 mb-2">No Guest Selected</h2>
          <p className="text-slate-500 mb-4">Please select a guest from the dashboard to proceed with checkout.</p>
          <Button onClick={() => navigate('/')} variant="outline" className="border-amber-500/50 text-amber-700">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 font-serif">Guest Checkout</h1>
          <p className="text-slate-500 mt-1 font-sans">Process departure and generate bill</p>
        </div>
        <Badge variant="outline" className="pill-occupied text-base px-4 py-1">
          <Clock className="w-4 h-4 mr-2" />
          Check-out
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Info Card */}
          <Card className="shadow-luxury border-0">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xl font-serif text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Guest ID</Label>
                  <p className="font-mono text-sm text-slate-700 mt-1">{guest.guest_id}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Full Name</Label>
                  <p className="font-semibold text-slate-800 mt-1">{guest.full_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Room Number</Label>
                  <p className="font-bold text-amber-700 text-lg mt-1">Room {guest.room_number}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <Label className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Check-in Date
                  </Label>
                  <p className="text-sm text-slate-700 mt-1">
                    {new Date(guest.checkin_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Check-out Date
                  </Label>
                  <p className="text-sm text-slate-700 mt-1">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Duration</Label>
                  <p className="text-sm text-slate-700 mt-1">{bill.nights} night(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Charges */}
          <Card className="shadow-luxury border-0">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xl font-serif text-slate-800 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-600" />
                Additional Charges & Discounts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="additional" className="text-slate-700">Additional Charges (Rs.)</Label>
                  <Input
                    id="additional"
                    type="number"
                    placeholder="0.00"
                    value={additionalCharges}
                    onChange={(e) => setAdditionalCharges(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">Laundry, minibar, spa services, etc.</p>
                </div>
                <div>
                  <Label htmlFor="discount" className="text-slate-700">Discount (Rs.)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="0.00"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-slate-500 mt-1">Special offers or adjustments</p>
                </div>
              </div>
              <div>
                <Label htmlFor="notes" className="text-slate-700">Checkout Notes</Label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Any special notes about this checkout..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Summary */}
        <div className="space-y-6">
          <Card className="shadow-luxury border-0 sticky top-6">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="text-xl font-serif text-slate-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" />
                Bill Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Bill Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Room Charges ({bill.nights} nights)</span>
                  <span className="font-medium text-slate-800">Rs. {bill.roomCharges.toLocaleString()}</span>
                </div>
                {bill.additionalCharges > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Additional Charges</span>
                    <span className="font-medium text-slate-800">Rs. {bill.additionalCharges.toLocaleString()}</span>
                  </div>
                )}
                {bill.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Discount</span>
                    <span className="font-medium text-emerald-600">- Rs. {bill.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (13%)</span>
                  <span className="font-medium text-slate-800">Rs. {bill.tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t-2 border-amber-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-serif font-bold text-slate-800">Total Amount</span>
                  <span className="text-2xl font-bold font-serif text-amber-700">
                    Rs. {bill.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment to be collected at checkout</span>
                </div>
              </div>

              {/* Gold CTA Button */}
              <Button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full btn-gold py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                {processing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete Checkout
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-slate-500">
                This will mark the guest as checked out and make the room available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LuxuryCheckoutForm;
