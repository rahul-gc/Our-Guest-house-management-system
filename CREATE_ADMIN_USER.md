# Creating Your First Admin User

## Quick Setup Guide

Your backend is ready, but you need to create an admin user to login. Here's how:

---

## Method 1: Supabase Dashboard (EASIEST)

### Step 1: Go to Authentication

1. Open your Supabase project dashboard
2. Click **Authentication** in the left sidebar
3. Click **Users** tab

### Step 2: Add New User

1. Click the **Add user** button (top right)
2. Select **Create new user**
3. Fill in the form:
   - **Email:** `admin@newchitwan.com` (or your preferred email)
   - **Password:** Create a strong password
   - **Auto Confirm User:** ✅ Check this box
4. Click **Create user**

### Step 3: Set Admin Role

1. In the users list, find the user you just created
2. Click on the user's email to open details
3. Scroll down to **Raw User Meta Data** section
4. Click **Edit** (pencil icon)
5. Replace the content with:
   ```json
   {
     "role": "admin"
   }
   ```
6. Click **Save**

### Done! You can now login with:
- Email: `admin@newchitwan.com`
- Password: (the password you set)

---

## Method 2: SQL Editor (ADVANCED)

If you prefer SQL, use this method:

### Step 1: Open SQL Editor

1. In your Supabase dashboard, click **SQL Editor**
2. Click **New query**

### Step 2: Run This SQL

```sql
-- Insert admin user
-- IMPORTANT: Replace the email and password with your values
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@newchitwan.com',  -- ⬅️ CHANGE THIS EMAIL
  crypt('YourPassword123', gen_salt('bf')),  -- ⬅️ CHANGE THIS PASSWORD
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@newchitwan.com'  -- ⬅️ MATCH EMAIL HERE
);

-- Also insert identity
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@newchitwan.com'),  -- ⬅️ MATCH EMAIL
  format('{"sub":"%s","email":"%s"}',
    (SELECT id FROM auth.users WHERE email = 'admin@newchitwan.com')::text,
    'admin@newchitwan.com'
  )::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@newchitwan.com'  -- ⬅️ MATCH EMAIL
)
AND NOT EXISTS (
  SELECT 1 FROM auth.identities
  WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@newchitwan.com')
);
```

### Step 3: Run the Query

1. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
2. You should see "Success. No rows returned"

---

## Creating Additional Users

### Staff User (Non-Admin)

Use the same process but change the metadata to:

```json
{
  "role": "staff"
}
```

Staff users have limited access:
- ✅ Can view dashboard
- ✅ Can register guests
- ✅ Can process checkouts
- ✅ Can search records
- ❌ Cannot view reports (admin only)

---

## Verifying Your Admin User

### Test the Login

1. Start your application: `npm run dev`
2. Go to the login page
3. Enter your admin email and password
4. Click **Login**

### You Should See:

- Dashboard loads successfully
- "Admin" role indicator in sidebar
- "Reports" menu item visible
- All features accessible

---

## Troubleshooting

### "Invalid login credentials"

**Possible causes:**
- Wrong email or password
- User not created successfully
- Email not confirmed

**Solutions:**
1. Go to Supabase Dashboard > Authentication > Users
2. Verify the user exists
3. Check the email is correct
4. Make sure "Email Confirmed At" has a date
5. If not, click user → Edit → Check "Email Confirmed"

### "Role not set correctly"

**Symptoms:**
- Can login but "Reports" menu not showing
- Shows as "staff" instead of "admin"

**Solution:**
1. Go to Supabase Dashboard > Authentication > Users
2. Click on your user
3. Edit Raw User Meta Data
4. Ensure it contains: `{"role": "admin"}`
5. Save changes
6. Logout and login again

### "Cannot read properties of null"

**Problem:** User metadata not set

**Solution:**
- Make sure you set the metadata in Step 3
- The metadata field must not be empty
- Must be valid JSON format

---

## Password Requirements

For security, use a strong password:
- At least 8 characters
- Mix of uppercase and lowercase
- Include numbers
- Include special characters

Example strong passwords:
- `NewChitwan2024!`
- `Admin@GuestHouse123`
- `Secure#Password99`

---

## Multiple Admin Users

You can create multiple admin accounts:

1. Follow the same process for each
2. Use different emails
3. Set `"role": "admin"` for each
4. Each admin has full access

---

## Security Best Practices

1. **Never share admin credentials**
2. **Use unique passwords for each user**
3. **Don't use simple passwords** like "admin123"
4. **Change default passwords** after first login
5. **Limit admin accounts** to necessary personnel only

---

## What's Next?

Once your admin user is created:

1. ✅ Login to the system
2. ✅ Start registering guests
3. ✅ Process checkouts
4. ✅ View reports
5. ✅ Manage your guest house!

All your data is now permanently stored in Supabase and will never be lost.
