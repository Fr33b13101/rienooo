import demoData from '../data/demoData.json';
import { User, DashboardSummary, ChartData, Category, Entry, DebtCredit } from '../types';

export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true';
};

export const getDemoUser = (): User => {
  return demoData.user as User;
};

export const getDemoSummary = (): DashboardSummary => {
  return demoData.summary as DashboardSummary;
};

export const getDemoRevenueData = (): ChartData[] => {
  return demoData.dailyRevenue as ChartData[];
};

export const getDemoMonthlyData = () => {
  return demoData.monthlyData;
};

export const getDemoCategoryData = () => {
  return demoData.categories;
};

export const getDemoEntries = (): Entry[] => {
  return demoData.entries as Entry[];
};

export const getDemoCategories = (): Category[] => {
  return demoData.categories_list as Category[];
};

export const getDemoDebtsCredits = (): DebtCredit[] => {
  return demoData.debtsCredits as DebtCredit[];
};

// Simulate API delay for realistic demo experience
export const simulateApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Demo API responses
export const demoApiResponses = {
  login: async (email: string, password: string) => {
    await simulateApiDelay(800);
    if (email === 'demo@rieno.app' || email.includes('demo')) {
      return {
        success: true,
        data: {
          user: getDemoUser()
        }
      };
    }
    throw new Error('Invalid demo credentials');
  },

  signup: async (email: string, password: string, firstName?: string, lastName?: string) => {
    await simulateApiDelay(1000);
    return {
      success: true,
      data: {
        user: getDemoUser()
      }
    };
  },

  getCurrentUser: async () => {
    await simulateApiDelay(300);
    return {
      success: true,
      data: getDemoUser()
    };
  },

  logout: async () => {
    await simulateApiDelay(200);
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
};