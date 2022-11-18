import { Router } from "express";

import { AuthMiddleware } from "@modules/auth/middlewares/express/AuthMiddleware";
import { ExpressForecastController } from "@modules/forecasts/controllers/express/ExpressForecastController";

import { RateLimiter } from "../middlewares/RateLimiter";

const rateLimiter = new RateLimiter();

const forecastController = new ExpressForecastController();

const forecastsRoutes = Router();

forecastsRoutes.use(new AuthMiddleware().use());

forecastsRoutes.get(
  "/forecasts",
  rateLimiter.use("Too many requests to the /forecast endpoint"),
  forecastController.getForecast
);

export default forecastsRoutes;
