import React from "react";
import { Route } from "react-router-dom";

import HandleSigned from "../components/HandleSigned";
import Layout from "../components/Layout";
import { BeachesContextProvider } from "../contexts/beaches";
import { ForecastsContextProvider } from "../contexts/forecasts";
import Beaches from "../pages/Beaches";
import Dashboard from "../pages/Dashboard";

const AuthRoutes = (
  <Route element={<HandleSigned />}>
    <Route element={<Layout />}>
      <Route
        path="/dashboard"
        element={
          <ForecastsContextProvider>
            <Dashboard />
          </ForecastsContextProvider>
        }
      />
      <Route
        path="/beaches"
        element={
          <BeachesContextProvider>
            <Beaches />
          </BeachesContextProvider>
        }
      />
    </Route>
  </Route>
);

export default AuthRoutes;
