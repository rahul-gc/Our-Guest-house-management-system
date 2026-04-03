import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { guestService, type Guest } from '@/services/guestService';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const RecordsNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadGuests();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [guests, searchQuery, statusFilter]);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const allGuests = await guestService.getAllGuests();
      setGuests(allGuests);
    } catch (error) {
      console.error('Error loading guests:', error);
      toast.error('Failed to load guest records');
    } finally {
      setLoading(false);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(g => g.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(g =>
        g.full_name.toLowerCase().includes(query) ||
        g.guest_id.toLowerCase().includes(query) ||
        g.phone?.toLowerCase().includes(query) ||
        g.email?.toLowerCase().includes(query) ||
        g.id_number?.toLowerCase().includes(query) ||
        g.room_number.toString().includes(query)
      );
    }

    setFilteredGuests(filtered);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadGuests();
      return;
    }

    setLoading(true);
    try {
      const results = await guestService.searchGuests(searchQuery);
      setGuests(results);
    } catch (error) {
      console.error('Error searching guests:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Guest Records</h1>
        <p className="text-muted-foreground mt-1">Search and view guest history</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, guest ID, phone, email, ID number, or room..."
              disabled={loading}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All ({guests.length})
          </Button>
          <Button
            variant={statusFilter === 'checked-in' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('checked-in')}
            size="sm"
          >
            Checked In ({guests.filter(g => g.status === 'checked-in').length})
          </Button>
          <Button
            variant={statusFilter === 'checked-out' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('checked-out')}
            size="sm"
          >
            Checked Out ({guests.filter(g => g.status === 'checked-out').length})
          </Button>
        </div>
      </div>

      {loading && guests.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">Loading guest records...</p>
          </CardContent>
        </Card>
      ) : filteredGuests.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              {guests.length === 0 ? 'No guest records yet' : 'No records match your search'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredGuests.map(guest => (
            <Card key={guest.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-foreground">{guest.full_name}</p>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          guest.status === 'checked-in'
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {guest.status === 'checked-in' ? 'Active' : 'Checked Out'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                      <p>Guest ID: {guest.guest_id}</p>
                      <p>Room: {guest.room_number}</p>
                      {guest.phone && <p>Phone: {guest.phone}</p>}
                      {guest.email && <p>Email: {guest.email}</p>}
                      {guest.id_type && guest.id_number && (
                        <p>
                          {guest.id_type}: {guest.id_number}
                        </p>
                      )}
                      <p>Check-in: {new Date(guest.checkin_date).toLocaleDateString()}</p>
                      {guest.city && <p>City: {guest.city}</p>}
                      {guest.country && <p>Country: {guest.country}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordsNew;
