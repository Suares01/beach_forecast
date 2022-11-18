import { Router } from "express";

import authenticationRoutes from "./authentication.routes";
import beachesRoutes from "./beaches.routes";
import docsRoutes from "./docs.routes";
import forecastsRoutes from "./forecasts.routes";
import usersRoutes from "./users.routes";

const routes = Router();

routes.use("/healthcheck", (_, res) => {
  return res.status(200).send("ok");
});

routes.use(docsRoutes);
routes.use(authenticationRoutes);
routes.use(usersRoutes);
routes.use(beachesRoutes);
routes.use(forecastsRoutes);

export default routes;
