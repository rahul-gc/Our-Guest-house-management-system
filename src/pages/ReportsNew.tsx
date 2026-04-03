import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { guestService, type Guest } from '@/services/guestService';
import { checkoutService, type Checkout } from '@/services/checkoutService';
import { roomService } from '@/services/roomService';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

const ReportsNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [totalGuests, setTotalGuests] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [guestsByCountry, setGuestsByCountry] = useState<Record<string, number>>({});
  const [checkouts, setCheckouts] = useState<Checkout[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate + 'T23:59:59') : undefined;

      const [allGuests, allCheckouts, occupancy] = await Promise.all([
        guestService.getAllGuests(),
        checkoutService.getAllCheckouts(),
        roomService.getRoomOccupancyRate(start, end),
      ]);

      let filteredGuests = allGuests;
      let filteredCheckouts = allCheckouts;

      if (start) {
        filteredGuests = filteredGuests.filter(g => new Date(g.checkin_date) >= start);
        filteredCheckouts = filteredCheckouts.filter(c => new Date(c.actual_checkout) >= start);
      }
      if (end) {
        filteredGuests = filteredGuests.filter(g => new Date(g.checkin_date) <= end);
        filteredCheckouts = filteredCheckouts.filter(c => new Date(c.actual_checkout) <= end);
      }

      setGuests(filteredGuests);
      setCheckouts(filteredCheckouts);
      setTotalGuests(filteredGuests.length);
      setOccupancyRate(occupancy);

      const revenue = filteredCheckouts.reduce((sum, c) => sum + Number(c.total_amount), 0);
      setTotalRevenue(revenue);

      const countryCount: Record<string, number> = {};
      filteredGuests.forEach(g => {
        const country = g.country || 'Unknown';
        countryCount[country] = (countryCount[country] || 0) + 1;
      });
      setGuestsByCountry(countryCount);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Guest ID',
      'Name',
      'Phone',
      'Email',
      'Country',
      'Room',
      'Check-in',
      'Expected Checkout',
      'Status',
    ];

    const rows = guests.map(g => [
      g.guest_id,
      g.full_name,
      g.phone || '',
      g.email || '',
      g.country || '',
      g.room_number,
      new Date(g.checkin_date).toLocaleString(),
      new Date(g.expected_checkout).toLocaleString(),
      g.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const countryEntries = Object.entries(guestsByCountry).sort((a, b) => b[1] - a[1]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Guest and revenue analytics</p>
      </div>

      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-foreground">Report Filters</h3>
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">From Date</label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} disabled={loading} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">To Date</label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} disabled={loading} />
            </div>
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button onClick={exportToCSV} variant="outline" disabled={loading || guests.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">{totalGuests}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Guests</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">Rs. {totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">{occupancyRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground mt-1">Occupancy Rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-foreground">{checkouts.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Checkouts</p>
          </CardContent>
        </Card>
      </div>

      {countryEntries.length > 0 && (
        <Card className="border-0 shadow-md mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-foreground">Guests by Country</h3>
            <div className="space-y-3">
              {countryEntries.map(([country, count]) => (
                <div key={country} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-32 text-foreground">{country}</span>
                  <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all flex items-center px-3"
                      style={{
                        width: `${Math.min(100, (count / Math.max(...countryEntries.map(x => x[1]))) * 100)}%`,
                      }}
                    >
                      <span className="text-xs font-medium text-primary-foreground">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {checkouts.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-foreground">Recent Checkouts</h3>
            <div className="space-y-2">
              {checkouts.slice(0, 10).map(checkout => {
                const guest = guests.find(g => g.guest_id === checkout.guest_id);
                return (
                  <div
                    key={checkout.id}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{guest?.full_name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">
                        {checkout.guest_id} • {new Date(checkout.actual_checkout).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">Rs. {Number(checkout.total_amount).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{checkout.nights_stayed} nights</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsNew;
