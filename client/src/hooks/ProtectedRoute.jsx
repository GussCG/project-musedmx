import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/Auth/Iniciar" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.usr_tipo)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
