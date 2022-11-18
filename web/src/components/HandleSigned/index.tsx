import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/auth";
import Loading from "../Loading";

const HandleSigned: React.FC = () => {
  const { signed, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return signed ? <Outlet /> : <Navigate to="/" replace />;
};

export default HandleSigned;
