import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

export default function SuperAdminRoutes() {
  const { loading, mode } = useAppContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (mode !== "admin") {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
}