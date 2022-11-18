import config from "config";
import { inject, singleton } from "tsyringe";

import { IStormGlassConfig } from "@config/types/configTypes";
import { ClientRequestError } from "@core/errors/ClientRequestError";
import { StormGlassRequestError } from "@core/errors/StormGlassRequestError";
import logger from "@core/loggers/winston/logger";
import { Request } from "@core/Request";
import { Time } from "@core/Time";
import { ICacheService } from "@services/cacheService/ICacheService";

export interface IStormGlassSource {
  [key: string]: number;
}

export interface IStormGlassPoint {
  time: string;
  readonly swellDirection: IStormGlassSource;
  readonly swellHeight: IStormGlassSource;
  readonly swellPeriod: IStormGlassSource;
  readonly waveDirection: IStormGlassSource;
  readonly waveHeight: IStormGlassSource;
  readonly windDirection: IStormGlassSource;
}

export interface IStormGlassForecastResponse {
  hours: IStormGlassPoint[];
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
export class StormGlass {
  constructor(
    @inject("CacheService") private readonly cache: ICacheService,
    private readonly request: Request = new Request()
  ) {}

  private readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection";

  private readonly stormGlassAPISource = "noaa";

  private stormGlass = config.get<IStormGlassConfig>(
    "App.resources.StormGlass"
  );

  private unixTime = Time.getUnixTime();

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
      const response = await this.request.get<IStormGlassForecastResponse>(
        `/v2/weather/point?params=${this.stormGlassAPIParams}&lat=${lat}&lng=${lng}&source=${this.stormGlassAPISource}&start=${this.unixTime.start}&end=${this.unixTime.end}`,
        {
          baseURL: this.stormGlass.endpoint,
          headers: {
            Authorization: this.stormGlass.apiKey,
          },
        }
      );

      const normalizedData = this.normalizeResponse(response.data);

      return normalizedData;
    } catch (err: any) {
      if (this.request.isRequestError(err))
        throw new StormGlassRequestError(err);

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
      this.stormGlass.cacheTtl
    );
  }

  private generateCacheKey(lat: number, lng: number): string {
    return `forecast_to_${lat}_${lng}`;
  }

  private normalizeResponse(
    points: IStormGlassForecastResponse
  ): IForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassAPISource],
      swellHeight: point.swellHeight[this.stormGlassAPISource],
      swellPeriod: point.swellPeriod[this.stormGlassAPISource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassAPISource],
      waveHeight: point.waveHeight[this.stormGlassAPISource],
      windDirection: point.windDirection[this.stormGlassAPISource],
    }));
  }

  private isValidPoint(point: Partial<IStormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource]
    );
  }
}
