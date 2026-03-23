import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider, useAppContext } from "../Context/AppContext";
import ProtectedRoutes from "./ProtectedRoutes";
import GuestRoutes from "./GuestRoutes";
import TenantRoutes from "./TenantRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import { hasSubDomain } from "../config";

// Demo pages
function LoadingPage() {
  return <div>Loading application...</div>;
}

function InvalidTenantPage() {
  return <div>Invalid tenant or subdomain</div>;
}

function NotFoundPage() {
  return <div>404 Not Found</div>;
}

// Admin pages
function AdminLoginPage() {
  return <div>Admin Login</div>;
}

function AdminDashboardPage() {
  return <div>Admin Dashboard</div>;
}

function ClientManagementPage() {
  return <div>Client Management</div>;
}

// Tenant pages
function TenantLoginPage() {
  return <div>Tenant Login</div>;
}

function TenantDashboardPage() {
  return <div>Tenant Dashboard</div>;
}

function ProductPage() {
  return <div>Tenant Products</div>;
}

function RouterContent() {
  const { loading, mode } = useAppContext();

  if (loading) {
    return <LoadingPage />;
  }

  if (mode === "invalid") {
    return (
      <Routes>
        <Route path="*" element={<InvalidTenantPage />} />
      </Routes>
    );
  }

  if(hasSubDomain === false) {
    return (
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<SuperAdminRoutes />}>
            <Route element={<GuestRoutes />}>
            <Route path="/login" element={<AdminLoginPage />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<AdminDashboardPage />} />
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            <Route path="/clients" element={<ClientManagementPage />} />
            </Route>
        </Route>
        {/* Tenant routes */}
        <Route path="*" element={<TenantRoutes />}>
            <Route element={<GuestRoutes />}>
            <Route path="/login" element={<TenantLoginPage />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<TenantDashboardPage />} />
            <Route path="/dashboard" element={<TenantDashboardPage />} />
            <Route path="/products" element={<ProductPage />} />
            </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Admin routes */}
      <Route element={<SuperAdminRoutes />}>
        <Route element={<GuestRoutes />}>
          <Route path="/login" element={<AdminLoginPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/clients" element={<ClientManagementPage />} />
        </Route>
      </Route>

      {/* Tenant routes */}
      <Route element={<TenantRoutes />}>
        <Route element={<GuestRoutes />}>
          <Route path="/login" element={<TenantLoginPage />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<TenantDashboardPage />} />
          <Route path="/dashboard" element={<TenantDashboardPage />} />
          <Route path="/products" element={<ProductPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function Routers() {
  return (
    <AppProvider>
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </AppProvider>
  );
}