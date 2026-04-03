/*
  # Create rooms table for room management

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key) - Internal database ID
      - `room_number` (integer, unique) - Room number
      - `room_type` (text) - Type of room
      - `price_per_night` (decimal) - Price per night
      - `status` (text) - Room status (available, occupied, reserved)
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `rooms` table
    - Add policies for authenticated users to manage rooms

  3. Initial Data
    - Populate rooms table with the 23 rooms from the existing configuration
*/

CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number integer UNIQUE NOT NULL,
  room_type text NOT NULL,
  price_per_night decimal(10,2) NOT NULL,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert rooms"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update rooms"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete rooms"
  ON rooms
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

-- Insert the 23 rooms from the existing configuration
INSERT INTO rooms (room_number, room_type, price_per_night, status) VALUES
  (1, 'non-attached', 600, 'available'),
  (2, 'attached-double-single', 1000, 'available'),
  (3, 'attached-double-single', 1000, 'available'),
  (4, 'attached-double-single', 1000, 'available'),
  (5, 'non-attached', 600, 'available'),
  (6, 'non-attached', 600, 'reserved'),
  (7, 'attached-2bed', 800, 'available'),
  (8, 'non-attached', 600, 'available'),
  (9, 'attached-double-single', 1000, 'available'),
  (10, 'attached-double-single', 1000, 'available'),
  (11, 'attached-double-single', 1000, 'available'),
  (12, 'non-attached', 600, 'available'),
  (13, 'non-attached', 600, 'available'),
  (14, 'attached-2bed', 800, 'available'),
  (15, 'non-attached', 600, 'available'),
  (16, 'attached-double-single', 1000, 'available'),
  (17, 'attached-double-single', 1000, 'available'),
  (18, 'attached-double-single', 1000, 'available'),
  (19, 'attached-double-single', 1000, 'available'),
  (20, '4-bed', 1500, 'available'),
  (21, 'non-attached', 600, 'available'),
  (22, 'attached-double-single', 1000, 'available'),
  (23, 'non-attached', 600, 'available')
ON CONFLICT (room_number) DO NOTHING;
