export type AppMode = "loading" | "admin" | "tenant" | "invalid";

export interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  active: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface AppState {
  loading: boolean;
  mode: AppMode;
  tenant: Tenant | null;
  user: User | null;
}