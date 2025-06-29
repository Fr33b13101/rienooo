// API client for backend communication
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://inspiring-platypus-8b7479.netlify.app/api'
  : 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred',
      };
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
    return this.request<AuthResponse['user']>('/auth/me');
  }

  // Profile endpoints
  async getProfile(): Promise<ApiResponse> {
    return this.request('/profile');
  }

  // Transactions endpoints
  async getTransactions(): Promise<ApiResponse> {
    return this.request('/transactions');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { ApiResponse, LoginRequest, SignupRequest, AuthResponse };