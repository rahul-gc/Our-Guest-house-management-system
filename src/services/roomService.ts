import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';
import { guestService } from './guestService';

export type Room = Tables<'rooms'>;
export type RoomUpdate = TablesUpdate<'rooms'>;

export const roomService = {
  async getAllRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getRoom(roomNumber: number): Promise<Room | null> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_number', roomNumber)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateRoom(roomNumber: number, updates: RoomUpdate): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('room_number', roomNumber)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAvailableRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'available')
      .order('room_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getOccupiedRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('status', 'occupied')
      .order('room_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async syncRoomStatus(): Promise<void> {
    const rooms = await this.getAllRooms();

    for (const room of rooms) {
      if (room.status === 'reserved') continue;

      const activeGuests = await guestService.getGuestsByRoom(room.room_number);
      const hasActiveGuest = activeGuests.some(g => g.status === 'checked-in');

      const newStatus = hasActiveGuest ? 'occupied' : 'available';

      if (room.status !== newStatus) {
        await this.updateRoom(room.room_number, { status: newStatus });
      }
    }
  },

  async getRoomOccupancyRate(startDate?: Date, endDate?: Date): Promise<number> {
    const rooms = await this.getAllRooms();
    const totalRooms = rooms.filter(r => r.status !== 'reserved').length;

    if (totalRooms === 0) return 0;

    let query = supabase
      .from('guests')
      .select('*')
      .eq('status', 'checked-in');

    if (startDate) {
      query = query.gte('checkin_date', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('checkin_date', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    const occupiedRooms = data?.length || 0;
    return (occupiedRooms / totalRooms) * 100;
  },
};
