export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  checkingAuth: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'profit';
  color?: string;
  userId: string;
  createdAt: string;
}

export interface Entry {
  id: string;
  date: string;
  productOrService: string;
  revenue: number;
  cost: number;
  categoryId: string;
  notes?: string;
  userId: string;
  createdAt: string;
}

export interface UserEntry {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  userId: string;
  note?: string;
  createdAt: string;
  description?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'payable' | 'recievable';
  name: string;
  amount: number;
  reason: string;
  date: string;
  dueDate: string;
  status: 'unpaid' | 'paid';
  createdAt: string;
}

export interface DebtCredit {
  id: string;
  name: string;
  amount: number;
  reason: string;
  date: string;
  dueDate: string;
  status: 'paid' | 'unpaid';
  type: 'receivable' | 'payable';
  userId: string;
  createdAt: string;
}

export interface UsersInformation {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: string;
  currency: string;
}

export interface DailyStreak {
  id: string;
  userId: string;
  date: string;
  currentStreak: number;
  createdAt: string;
}

export interface Collaborator {
  id: string;
  userId: string;
  collaboratorEmail: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}

export interface DashboardSummary {
  totalRevenue: number;
  totalProfit: number;
  amountOwed: number;
  amountYouOwe: number;
  dailyStreak: number;
}

export interface ChartData {
  name: string;
  revenue: number;
  profit: number;
}

export interface CategoryTotal {
  category: string;
  value: number;
  color?: string;
}

export interface MonthlyComparison {
  month: string;
  revenue: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}