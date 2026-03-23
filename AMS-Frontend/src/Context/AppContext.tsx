import React, { createContext, useContext, useEffect, useState } from "react";
import { isAdminSubdomain, isTenantSubdomain } from "../Routers/domain";
import { BaseApi,tenantApi,authApi } from "../Services";
import type { AppState, Tenant, User } from "../DataObjects/types";

interface AppContextType extends AppState {
  refreshMe: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [mode, setMode] = useState<AppState["mode"]>("loading");
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const refreshMe = async () => {
    if (!BaseApi.getToken()) {
      setUser(null);
      return;
    }

    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      BaseApi.clearSession();
      setUser(null);
    }
  };

  const logout = () => {
    BaseApi.clearSession();
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (isAdminSubdomain()) {
          setMode("admin");
          await refreshMe();
          setLoading(false);
          return;
        }

        if (isTenantSubdomain()) {
          const resolvedTenant = await tenantApi.resolve();

          if (!resolvedTenant || !resolvedTenant.active) {
            setMode("invalid");
            setTenant(null);
            setUser(null);
            setLoading(false);
            return;
          }

          setTenant(resolvedTenant);
          setMode("tenant");
          await refreshMe();
          setLoading(false);
          return;
        }

        setMode("invalid");
        setLoading(false);
      } catch {
        setMode("invalid");
        setTenant(null);
        setUser(null);
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading,
        mode,
        tenant,
        user,
        refreshMe,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }

  return context;
}