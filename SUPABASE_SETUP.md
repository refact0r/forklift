# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key from the project settings

## 2. Configure Environment Variables

Update your `.env` file with your actual Supabase credentials:

```bash
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Enable GitHub OAuth in Supabase

1. In your Supabase dashboard, go to Authentication > Settings
2. Find the "Auth Providers" section
3. Enable GitHub OAuth
4. You'll need to:
   - Create a GitHub OAuth App in your GitHub settings
   - Add the GitHub Client ID and Client Secret to Supabase
   - Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

## 4. GitHub OAuth App Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: "Forklift"
   - Homepage URL: `http://localhost:5173` (or your domain)
   - Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to your Supabase Auth settings

## 5. Test the Integration

Once configured, users will be able to:
- Click "Sign in with GitHub" in the top navigation
- Be redirected to GitHub for authorization
- Return to your app logged in
- See their GitHub username in the navigation
- Sign out using the sign out button

## Features Implemented

- ✅ GitHub OAuth login/logout
- ✅ User state management with Svelte 5 runes
- ✅ Persistent authentication across page reloads
- ✅ Clean UI integration in the navigation bar
- 🔄 Ready for user data storage (repositories viewed, languages, etc.)

## Database Schema (Future)

When you're ready to store user data, you can create tables like:

```sql
-- User preferences
create table user_preferences (
  id uuid references auth.users on delete cascade,
  familiar_languages text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Viewed repositories
create table user_viewed_repos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  repo_owner text not null,
  repo_name text not null,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, repo_owner, repo_name)
);
```