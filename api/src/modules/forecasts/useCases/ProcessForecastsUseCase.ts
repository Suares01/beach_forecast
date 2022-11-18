import _ from "lodash";
import { inject, injectable } from "tsyringe";

import { ForecastProcessingInternalError } from "@core/errors/ForecastProcessingInternalError";
import logger from "@core/loggers/winston/logger";
import { IBeach } from "@modules/beaches/entities/Beach";

import { IForecastPoint, OpenMeteo } from "../clients/OpenMeteo";
import { Rating } from "../services/Rating";

export interface IBeachForecast
  extends Pick<IBeach, "lat" | "lng" | "name" | "position">,
    IForecastPoint {
  rating: number;
}

export interface ITimeForecast {
  time: string;
  forecast: IBeachForecast[];
}

@injectable()
export class ProcessForecastsUseCase {
  constructor(
    private readonly client: OpenMeteo,
    @inject("ForecastRating") private readonly RatingService: typeof Rating
  ) {}

  public async processForecastForBeaches(
    beaches: IBeach[]
  ): Promise<ITimeForecast[]> {
    if (beaches.length === 0) return [];

    logger.info(`Preparing the forecast for ${beaches.length} beaches`);

    const beachForecast = await this.beachesForecast(beaches);

    const forecastByTime = this.mapForecastByTime(beachForecast);

    const forecastOrderedByRating =
      this.orderedForecastByRating(forecastByTime);

    return forecastOrderedByRating;
  }

  private async beachesForecast(beaches: IBeach[]): Promise<IBeachForecast[]> {
    const beachesForecast: IBeachForecast[] = [];

    for (const beach of beaches) {
      try {
        const points = await this.client.fetchPoints(beach.lat, beach.lng);

        const beachesWithForecast = this.beachesWithForecast(points, beach);

        beachesForecast.push(...beachesWithForecast);
      } catch (err: any) {
        throw new ForecastProcessingInternalError(err.message);
      }
    }

    return beachesForecast;
  }

  private beachesWithForecast(
    points: IForecastPoint[],
    beach: IBeach
  ): IBeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        position: beach.position,
        name: beach.name,
        rating: new this.RatingService(beach).getRateForPoint(point),
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: IBeachForecast[]): ITimeForecast[] {
    const forecastByTime: ITimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }

  private orderedForecastByRating(forecasts: ITimeForecast[]): ITimeForecast[] {
    return forecasts.map((forecast) => ({
      time: forecast.time,
      forecast: _.orderBy<IBeachForecast>(
        forecast.forecast,
        ["rating"],
        ["desc"]
      ),
    }));
  }
}
