import config from "config";
import { format, addDays } from "date-fns";
import { inject, singleton } from "tsyringe";

import { IOpenMeteoConfig } from "@config/types/configTypes";
import { ClientRequestError } from "@core/errors/ClientRequestError";
import { OpenMeteoRequestError } from "@core/errors/OpenMeteoRequestError";
import logger from "@core/loggers/winston/logger";
import { Request } from "@core/Request";
import { ICacheService } from "@services/cacheService/ICacheService";

export interface IHourly {
  time: string[];
  wave_height: number[];
  wave_direction: number[];
  wind_wave_direction: number[];
  swell_wave_height: number[];
  swell_wave_direction: number[];
  swell_wave_period: number[];
}

export interface IOpenMeteoResponse {
  hourly: IHourly;
}

export interface IForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
}

@singleton()
export class OpenMeteo {
  constructor(
    @inject("CacheService") private readonly cache: ICacheService,
    private readonly request: Request = new Request()
  ) {}

  private openMeteoConfig = config.get<IOpenMeteoConfig>(
    "App.resources.OpenMeteo"
  );

  private readonly hourlyParams =
    "wave_height,wave_direction,wind_wave_direction,swell_wave_height,swell_wave_direction,swell_wave_period";

  public async fetchPoints(
    lat: number,
    lng: number
  ): Promise<IForecastPoint[]> {
    const cacheKey = this.generateCacheKey(lat, lng);

    const cachedForecast = await this.getForecastFromCache(cacheKey);

    if (!cachedForecast) {
      const apiForecast = await this.getForecastFromAPI(lat, lng);

      await this.setForecastInCache(cacheKey, apiForecast);

      return apiForecast;
    }

    return cachedForecast;
  }

  private async getForecastFromAPI(
    lat: number,
    lng: number
  ): Promise<IForecastPoint[]> {
    logger.info(`Get forecast from external API`);
    try {
      const times = this.getTimes();

      const response = await this.request.get<IOpenMeteoResponse>(
        `${this.openMeteoConfig.endpoint}/v1/marine?latitude=${lat}&longitude=${lng}&hourly=${this.hourlyParams}&start_date=${times.start}&end_date=${times.end}`
      );

      const normalizedData = this.normalizeResponse(response.data);

      return normalizedData;
    } catch (err: any) {
      if (this.request.isRequestError(err))
        throw new OpenMeteoRequestError(err);

      throw new ClientRequestError(err);
    }
  }

  private async getForecastFromCache(
    key: string
  ): Promise<IForecastPoint[] | undefined> {
    const forecast = await this.cache.get<IForecastPoint[]>(key);

    if (!forecast) return undefined;

    logger.info(`Get forecast from cache with key: ${key}`);

    return forecast;
  }

  private async setForecastInCache(
    key: string,
    forecast: IForecastPoint[]
  ): Promise<void> {
    logger.info(`Adding forecast in cache with key: ${key}`);

    await this.cache.set<IForecastPoint[]>(
      key,
      forecast,
      this.openMeteoConfig.cacheTtl
    );
  }

  private generateCacheKey(lat: number, lng: number): string {
    return `forecast_to_${lat}_${lng}`;
  }

  private getTimes() {
    const now = new Date();

    const start = format(now, "yyyy-MM-dd");

    const end = format(addDays(now, 1), "yyyy-MM-dd");

    return { start, end };
  }

  private normalizeResponse(points: IOpenMeteoResponse): IForecastPoint[] {
    if (!this.isValidPoint(points)) return [];

    return points.hourly.time.map((time, index) => {
      return {
        time,
        swellDirection: points.hourly.swell_wave_direction[index],
        swellHeight: points.hourly.swell_wave_height[index],
        swellPeriod: points.hourly.swell_wave_period[index],
        waveDirection: points.hourly.wave_direction[index],
        waveHeight: points.hourly.wave_height[index],
        windDirection: points.hourly.wind_wave_direction[index],
      };
    });
  }

  private isValidPoint(point: Partial<IOpenMeteoResponse>): boolean {
    return !!(
      point.hourly?.time &&
      point.hourly.swell_wave_direction.length &&
      point.hourly.swell_wave_height.length &&
      point.hourly.swell_wave_period.length &&
      point.hourly.wave_direction.length &&
      point.hourly.wave_height.length &&
      point.hourly.wind_wave_direction.length
    );
  }
}
