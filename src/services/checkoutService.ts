import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { guestService } from './guestService';

export type Checkout = Tables<'checkouts'>;
export type CheckoutInsert = TablesInsert<'checkouts'>;

export const checkoutService = {
  async createCheckout(checkout: CheckoutInsert): Promise<Checkout> {
    const { data, error } = await supabase
      .from('checkouts')
      .insert(checkout)
      .select()
      .single();

    if (error) throw error;

    if (checkout.guest_uuid) {
      await guestService.updateGuest(checkout.guest_uuid, {
        status: 'checked-out',
      });
    }

    return data;
  },

  async getCheckout(id: string): Promise<Checkout | null> {
    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCheckoutsByGuestId(guestId: string): Promise<Checkout[]> {
    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .eq('guest_id', guestId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllCheckouts(): Promise<Checkout[]> {
    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTodayCheckouts(): Promise<Checkout[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .gte('actual_checkout', today.toISOString())
      .lt('actual_checkout', tomorrow.toISOString())
      .order('actual_checkout', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getCheckoutsByDateRange(startDate: Date, endDate: Date): Promise<Checkout[]> {
    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .gte('actual_checkout', startDate.toISOString())
      .lte('actual_checkout', endDate.toISOString())
      .order('actual_checkout', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    let query = supabase
      .from('checkouts')
      .select('total_amount');

    if (startDate) {
      query = query.gte('actual_checkout', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('actual_checkout', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.reduce((sum, checkout) => sum + Number(checkout.total_amount), 0) || 0;
  },

  async getPendingPayments(): Promise<Checkout[]> {
    const { data, error } = await supabase
      .from('checkouts')
      .select('*')
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
