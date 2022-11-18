import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import NotFoundPage from "../components/NotFoundPage";
import AuthRoutes from "./auth.routes";
import PublicRoutes from "./public.routes";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<NotFoundPage />}>
      {PublicRoutes}
      {AuthRoutes}
    </Route>
  )
);

const AppRoutes: React.FC = () => {
  return <RouterProvider router={routes} />;
};

export default AppRoutes;
