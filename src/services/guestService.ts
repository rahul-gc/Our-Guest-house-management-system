import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Guest = Tables<'guests'>;
export type GuestInsert = TablesInsert<'guests'>;
export type GuestUpdate = TablesUpdate<'guests'>;

export const guestService = {
  async generateGuestId(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_guest_id');
    if (error) throw error;
    return data;
  },

  async createGuest(guest: Omit<GuestInsert, 'guest_id'>): Promise<Guest> {
    const guestId = await this.generateGuestId();

    const { data, error } = await supabase
      .from('guests')
      .insert({ ...guest, guest_id: guestId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getGuest(id: string): Promise<Guest | null> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getGuestByGuestId(guestId: string): Promise<Guest | null> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('guest_id', guestId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async searchGuests(query: string): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%,guest_id.ilike.%${query}%,room_number.eq.${parseInt(query) || 0}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllGuests(): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getGuestsByStatus(status: string): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getGuestsByRoom(roomNumber: number): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('room_number', roomNumber)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getGuestHistory(phoneOrEmail: string): Promise<Guest[]> {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .or(`phone.eq.${phoneOrEmail},email.eq.${phoneOrEmail}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateGuest(id: string, updates: GuestUpdate): Promise<Guest> {
    const { data, error } = await supabase
      .from('guests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteGuest(id: string): Promise<void> {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getTodayCheckIns(): Promise<Guest[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .gte('checkin_date', today.toISOString())
      .lt('checkin_date', tomorrow.toISOString())
      .order('checkin_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUpcomingCheckouts(days: number = 7): Promise<Guest[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('status', 'checked-in')
      .gte('expected_checkout', today.toISOString())
      .lte('expected_checkout', futureDate.toISOString())
      .order('expected_checkout', { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
