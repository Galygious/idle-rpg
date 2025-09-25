import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  class: string;
  level: number;
  experience: number;
  stats: {
    strength: number;
    dexterity: number;
    intelligence: number;
    vitality: number;
    availablePoints: number;
  };
  equipment: Record<string, string>;
  skills: Record<string, any>;
  createdAt: string;
  lastActive: string;
}

export interface GameState {
  character: Character;
  combat: {
    characterId: string;
    currentArea: string;
    currentMonster?: any;
    isActive: boolean;
    startTime: string;
    lastUpdate: string;
    totalDamageDealt: number;
    totalDamageReceived: number;
    monstersKilled: number;
    experienceGained: number;
  };
  inventory: any[];
  currencies: Array<{ type: string; amount: number }>;
  achievements: any[];
  settings: {
    combatSpeed: number;
    autoAdvance: boolean;
    autoLoot: boolean;
    autoSell: boolean;
    notifications: boolean;
    soundEnabled: boolean;
    musicEnabled: boolean;
  };
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      this.setAuthToken(this.token);
    }

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
    this.api.defaults.headers.Authorization = `Bearer ${token}`;
  }

  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    delete this.api.defaults.headers.Authorization;
  }

  logout() {
    this.clearAuthToken();
    window.location.href = '/login';
  }

  // User API methods
  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await this.api.post('/users/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await this.api.post('/users/login', data);
    return response.data;
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = 
      await this.api.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = 
      await this.api.put('/users/profile', data);
    return response.data;
  }

  // Character API methods
  async getCharacters(): Promise<ApiResponse<Character[]>> {
    const response: AxiosResponse<ApiResponse<Character[]>> = 
      await this.api.get('/characters');
    return response.data;
  }

  async createCharacter(data: { name: string; class: string }): Promise<ApiResponse<Character>> {
    const response: AxiosResponse<ApiResponse<Character>> = 
      await this.api.post('/characters', data);
    return response.data;
  }

  async getCharacter(id: string): Promise<ApiResponse<Character>> {
    const response: AxiosResponse<ApiResponse<Character>> = 
      await this.api.get(`/characters/${id}`);
    return response.data;
  }

  async updateCharacter(id: string, data: Partial<Character>): Promise<ApiResponse<Character>> {
    const response: AxiosResponse<ApiResponse<Character>> = 
      await this.api.put(`/characters/${id}`, data);
    return response.data;
  }

  async deleteCharacter(id: string): Promise<ApiResponse<void>> {
    const response: AxiosResponse<ApiResponse<void>> = 
      await this.api.delete(`/characters/${id}`);
    return response.data;
  }

  // Game API methods
  async getGameState(characterId: string): Promise<ApiResponse<GameState>> {
    const response: AxiosResponse<ApiResponse<GameState>> = 
      await this.api.get(`/game/${characterId}/state`);
    return response.data;
  }

  async performGameAction(characterId: string, action: string, data?: any): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = 
      await this.api.post(`/game/${characterId}/action`, { action, data });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = 
      await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;