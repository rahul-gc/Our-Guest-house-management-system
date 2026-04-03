/*
  # Create guest ID generation function

  1. Functions
    - `generate_guest_id()` - Generates unique guest IDs in format GH-YYYY-NNNN
      * Automatically increments based on existing guests
      * Format: GH-2024-0001, GH-2024-0002, etc.

  2. Notes
    - Uses current year in the ID format
    - Pads the sequence number with zeros to 4 digits
    - Ensures uniqueness across all guests
*/

CREATE OR REPLACE FUNCTION generate_guest_id()
RETURNS text AS $$
DECLARE
  current_year text;
  last_sequence integer;
  new_sequence text;
BEGIN
  -- Get current year
  current_year := to_char(now(), 'YYYY');
  
  -- Find the highest sequence number for current year
  SELECT COALESCE(MAX(
    CASE 
      WHEN guest_id ~ ('^GH-' || current_year || '-[0-9]{4}$')
      THEN CAST(substring(guest_id from 9 for 4) AS integer)
      ELSE 0
    END
  ), 0) INTO last_sequence
  FROM guests
  WHERE guest_id LIKE 'GH-' || current_year || '-%';
  
  -- Generate new sequence with padding
  new_sequence := lpad((last_sequence + 1)::text, 4, '0');
  
  -- Return formatted guest ID
  RETURN 'GH-' || current_year || '-' || new_sequence;
END;
$$ LANGUAGE plpgsql;
