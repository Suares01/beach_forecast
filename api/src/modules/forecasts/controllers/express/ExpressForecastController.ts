import { Request, Response } from "express";
import { container } from "tsyringe";

import { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import { ProcessForecastsUseCase } from "@modules/forecasts/useCases/ProcessForecastsUseCase";

export class ExpressForecastController {
  async getForecast(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const processForecastsUseCase = container.resolve(ProcessForecastsUseCase);

    const beachesRepository =
      container.resolve<IBeachesRepository>("BeachesRepository");

    const beaches = await beachesRepository.findAll(id);

    const forecasts = await processForecastsUseCase.processForecastForBeaches(
      beaches
    );

    return res.status(200).send(forecasts);
  }
}
