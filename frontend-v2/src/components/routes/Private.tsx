import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const PrivateRoute: React.FC = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  return accessToken ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
