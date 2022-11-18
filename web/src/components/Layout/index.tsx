import React from "react";
import { Outlet } from "react-router-dom";

import DashboardNavbar from "../DashboardNavbar";

const Layout: React.FC = () => {
  return (
    <>
      <DashboardNavbar />
      <Outlet />
    </>
  );
};

export default Layout;
