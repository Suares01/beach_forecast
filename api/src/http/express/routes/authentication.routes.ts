import { Router } from "express";

import { ExpressAuthController } from "@modules/auth/controllers/express/ExpressAuthController";

const authController = new ExpressAuthController();

const authenticationRoutes = Router();

authenticationRoutes.post("/signin", authController.signIn);

authenticationRoutes.get("/refreshtoken", authController.refreshToken);

authenticationRoutes.post("/forgotpassword", authController.forgotPassword);

authenticationRoutes.post("/resetpassword", authController.resetPassword);

export default authenticationRoutes;
