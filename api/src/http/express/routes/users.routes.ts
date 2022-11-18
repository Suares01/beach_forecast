import { Router } from "express";

import { AuthMiddleware } from "@modules/auth/middlewares/express/AuthMiddleware";
import { ExpressUsersController } from "@modules/users/controllers/express/ExpressUsersController";

const usersController = new ExpressUsersController();

const authMiddleware = new AuthMiddleware();

const usersRoutes = Router();

usersRoutes.post("/users", usersController.create);

usersRoutes.use(authMiddleware.use());

usersRoutes.get("/users/me", usersController.me);

usersRoutes.patch("/users/username", usersController.updateUsername);

usersRoutes.patch("/users/password", usersController.updatePassword);

usersRoutes.delete("/users", usersController.delete);

export default usersRoutes;
