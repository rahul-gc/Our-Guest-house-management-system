/*
  # Create checkouts table for guest checkout records

  1. New Tables
    - `checkouts`
      - `id` (uuid, primary key) - Internal database ID
      - `guest_id` (text) - Reference to the guest's public ID
      - `guest_uuid` (uuid) - Foreign key to guests table
      - `actual_checkout` (timestamptz) - Actual checkout date and time
      - `nights_stayed` (integer) - Total nights stayed
      - `room_charge` (decimal) - Room charge per night
      - `extra_charges` (decimal) - Additional charges (food, laundry, etc.)
      - `total_amount` (decimal) - Total bill amount
      - `payment_method` (text) - Payment method (cash, card, online)
      - `payment_status` (text) - Payment status (paid, pending)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `checkouts` table
    - Add policies for authenticated users to manage checkouts
*/

CREATE TABLE IF NOT EXISTS checkouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id text NOT NULL,
  guest_uuid uuid REFERENCES guests(id) ON DELETE CASCADE,
  actual_checkout timestamptz NOT NULL,
  nights_stayed integer NOT NULL,
  room_charge decimal(10,2) NOT NULL DEFAULT 0,
  extra_charges decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL,
  payment_method text NOT NULL,
  payment_status text DEFAULT 'paid',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checkouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read checkouts"
  ON checkouts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert checkouts"
  ON checkouts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update checkouts"
  ON checkouts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete checkouts"
  ON checkouts
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_checkouts_guest_id ON checkouts(guest_id);
CREATE INDEX IF NOT EXISTS idx_checkouts_guest_uuid ON checkouts(guest_uuid);
CREATE INDEX IF NOT EXISTS idx_checkouts_created_at ON checkouts(created_at);
CREATE INDEX IF NOT EXISTS idx_checkouts_payment_status ON checkouts(payment_status);
