/*
  # Initial Schema Setup for Rieno Financial Tracker

  1. Tables
    - `users` - Maps to auth.users for additional user data
    - `categories` - Stores income/expense categories
    - `entries` - Financial transactions (income and expenses)
    - `debts_credits` - Accounts receivable and payable
    - `daily_streaks` - Tracks consecutive days of app usage
    - `collaborators` - User collaboration settings

  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated access
    - Secure data by user ownership
*/

-- Users table to store additional user information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Categories table for income and expense categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Entries table for financial transactions
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  product_or_service TEXT NOT NULL,
  revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
  cost DECIMAL(12,2) NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own entries"
  ON entries
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Debts and Credits table for accounts receivable and payable
CREATE TABLE IF NOT EXISTS debts_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  reason TEXT NOT NULL,
  date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'unpaid')),
  type TEXT NOT NULL CHECK (type IN ('receivable', 'payable')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE debts_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own debts and credits"
  ON debts_credits
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily Streaks table to track consecutive days of usage
CREATE TABLE IF NOT EXISTS daily_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks"
  ON daily_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Collaborators table for team/role management
CREATE TABLE IF NOT EXISTS collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collaborator_email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, collaborator_email)
);

ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own collaborators"
  ON collaborators
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create functions and triggers for streak tracking
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_streak RECORD;
  last_date DATE;
BEGIN
  -- Get the user's last streak record
  SELECT * INTO last_streak FROM daily_streaks
  WHERE user_id = NEW.user_id
  ORDER BY date DESC
  LIMIT 1;
  
  -- If there's a previous streak
  IF FOUND THEN
    last_date := last_streak.date;
    
    -- If the new entry is for the next day, increment streak
    IF NEW.date = last_date + 1 THEN
      NEW.current_streak := last_streak.current_streak + 1;
    -- If it's the same day, use the same streak count
    ELSIF NEW.date = last_date THEN
      NEW.current_streak := last_streak.current_streak;
    -- Otherwise reset to 1
    ELSE
      NEW.current_streak := 1;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_streak
BEFORE INSERT ON daily_streaks
FOR EACH ROW
EXECUTE FUNCTION update_streak();