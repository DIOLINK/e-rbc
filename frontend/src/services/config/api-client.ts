import { API_CONFIG } from './api-config.ts';
import type { ApiClientConfig } from './api-config.ts';

type RequestConfig = RequestInit & { url: string; timeout?: number };

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseUrl = config?.baseUrl ?? API_CONFIG.BASE_URL;
    this.defaultHeaders = config?.headers ?? API_CONFIG.DEFAULT_HEADERS;
    this.timeout = config?.timeout ?? API_CONFIG.TIMEOUT_MS;
  }

  protected async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.execute<T>(path, { ...init, method: 'GET' });
  }

  protected async post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    return this.execute<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) });
  }

  protected async put<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
    return this.execute<T>(path, { ...init, method: 'PUT', body: JSON.stringify(body) });
  }

  protected async httpDelete(path: string, init?: RequestInit): Promise<void> {
    await this.execute(path, { ...init, method: 'DELETE' });
  }

  private applyRequestInterceptors(config: RequestConfig): RequestConfig {
    return {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...(config.headers as Record<string, string> | undefined),
      },
    };
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        error: response.statusText,
        message: body.message ?? `Error ${response.status}`,
        details: body.details ?? null,
        timestamp: body.timestamp ?? null,
      };
    }
    return response;
  }

  private applyErrorInterceptor(error: unknown): never {
    if (error instanceof TypeError) {
      throw {
        status: 0,
        error: 'Network Error',
        message: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
        details: null,
        timestamp: null,
      };
    }
    throw error;
  }

  private async execute<T>(path: string, init: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const reqConfig = this.applyRequestInterceptors({ ...init, url });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: reqConfig.method,
        headers: reqConfig.headers,
        body: reqConfig.body,
        signal: controller.signal,
      });

      const processed = await this.applyResponseInterceptors(response);

      if (processed.status === 204) {
        return undefined as T;
      }

      return processed.json() as Promise<T>;
    } catch (error) {
      this.applyErrorInterceptor(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
