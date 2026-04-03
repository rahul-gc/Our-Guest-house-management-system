# New Chitwan Guest House - Backend Setup Instructions

## Database & Authentication Setup Complete

Your guest house management system now has a complete Supabase backend with:

- ✅ Database schema created (guests, checkouts, rooms tables)
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Authentication system integrated
- ✅ Auto-generated Guest IDs (GH-YYYY-NNNN format)
- ✅ All 23 rooms pre-populated in database
- ✅ Service layer for database operations
- ✅ New pages integrated with Supabase

## What's Already Done

### Database Tables Created:

1. **guests** - Stores all guest information permanently
   - Auto-generated guest IDs (GH-2024-0001, GH-2024-0002, etc.)
   - Full guest details (name, contact, address, ID documents)
   - Check-in and checkout dates
   - Room assignments
   - Status tracking (checked-in, checked-out, upcoming)

2. **checkouts** - Permanent checkout records
   - Links to guest records
   - Billing information
   - Payment details
   - Stay duration

3. **rooms** - Room inventory and status
   - All 23 rooms pre-loaded
   - Pricing per room type
   - Real-time status tracking

### Features Implemented:

- ✅ Guest registration with auto-generated IDs
- ✅ Guest search and history
- ✅ Checkout with billing calculation
- ✅ Admin dashboard with statistics
- ✅ Reports with date filtering
- ✅ Export to CSV functionality
- ✅ Data persistence (never deleted on logout)
- ✅ Secure authentication via Supabase

## Environment Variables Required

Your `.env` file needs these Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Creating Your First Admin User

Since we're now using Supabase Authentication, you need to create an admin user in your Supabase dashboard:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add user** > **Create new user**
4. Enter:
   - Email: `admin@newchitwan.com` (or your preferred email)
   - Password: Your secure password
   - Confirm password
5. After creating, click on the user to edit
6. Scroll to **User Metadata** section
7. Add this metadata:
   ```json
   {
     "role": "admin"
   }
   ```
8. Click **Save**

### Option 2: Using Supabase SQL Editor

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin user (replace with your email/password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@newchitwan.com',
  crypt('YourSecurePassword123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  now(),
  now(),
  '',
  ''
);
```

## How to Login

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Enter your admin email and password
4. You're now logged in and can access all features

## Database Features

### Guest ID Generation
- Automatic format: `GH-YYYY-NNNN`
- Example: `GH-2024-0001`, `GH-2024-0002`
- Year updates automatically
- Sequential numbering per year

### Data Persistence
- All guest data is PERMANENT
- Logout only clears the session
- Guest records are never auto-deleted
- Complete historical data maintained

### Security
- Row Level Security (RLS) enabled on all tables
- Only authenticated users can access data
- Secure password authentication via Supabase
- Session management handled automatically

## API Structure

### Services Available:

1. **guestService** (`/src/services/guestService.ts`)
   - `createGuest()` - Register new guest
   - `searchGuests()` - Search by any field
   - `getGuestsByStatus()` - Filter by status
   - `getGuestHistory()` - Guest visit history
   - And more...

2. **checkoutService** (`/src/services/checkoutService.ts`)
   - `createCheckout()` - Process checkout
   - `getTotalRevenue()` - Calculate revenue
   - `getTodayCheckouts()` - Today's checkouts
   - And more...

3. **roomService** (`/src/services/roomService.ts`)
   - `getAllRooms()` - Get all rooms
   - `getAvailableRooms()` - Available rooms only
   - `syncRoomStatus()` - Sync room availability
   - And more...

## Pages Implemented

### For All Users:
- **Dashboard** - Statistics and today's activity
- **Room Status** - Visual room availability
- **Guest Entry** - Complete registration form
- **Checkout** - Billing and payment processing
- **Records** - Search all guest records

### Admin Only:
- **Reports** - Analytics, revenue, export to CSV

## Testing the System

1. **Create a Test Guest:**
   - Go to Guest Entry
   - Fill in guest details
   - Select available room
   - Submit to check-in

2. **Search Records:**
   - Go to Records
   - Search by name, guest ID, phone, etc.
   - View complete guest history

3. **Process Checkout:**
   - Go to Checkout
   - Select checked-in guest
   - Add any extra charges
   - Complete checkout

4. **View Reports:**
   - Go to Reports (admin only)
   - Set date range
   - View statistics
   - Export to CSV

## Important Notes

- The old in-memory context system is still present but the new pages use Supabase
- No data is lost on logout - everything persists in the database
- Guest IDs are unique and auto-generated
- All dates are stored in ISO format for consistency
- Room statuses sync automatically with bookings

## Troubleshooting

### Can't Login?
- Verify your Supabase credentials in `.env`
- Check that you've created an admin user
- Ensure email is confirmed in Supabase dashboard

### Database Errors?
- Check Supabase project is active
- Verify RLS policies are enabled
- Check browser console for specific errors

### Data Not Showing?
- Ensure you're logged in as authenticated user
- Check network tab for API calls
- Verify Supabase project URL is correct

## Next Steps

Your backend is fully functional! You can now:

1. Create your admin user in Supabase
2. Start the dev server
3. Login and start managing guests
4. All data persists permanently in Supabase

For production deployment, make sure to:
- Use environment variables for Supabase credentials
- Set up proper backup procedures
- Configure Supabase security settings
- Set up email templates for auth (optional)

---

**Need Help?** Check the Supabase documentation at https://supabase.com/docs
