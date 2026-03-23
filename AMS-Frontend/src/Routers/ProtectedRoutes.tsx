import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

export default function ProtectedRoutes() {
  const { user, loading } = useAppContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}