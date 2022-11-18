import { Router } from "express";

import { AuthMiddleware } from "@modules/auth/middlewares/express/AuthMiddleware";
import { ExpressBeachController } from "@modules/beaches/controllers/express/ExpressBeachController";

const beachesController = new ExpressBeachController();

const beachesRoutes = Router();

beachesRoutes.use(new AuthMiddleware().use());

beachesRoutes.post("/beaches", beachesController.create);

beachesRoutes.get("/beaches/:id", beachesController.getBeach);

beachesRoutes.get("/beaches", beachesController.getAllBeaches);

beachesRoutes.put("/beaches/:id", beachesController.updateBeach);

beachesRoutes.delete("/beaches/:id", beachesController.delete);

export default beachesRoutes;
