/*
  # Create guests table for guest house management

  1. New Tables
    - `guests`
      - `id` (uuid, primary key) - Internal database ID
      - `guest_id` (text, unique) - Public-facing guest ID (e.g., GH-2024-0001)
      - `full_name` (text) - Guest's full name
      - `phone` (text) - Contact phone number
      - `email` (text) - Email address
      - `address` (text) - Street address
      - `city` (text) - City name
      - `country` (text) - Country name
      - `id_type` (text) - Type of ID (Passport, Citizenship, Driving License)
      - `id_number` (text) - ID document number
      - `room_number` (integer) - Assigned room number
      - `num_guests` (integer) - Number of guests in the booking
      - `purpose` (text) - Purpose of visit (tourism, business, other)
      - `notes` (text) - Special requests or notes
      - `checkin_date` (timestamptz) - Check-in date and time
      - `expected_checkout` (timestamptz) - Expected checkout date
      - `status` (text) - Guest status (checked-in, checked-out, upcoming)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `guests` table
    - Add policy for authenticated users to read all guests
    - Add policy for authenticated users to insert new guests
    - Add policy for authenticated users to update guests
*/

CREATE TABLE IF NOT EXISTS guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  email text,
  address text,
  city text,
  country text,
  id_type text,
  id_number text,
  room_number integer NOT NULL,
  num_guests integer DEFAULT 1,
  purpose text,
  notes text,
  checkin_date timestamptz NOT NULL,
  expected_checkout timestamptz NOT NULL,
  status text DEFAULT 'checked-in',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read guests"
  ON guests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert guests"
  ON guests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update guests"
  ON guests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete guests"
  ON guests
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_guests_guest_id ON guests(guest_id);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_guests_room_number ON guests(room_number);
CREATE INDEX IF NOT EXISTS idx_guests_checkin_date ON guests(checkin_date);
