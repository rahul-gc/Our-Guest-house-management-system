# Environment Variables Setup

## Required Environment Variables

Your application needs these Supabase credentials to work. Add them to your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
```

## How to Get These Values

### Step 1: Go to Your Supabase Project

1. Visit https://supabase.com
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Find Your Project URL

1. In your Supabase dashboard, click on **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. Under **Project URL**, copy the URL
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
4. Paste this as `VITE_SUPABASE_URL` in your `.env` file

### Step 3: Find Your Anon/Public Key

1. Still in **Settings** > **API**
2. Under **Project API keys**, find the `anon` `public` key
3. Click the copy icon to copy it
4. Paste this as `VITE_SUPABASE_PUBLISHABLE_KEY` in your `.env` file

## Example `.env` File

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://mqqxkknudeltheglznuh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcXhra251ZGVsdGhlZ2x6bnVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjMxNzIsImV4cCI6MjAyNTM5OTE3Mn0.example_key_here
```

**Note:** The example above is just for demonstration. Use YOUR actual values from YOUR Supabase project.

## Security Notes

- The `anon` key is safe to use in frontend code
- It's called "publishable" because it's meant to be public
- Row Level Security (RLS) protects your data even with this public key
- NEVER share your `service_role` key (it has admin access)

## After Adding Environment Variables

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Verify the connection:**
   - Open your browser console
   - Look for any Supabase connection errors
   - If you see them, double-check your environment variables

## Troubleshooting

### "Failed to fetch" or Connection Errors

**Problem:** Can't connect to Supabase

**Solutions:**
- Verify your `VITE_SUPABASE_URL` is correct
- Make sure it starts with `https://`
- Check that your Supabase project is active (not paused)

### "Invalid API Key" Errors

**Problem:** Authentication fails

**Solutions:**
- Verify your `VITE_SUPABASE_PUBLISHABLE_KEY` is the `anon public` key
- Make sure you copied the entire key (they're quite long)
- Check for any extra spaces or line breaks

### Environment Variables Not Loading

**Problem:** Application doesn't see the variables

**Solutions:**
- Make sure the file is named exactly `.env` (with the dot)
- Place it in the root of your project (same level as `package.json`)
- Restart your dev server after creating/editing `.env`
- Variables must start with `VITE_` to be accessible in Vite apps

## What Happens Next?

Once your `.env` file is set up correctly:

1. The application will connect to your Supabase database
2. All database operations will work
3. You can create an admin user and login
4. Guest data will be saved permanently to Supabase
5. All features will be fully functional

## Need Your Supabase Credentials?

If you don't have a Supabase project yet:

1. Go to https://supabase.com
2. Sign up for a free account
3. Create a new project
4. Wait for it to initialize (takes ~2 minutes)
5. Follow the steps above to get your credentials

Your database is already set up with all the tables and functions!
