import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

export default function TenantRoutes() {
  const { loading, mode, tenant } = useAppContext();

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("TenantRoutes - mode:", mode, "tenant:", tenant);

  if (mode !== "tenant" || !tenant) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}