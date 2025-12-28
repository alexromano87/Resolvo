// src/api/config.ts
// Configurazione centralizzata per le API

const metaEnv = typeof import.meta !== 'undefined' ? ((import.meta as any).env || {}) : {};
const nodeEnv = typeof process !== 'undefined' ? process.env || {} : {};
const env = { ...nodeEnv, ...metaEnv };

// Helper per leggere una variabile env in modo sicuro anche in contesti non Vite/DOM (es. Playwright)
const getEnv = (key: string) => env[key] || env[`VITE_${key}`];

function getApiBaseUrl(): string {
  // 1. Se definito in .env, usa quello (priorità massima)
  const explicit = getEnv('VITE_API_URL') || getEnv('API_URL');
  if (explicit) return explicit;

  // In contesti senza window (test E2E o SSR) torna un fallback sicuro
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  // 2. Rileva automaticamente in base all'hostname
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Localhost / Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  // Production - stesso dominio
  // Se frontend e backend sono sullo stesso server
  if (hostname === '3.120.81.201') {
    return `${protocol}//${hostname}:3000`;
  }

  // Production - dominio custom
  // Se hai un dominio tipo resolvo.com
  if (hostname.includes('resolvo')) {
    return `${protocol}//api.${hostname}`;
  }

  // Default fallback
  return 'http://localhost:3000';
}

export const API_BASE_URL = getApiBaseUrl();

// Debug: mostra in console quale URL viene usato (solo in development)
if (metaEnv.DEV) {
  console.log('🔧 API Base URL:', API_BASE_URL);
  console.log('🌍 Environment:', metaEnv.MODE);
}

/**
 * Classe per errori API con status code
 */
export class ApiError extends Error {
  public status: number;
  public data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Client HTTP centralizzato per tutte le chiamate API
 */
class ApiClient {
  private baseUrl = API_BASE_URL;

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `Errore ${response.status}`;
      let errorData: unknown;

      try {
        errorData = await response.json();
        if (typeof errorData === 'object' && errorData !== null) {
          const err = errorData as { message?: string | string[] };
          if (Array.isArray(err.message)) {
            errorMessage = err.message.join(', ');
          } else if (err.message) {
            errorMessage = err.message;
          }
        }
      } catch {
        errorMessage = await response.text();
      }

      throw new ApiError(response.status, errorMessage, errorData);
    }

    // Se 204 No Content, ritorna null
    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

// Istanza singleton
export const api = new ApiClient();
