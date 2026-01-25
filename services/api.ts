/**
 * Service API de base pour les appels HTTP
 */

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  }
}


