import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.login);
  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;