import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

export interface JwtSession<TUser = unknown> {
  accessToken: string;
  tokenType?: string;
  expiresAt?: number;
  user?: TUser;
}

export interface BaseApiConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
  authStorageKey?: string;
}

type JwtResponseShape<TUser = unknown> = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  user?: TUser;
};

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/api';
const DEFAULT_AUTH_STORAGE_KEY = 'ams.auth.session';

export abstract class BaseApi {
  private static authStorageKey = DEFAULT_AUTH_STORAGE_KEY;
  private static memorySession: JwtSession | null = null;

  protected readonly http: AxiosInstance;

  protected constructor(config: BaseApiConfig = {}) {
    if (config.authStorageKey) {
      BaseApi.setAuthStorageKey(config.authStorageKey);
    }

    this.http = axios.create({
      baseURL: config.baseURL ?? DEFAULT_BASE_URL,
      timeout: config.timeout ?? 15000,
      withCredentials: config.withCredentials ?? false,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Tenant-Host': this.getTenantHost(),
        ...config.headers,
      },
    });

    this.http.interceptors.request.use((requestConfig) => this.attachAuthorizationHeader(requestConfig));
    this.http.interceptors.response.use((response) => this.captureSession(response));
  }

  public static setAuthStorageKey(storageKey: string): void {
    BaseApi.authStorageKey = storageKey;
  }

  public static getAuthStorageKey(): string {
    return BaseApi.authStorageKey;
  }

  public static getSession<TUser = unknown>(): JwtSession<TUser> | null {
    const storage = BaseApi.getStorage();
    const rawSession = storage?.getItem(BaseApi.authStorageKey);

    if (!rawSession) {
      const session = BaseApi.memorySession as JwtSession<TUser> | null;
      if (session?.expiresAt && session.expiresAt <= Date.now()) {
        BaseApi.clearSession();
        return null;
      }

      return session;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as JwtSession<TUser>;
      if (parsedSession.expiresAt && parsedSession.expiresAt <= Date.now()) {
        BaseApi.clearSession();
        return null;
      }

      BaseApi.memorySession = parsedSession;
      return parsedSession;
    } catch {
      storage?.removeItem(BaseApi.authStorageKey);
      BaseApi.memorySession = null;
      return null;
    }
  }

  public static setSession<TUser = unknown>(session: JwtSession<TUser> | null): void {
    BaseApi.memorySession = session;

    const storage = BaseApi.getStorage();
    if (!storage) {
      return;
    }

    if (!session) {
      storage.removeItem(BaseApi.authStorageKey);
      return;
    }

    storage.setItem(BaseApi.authStorageKey, JSON.stringify(session));
  }

  public static getToken(): string | null {
    return BaseApi.getSession()?.accessToken ?? null;
  }

  public static setToken(accessToken: string, tokenType = 'Bearer'): void {
    const existingSession = BaseApi.getSession();

    BaseApi.setSession({
      ...existingSession,
      accessToken,
      tokenType,
    });
  }

  public static clearSession(): void {
    BaseApi.setSession(null);
  }

  protected setBaseUrl(baseURL: string): void {
    this.http.defaults.baseURL = baseURL;
  }

  protected setHeader(name: string, value: string): void {
    this.http.defaults.headers.common[name] = value;
  }

  protected removeHeader(name: string): void {
    delete this.http.defaults.headers.common[name];
  }

  protected async get<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.request<TResponse>({
      ...config,
      method: 'GET',
      url,
    });
  }

  protected async post<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TPayload>
  ): Promise<TResponse> {
    return this.request<TResponse>({
      ...config,
      method: 'POST',
      url,
      data: payload,
    });
  }

  protected async put<TResponse, TPayload = unknown>(
    url: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TPayload>
  ): Promise<TResponse> {
    return this.request<TResponse>({
      ...config,
      method: 'PUT',
      url,
      data: payload,
    });
  }

  protected async delete<TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.request<TResponse>({
      ...config,
      method: 'DELETE',
      url,
    });
  }

  protected async request<TResponse>(config: AxiosRequestConfig): Promise<TResponse> {
    const response = await this.http.request<TResponse>(config);
    return response.data;
  }

  protected storeSession<TUser = unknown>(session: JwtSession<TUser> | null): void {
    BaseApi.setSession(session);
  }

  protected getStoredSession<TUser = unknown>(): JwtSession<TUser> | null {
    return BaseApi.getSession<TUser>();
  }

  protected getStoredToken(): string | null {
    return BaseApi.getToken();
  }

  protected clearStoredSession(): void {
    BaseApi.clearSession();
  }

  private getTenantHost(): string {
    return window.location.hostname;
  }


  private attachAuthorizationHeader(
    requestConfig: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const session = BaseApi.getSession();
    if (!session?.accessToken) {
      return requestConfig;
    }

    const headers = AxiosHeaders.from(requestConfig.headers);
    if (!headers.has('Authorization')) {
      const tokenType = session.tokenType ?? 'Bearer';
      headers.set('Authorization', `${tokenType} ${session.accessToken}`);
    }

    requestConfig.headers = headers;
    return requestConfig;
  }

  private captureSession<TResponse>(response: AxiosResponse<TResponse>): AxiosResponse<TResponse> {
    const session = BaseApi.extractSession(response);
    if (session) {
      BaseApi.setSession(session);
    }

    return response;
  }

  private static extractSession<TResponse>(response: AxiosResponse<TResponse>): JwtSession | null {
    const authorizationHeader = response.headers.authorization;
    if (typeof authorizationHeader === 'string' && authorizationHeader.trim()) {
      const [tokenType, accessToken] = authorizationHeader.split(' ');
      if (accessToken) {
        return {
          accessToken,
          tokenType,
        };
      }
    }

    if (!BaseApi.isJwtResponse(response.data)) {
      return null;
    }

    return {
      accessToken: response.data.access_token,
      tokenType: response.data.token_type ?? 'bearer',
      expiresAt: response.data.expires_in
        ? Date.now() + response.data.expires_in * 1000
        : undefined,
      user: response.data.user,
    };
  }

  private static isJwtResponse<TUser = unknown>(data: unknown): data is JwtResponseShape<TUser> {
    if (!data || typeof data !== 'object') {
      return false;
    }

    return 'access_token' in data && typeof data.access_token === 'string';
  }

  private static getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
}
